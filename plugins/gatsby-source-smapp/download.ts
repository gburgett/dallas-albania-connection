import * as requestLib from 'request'
import {Request, Response, RequestCallback} from 'request'
import * as cheerio from 'cheerio'
import * as querystring from 'querystring'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as FileCookieStore from 'tough-cookie-file-store'
import chalk from 'chalk'

require('request-debug')(requestLib, function(type, data, r) {
  switch(type) {
    case 'request':
      process.stderr.write(chalk.cyan(`${data.debugId} ${data.method} ${data.uri}`))
      break;
    case 'response':
      if (data.statusCode >= 400) {
        process.stderr.write(chalk.red(` ${data.statusCode}\n`))
        console.error(data.body)
      } else if(data.statusCode == 302) {
        process.stderr.write(chalk.yellow(` ${data.statusCode} ==> ${data.headers['location']}\n`))
      } else {
        process.stderr.write(chalk.green(` ${data.statusCode}\n`))
      }
      break;
    default:
      process.stderr.write(chalk.green(` ${data.statusCode} ==> ${data.uri}\n`))
  }
})

export interface IDownloadArgs {
  dataDir: string,
  username: string,
  password: string
}

export default async function Download(args: IDownloadArgs) {

  // the FileCookieStore has problems saving cookies sometimes.
  await fs.ensureFile('cookies.json')
  if ((await fs.readFile('cookies.json')).length == 0 && fs.existsSync('cookies.bak')) {
    await fs.copy('cookies.bak', 'cookies.json')
  }
  const store=  new FileCookieStore('cookies.json')
  const jar = requestLib.jar(store)
  const request = requestLib.defaults({ jar: jar, followRedirect: false })

  function p(req: (cb: RequestCallback) => Request): Promise<Response> {
    return new Promise((resolve, reject) => {
      req((err, resp, body) => {
        if (err) {
          reject(err)
          return
        }
  
        if(resp.statusCode == 302) {
          request.get(resp.headers['location'], (err, resp, body) => {
            if (err) {
              reject(err)
              return
            }

            resolve(resp)
          })
        } else {
          resolve(resp)
        }
      })
    })
  }

  let resp = await p(c => request.get('https://smapp.cru.org/admin/reports/mpd_summary', c))
  
  let $ = cheerio.load(resp.body)
  if(resp.url.match(/signin/) || $('#login_form').length > 0)
  {
    // do the sign in
    let post_data = {}
    $('#login_form input').each((i, el) => post_data[el.attribs['name']] = (el.attribs['value'] || 'unknown' ))
    post_data['username'] = args.username
    post_data['password'] = args.password
  
    let action = 'https://signin.relaysso.org' + $('#login_form').attr('action')
    const formData = querystring.stringify(post_data);
    const contentLength = formData.length;
  
    resp = await p(c => request.post(action, 
          { 
            headers: {
              'Content-Length': contentLength,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
          }, 
        c
      )
    )

    $ = cheerio.load(resp.body)

    if (resp.request.uri.href.match(/signin/)) {

      throw new Error(`Unable to sign in as user '${args.username}'!\n\tOn page ${resp.request.uri.href}\n\t${$('#status').text()}`)
    }

    console.log('Response:')
    console.log(resp.headers)
    console.log(resp.body)
  }

  const projIds = []
  $('a').each((i, elem) => {
    const href = elem.attribs['href']
    // https://smapp.cru.org/admin/reports/mpd_summary?project_id=1444
    const m = href.match(/\/admin\/reports\/mpd_summary\?.*project_id\=(\d+)/)
    if (!m) {
      return
    }

    projIds.push(m[1])
  })

  const promises = projIds.map(async (projId) => {
    const csvFile = `${projId}.csv`

    await fs.ensureFile(path.join(args.dataDir, csvFile))

    return await new Promise<string>((resolve, reject) => {
      request(`https://smapp.cru.org/admin/reports/mpd_summary.csv?project_id=${projId}`)
        .pipe(fs.createWriteStream(path.join(args.dataDir, csvFile)))
        .on('error', (err) => {
          reject(err)
        })
        .on('finish', () => {
          console.log('Finished downloading proj', projId, 'to', path.join(args.dataDir, csvFile))
          resolve(csvFile)
        })
    })
  })

  // ensure the cookies get saved
  await fs.writeFile('cookies.bak', JSON.stringify(store.idx))

  const csvFiles = await Promise.all(promises)
  return csvFiles
}