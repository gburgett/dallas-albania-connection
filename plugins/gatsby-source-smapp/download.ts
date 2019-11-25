import * as requestLib from 'request'
import * as cheerio from 'cheerio'
import * as querystring from 'querystring'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as tough from 'tough-cookie'
import FileCookieStore from 'tough-cookie-file-store'
import * as csvStringify from 'csv-stringify'
import chalk from 'chalk'

import { promisify, asyncWriter } from './utils';

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
  password: string,
  sessionId?: string
}

export default async function Download(args: IDownloadArgs, cookies?: any, saveCookies?: (cookies: any) => void) {

  // prepare dependencies
  await fs.ensureFile('cookies.json')
  const store = new FileCookieStore('cookies.json')
  if (cookies) {
    store.idx = deserializeCookies(cookies)
  }
  const jar = requestLib.jar(store)
  if (args.sessionId) {
    jar.setCookie(`_session_id=${args.sessionId}`, 'https://smapp.cru.org')
  }

  const request = promisify(requestLib.defaults({ jar: jar, followRedirect: false }))

  // run it
  const csvFiles = await exec()

  // save state
  if (saveCookies) {
    saveCookies(store.idx)
  }
  return csvFiles

  /** Implementation follows */

  // exec - main entry point
  async function exec() {
    /** step 1 - get the mpd_summary page to find project IDs */
    let resp = await request.get('https://smapp.cru.org/admin/reports/mpd_summary')
    
    let $ = cheerio.load(resp.body)
    if(resp.url.match(/signon/) || $('#login_form').length > 0)
    {
      /** sign in if necessary */
      resp = await signIn($, resp.request)
      $ = cheerio.load(resp.body)
    }

    /** Step 2 - parse out project IDs */
    const projIds = new Set<string>()
    $('a').each((i, elem) => {
      const href = elem.attribs['href']
      // https://smapp.cru.org/admin/reports/mpd_summary?project_id=1444
      const m = href.match(/\/admin\/reports\/mpd_summary\?.*project_id\=(\d+)/)
      if (!m) {
        return
      }

      projIds.add(m[1])
    })

    /** step 3 - map those project IDs to CSV files */
    const promises = Array.from(projIds).map(async (projId) => {
      const details = await getAllDonationLinksForProject(projId)
      if (details.participants.length > 0) {
        return generateCsvForProject(details)
      }
    })

    return Promise.all(promises)
  }

  /** execute the sign in POST request and set session cookies */
  async function signIn($: CheerioStatic, req: requestLib.Request) {
    // do the sign in
    let post_data = {}
    $('#login_form input').each((i, el) => post_data[el.attribs['name']] = (el.attribs['value'] || 'unknown' ))
    post_data['username'] = args.username
    post_data['password'] = args.password
  
    let action = $('#login_form').attr('action')
    action = action ? req.host + action : req.href
    const formData = querystring.stringify(post_data);
    const contentLength = formData.length;
  
    const resp = await request.post(action, 
          { 
            headers: {
              'Content-Length': contentLength,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'teamalbania.org smapp download script'
            },
            body: formData
          })

    if (resp.request.uri.href.match(/signon/)) {
      const $ = cheerio.load(resp.body)

      throw new Error(`Unable to sign in as user '${args.username}'!\n\tOn page ${resp.request.uri.href}\n\t${$('#status').text()}`)
    }
    return resp
  }

  /** Gets a link like /admin/applications/1442/other_donations?staff_id=27744 for each person on the project */
  async function getAllDonationLinksForProject(projId: string): Promise<IProjectDetails> {
    const resp = await request.get(`https://smapp.cru.org/admin/projects/${projId}`)
    const $ = cheerio.load(resp.body)

    const participants: IParticipantDetails[] = []
    $('table.people tr:not(:first-child)').each((i, tr) => {
      const $tr = $(tr);
      participants.push({
        studentName: $tr.children('.name').text(),
        designationNum: $tr.children('.designation').text(),
        balance: $tr.children('.balance').text(),
        donationListLink: $tr.find('.balance a').attr('href')
      })
    })

    return {
      projectId: projId,
      participants
    }
  }

  /** Writes a CSV file for each project by following the other_donations links and parsing each <tr> */
  async function generateCsvForProject(project: IProjectDetails): Promise<string> {
    const fileName = `${project.projectId}.csv`
    const filePath = path.join(args.dataDir, fileName)

    await fs.ensureFile(filePath)
    const fileStream = fs.createWriteStream(filePath)
    var columns = [
       'Student Name',
       'Designation #',
       'Date',
       'Amount',
       'Donor Name',
       'Medium'
    ];
    var csvStream = csvStringify({ header: true, columns: columns });
    csvStream.pipe(fileStream)
    const write = asyncWriter(csvStream)

    try {
      const promises = project.participants.map(async (participant) => {
        if (!participant.donationListLink) {
          return
        }

        const resp = await request.get('https://smapp.cru.org' + participant.donationListLink)
        const $ = cheerio.load(resp.body)

        const writePromises = $('table.donations tr:not(:first-child)').toArray().map((tr) => {
          const tableDivs = $(tr).children('td')
          if (tableDivs.first().text().match(/total/i)) {
            // this is the "total" row
            return;
          }

          const row = [participant.studentName, participant.designationNum]

          // ["2018-03-31", "$50.00", "Smith, John and Jane", "Credit Card"]
          tableDivs.each((i2, td) => {
            let text = $(td).text();
            row.push(text.trim())
          })
          return write(row)
        })
        return Promise.all(writePromises)
      })

      await Promise.all(promises)
    } finally {
      csvStream.end()
    }

    await new Promise((resolve, reject) => {
      fileStream.on('close', () => {
        console.log('Finished downloading proj', project.projectId, 'to', filePath)
        resolve()
      })
      fileStream.on('error', (err) => reject(err))
    })

    return filePath
  }

  /** Old way - the report download does not include team leaders */
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

interface IProjectDetails {
  projectId: string,
  participants: IParticipantDetails[]
}

interface IParticipantDetails {
  studentName: string,
  designationNum: string,
  balance: string,
  /** something like /admin/applications/1442/other_donations?staff_id=27744 */
  donationListLink: string
}

interface IDonationDetails {
  date: string,
  amount: string,
  donorName: string,
  medium: string
}

interface ICsvRow {
  studentName: string,
  designationNum: string,
  date: string,
  amount: string,
  donorName: string,
  medium: string
 }

 // https://github.com/ivanmarban/tough-cookie-file-store/blob/master/lib/file-store.js#L251
 function deserializeCookies(dataJson: any): any {
  for (var domainName in dataJson) {
    for (var pathName in dataJson[domainName]) {
      for (var cookieName in dataJson[domainName][pathName]) {
          dataJson[domainName][pathName][cookieName] = tough.fromJSON(JSON.stringify(dataJson[domainName][pathName][cookieName]));
      }
    }
  }
  return dataJson
 }