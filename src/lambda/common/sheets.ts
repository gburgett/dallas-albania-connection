import { sheets_v4 } from "googleapis";


export async function findContactRows(contact: string, sheets: sheets_v4.Sheets): Promise<number[]> {
  contact = (contact || '').replace(/\D+/g, '').trim()
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
      const col0 = (row[0] || '').replace(/\D+/g, '').trim()
      if (col0 == contact) {
        return i + 1
      }
    })
    .filter(r => r)

  return toDelete
}