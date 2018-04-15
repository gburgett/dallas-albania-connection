import * as fs from 'fs-extra'
import * as csv from 'csvtojson'
import * as path from 'path'
import * as csvStringify from 'csv-stringify'

import {asyncWriter} from './plugins/gatsby-source-smapp/utils'

const dataDir = 'data/donations'

async function run() {
  const files = await fs.readdir(dataDir)
  console.log('files', files)

  return Promise.all(files.map(async (file) => {
    const csvJson = await convertToJson(path.join(dataDir, file)) as ICsvRow[]

    const grouped = groupByDesignation(csvJson)
    const rows = Object.keys(grouped).map(number => 
      sum(grouped[number])
    )

    return writeCsv(path.join(dataDir, file), rows)
  }))
}

run().then(() => {
    console.log('finished')
  }).catch((err) => {
    console.error('err', err)
    process.exit(-1)
  })

function convertToJson(file, options?) {
  return new Promise((res, rej) => {
    csv(options)
      .fromFile(file)
      .on('error', (err) => rej(err))
      .on(`end_parsed`, jsonData => {
        console.log('end_parsed', file)
        if (!jsonData) {
          rej(`CSV to JSON conversion failed!`)
        }

        res(jsonData)
      })
  })
}

function groupByDesignation(rows: ICsvRow[]): { [number: string]: ICsvRow[] } {
  const ret: any = {}
  rows.forEach(row => {
    const arr = ret[row["Designation #"]] || []
    arr.push(row)
    ret[row["Designation #"]] = arr
  })
  return ret
}

async function writeCsv(filePath: string, rows: ICsvRow[]): Promise<void> {
  const fileStream = fs.createWriteStream(filePath)
    var csvStream = csvStringify({ header: true });
    csvStream.pipe(fileStream)
    const write = asyncWriter(csvStream)

    for (var row of rows) {
      await write(row)
    }

    csvStream.end()
    return new Promise<void>((resolve, reject) => {
      fileStream.on('close', () => resolve())
      fileStream.on('error', (err) => reject(err))
    })
}

function sum(rows: ICsvRow[]): ICsvRow {
  const ret = Object.assign({}, rows[0])
  const total = rows.map(r => parseAmount(r.Amount))
    .reduce((running, amt) => running + amt, 0)
  ret.Amount = `$${total}`
  ret["Donor Name"] = "redacted"
  ret.Medium = "aggregate"
  return ret
}

interface ICsvRow { 
  'Student Name': string,
  'Designation #': string,
  Date: string,
  Amount: string,
  'Donor Name': string,
  Medium: string
}

const smappAmountRegex = /^\$([0-9\.]+)$/
function parseAmount(smappAmount: string): number {
  const matches = smappAmount.match(smappAmountRegex)
  if (!matches) {
    return parseFloat(smappAmount)
  }

  return parseFloat(matches[1])
}