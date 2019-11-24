import {google} from 'googleapis'

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
    await updateRow(foundRows[0], body.contact, data, sheets)
  } else {
    await appendToSheet(body.contact, data, sheets)
  }

  return null;
}

export async function appendToSheet(contact, data, sheets) {
  const rowValues = [(contact || '').trim(), ...data]
  const resp = await sheets.spreadsheets.values.append({
    spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
    range: 'A1:A',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [rowValues],
    },
  });
}

export async function updateRow(rowNumber, contact, data, sheets) {
  const row = await sheets.spreadsheets.values.get({
    spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
    range: `A${rowNumber}:${rowNumber}`
  });

  const rowValues = row.data.values[0]
  // copy new values over old cells
  rowValues[0] = contact;
  for(let i = 0; i < data.length; i++) {
    rowValues[i + 1] = data[i];
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
