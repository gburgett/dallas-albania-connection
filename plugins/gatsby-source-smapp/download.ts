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
      break;
    case 'response':
      process.stderr.write(chalk.cyan(`${data.debugId} ${r.method} ${r.uri.href}`))
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
  const request = promisify(requestLib.defaults({ jar: jar, followRedirect: false }))

  // exec
  return await (async () => {
    /** step 1 - get the mpd_summary page to find project IDs */
    let resp = await request.get('https://smapp.cru.org/admin/reports/mpd_summary')
    
    let $ = cheerio.load(resp.body)
    if(resp.url.match(/signin/) || $('#login_form').length > 0)
    {
      /** sign in if necessary */
      resp = await signIn($)
    }

    /** Step 2 - parse out project IDs */
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

    /** step 3 - map those project IDs to CSV files */
    const promises =  projIds.map(downloadProjectCsv)
    const csvFiles = await Promise.all(promises)

    // ensure the cookies get saved
    await fs.writeFile('cookies.bak', JSON.stringify(store.idx))
    return csvFiles
  })()

  /** execute the sign in POST request and set session cookies */
  async function signIn($: CheerioStatic) {
    // do the sign in
    let post_data = {}
    $('#login_form input').each((i, el) => post_data[el.attribs['name']] = (el.attribs['value'] || 'unknown' ))
    post_data['username'] = args.username
    post_data['password'] = args.password
  
    let action = 'https://signin.relaysso.org' + $('#login_form').attr('action')
    const formData = querystring.stringify(post_data);
    const contentLength = formData.length;
  
    const resp = await request.post(action, 
          { 
            headers: {
              'Content-Length': contentLength,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
          })

    if (resp.request.uri.href.match(/signin/)) {
      const $ = cheerio.load(resp.body)

      throw new Error(`Unable to sign in as user '${args.username}'!\n\tOn page ${resp.request.uri.href}\n\t${$('#status').text()}`)
    }
    return resp
  }

  async function downloadProjectCsv(projId: string): Promise<string> {
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
  }

}

/** Makes the request API use promises. */
function promisify<TReq extends requestLib.Request, TOptions, TRequiredUriUrl>(
    request: requestLib.RequestAPI<TReq, TOptions, TRequiredUriUrl>
  ) {
  
  const extendedLib = function(uri: string, options?: TOptions) {
    return request(uri);
  }
  return Object.assign(extendedLib, {
    get: (url: string) => p(c => request.get(url, c)),
    post: (url: string, options: TOptions) => p(c => request.post(url, options, c))
  });

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
}

