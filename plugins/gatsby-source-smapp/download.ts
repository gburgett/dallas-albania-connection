import * as requestLib from 'request'
import * as cheerio from 'cheerio'
import * as querystring from 'querystring'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as FileCookieStore from 'tough-cookie-file-store'
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
    const promises = projIds.map(getAllDonationLinksForProject)
      .map(async (p) => generateCsvForProject(await p))

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

    return fileName
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