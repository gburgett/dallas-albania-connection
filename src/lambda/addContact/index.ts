import {google, sheets_v4} from 'googleapis'

import {loadAuth} from '../common/auth'
import {findContactRows} from '../common/sheets';

export default async function handler(event, context) {
  const auth = await loadAuth([
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
  ])

  const sheets = google.sheets({
    version: 'v4',
    auth
  });

  const body = JSON.parse(event.body)
  const data = body.data ? body.data.split(/\s+/) : []

  const foundRows = await findContactRows(body.contact, sheets)
  if (foundRows && foundRows.length > 0) {
    await updateRow(foundRows[0], body.contact, body.message, data, sheets)
  } else {
    await appendToSheet(body.contact, body.message, data, sheets)
  }

  return null;
}

export async function appendToSheet(contact: string, segment: string, data: string[], sheets: sheets_v4.Sheets) {
  const rowValues = [(contact || '').trim(), segment, ...data]
  const resp = await sheets.spreadsheets.values.append({
    spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
    range: 'A1:A',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [rowValues],
    },
  });
}

export async function updateRow(rowNumber: number, contact: string, segment: string, data: string[], sheets: sheets_v4.Sheets) {
  const row = await sheets.spreadsheets.values.get({
    spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
    range: `A${rowNumber}:${rowNumber}`
  });

  const rowValues = row.data.values[0] as string[]
  // copy new values over old cells
  rowValues[0] = contact;

  // append to comma separated list of segments
  const oldSegments = (rowValues[1] || '').split(',')
  let newSegments = [
    ...oldSegments,
    segment
  ].map((s) => s.trim().toLowerCase())
    .filter((s) => s && s.length > 0)
    .filter(onlyUnique)
    .sort()
  rowValues[1] = newSegments.join(',')

  for(let i = 0; i < data.length; i++) {
    rowValues[i + 2] = data[i];
  }

  const resp = await sheets.spreadsheets.values.update({
    spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
    range: `A${rowNumber}:${rowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [rowValues],
    },
  });

  console.log('updated', resp.data.updatedRange, 'with', rowValues)
}

function onlyUnique(value: string, index: number, self: string[]) { 
  return self.indexOf(value) === index;
}
