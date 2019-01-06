const fs = require('fs-extra');
const {google} = require('googleapis');

async function loadAuth(scopes) {
  let credentialFile = process.env['GOOGLE_APPLICATION_CREDENTIALS']
  if (!credentialFile || credentialFile.length == 0) {
    throw new Error('Please set GOOGLE_APPLICATION_CREDENTIALS')
  }

  try {
    JSON.parse(credentialFile)

    await fs.writeFile('credentials.json', credentialFile)
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = credentialFile = 'credentials.json'

  } catch(e) {
    // not JSON - points to a file.
    console.log('Not a JSON file', e)
  }

  return await google.auth.getClient({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes
  });
}

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

  sheets.spreadsheets.values.append({
    spreadsheetId: '1zPr4lam-rZihE7_gtSmWrEK6nROLemZep6h34w33gPE',
    range: 'A1:A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[(body.contact || '').trim(), ...(body.rows || [])]],
    },
  });

  return null;
}
