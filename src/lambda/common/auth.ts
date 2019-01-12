import * as fs from 'fs-extra';
import {google} from 'googleapis';

export async function loadAuth(scopes) {
  let credentialFile = process.env['GOOGLE_APPLICATION_CREDENTIALS']
  if (!credentialFile || credentialFile.length == 0) {
    throw new Error('Please set GOOGLE_APPLICATION_CREDENTIALS')
  }

  let isJson = false
  try {
    JSON.parse(credentialFile)
    isJson = true
  } catch(e) {
    // not JSON - points to a file.
    console.log('Credentials already parsed')
  }

  if (isJson) {
    await fs.writeFile('/tmp/credentials.json', credentialFile)
    process.env['GOOGLE_APPLICATION_CREDENTIALS'] = credentialFile = '/tmp/credentials.json'
  }

  return await google.auth.getClient({
    // Scopes can be specified either as an array or as a single, space-delimited string.
    scopes
  });
}
