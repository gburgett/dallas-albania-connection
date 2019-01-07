const {google} = require('googleapis');

const {loadAuth} = require('../common/auth');

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
  
  appendToSheet(body, sheets)

  return null;
}

export async function appendToSheet(body, sheets) {
  const data = body.data ? body.data.split(/\s+/) : []

  await sheets.spreadsheets.values.append({
    spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
    range: 'A1:A',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[(body.contact || '').trim(), ...data]],
    },
  });
}