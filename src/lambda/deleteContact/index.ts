const {google} = require('googleapis');

const {loadAuth} = require('../common/auth');
const {findContactRows} = require('../common/sheets');

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

  const toDelete = await findContactRows(body.contact, sheets)

  if (!toDelete || toDelete.length == 0) {
    return null;
  }

  console.log('deleting rows', toDelete)

  for (var row of toDelete) {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
      range: `A${row}:${row}`
    })
    console.log('deleted row', row)
  }

  return null;
}
