import test from 'ava'

const { appendToSheet } = require('./index');

test('posts new info to google sheet', async (t) => {
  const body = {
    contact: '+19725551234',
    data: 'test testerson test@test.com'
  }
  
  let appendData
  const sheets = {
    spreadsheets: {
      values: {
        append: function(data) {
          appendData = data
          return Promise.resolve()
        }
      }
    }
  }

  // act
  await appendToSheet(body.contact, body.data.split(/\s+/), sheets);

  t.deepEqual(appendData.requestBody.values,
    [[ '+19725551234', 'test', 'testerson', 'test@test.com' ]]);
})

function makeEvent(body, method = 'POST') {
  return {
    path: '/add_contact_to_google_sheet',
    httpMethod: method,
    queryStringParameters: {},
    headers:
    { host: 'localhost:9000',
      'user-agent': 'curl/7.54.0',
      accept: '*/*',
      'content-length': '56',
      'content-type': 'application/x-www-form-urlencoded' },
    body: JSON.stringify(body),
    isBase64Encoded: false
  }
}