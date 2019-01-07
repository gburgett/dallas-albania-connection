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

  const toDelete = await findContactRows(body, sheets)

  if (!toDelete || toDelete.length == 0) {
    return null;
  }

  console.log('deleting rows', toDelete)

  await sheets.spreadsheets.values.clear({
    spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
    range: toDelete.map((row) => `A${row}:${row}`).join(',')
  })
  await deleteRows(toDelete, sheets)

  return null;
}

export async function findContactRows(body, sheets) {
  const contact = (body.contact || '').replace(/\D+/, '').trim()
  if (!contact || contact.length == 0) {
    throw new Error('no contact given')
  }

  const got = await sheets.spreadsheets.values.get({
    spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
    range: 'A1:A'
  });

  if (!got.data.values || got.data.values.length == 0) {
    return [];
  }

  const toDelete = got.data.values
    .map((row, i) => {
      const col0 = (row[0] || '').replace(/\D+/, '').trim()
      if (col0 == contact) {
        return i + 1
      }
    })
    .filter(r => r)

  return toDelete
}

export async function deleteRows(toDelete, sheets) {
}