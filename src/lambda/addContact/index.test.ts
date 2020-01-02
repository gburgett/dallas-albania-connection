import { appendToSheet, updateRow } from './index'

describe('appendToSheet', () => {
  test('posts new info to google sheet', async () => {
    const body = {
      contact: '+19725551234',
      message: 'albania',
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
    await appendToSheet(body.contact, body.message, body.data.split(/\s+/), sheets as any);

    expect(appendData.requestBody.values).toEqual(
      [[ '+19725551234', 'albania', 'test', 'testerson', 'test@test.com' ]]);
  })

  test('updates google sheet', async () => {
    const body = {
      contact: '+19725551234',
      message: 'other',
      data: 'test testerson test@test.com'
    }

    const existing = [
      [ '+19725551234', 'albania', 'test', 'q' ]
    ]
    
    let updateData
    const sheets = {
      spreadsheets: {
        values: {
          get: function(data) {
            return Promise.resolve({
              data: {
                values: existing,
              }
            })
          },
          update: function(data) {
            updateData = data
            return Promise.resolve({
              data: {
                updatedRange: data.range
              }
            })
          }
        }
      }
    }

    // act
    await updateRow(1, body.contact, body.message, body.data.split(/\s+/), sheets as any);

    expect(updateData.requestBody.values).toEqual(
      [[ '+19725551234', 'albania,other', 'test', 'testerson', 'test@test.com' ]]);
  })

  test('keeps unique segments', async () => {
    const body = {
      contact: '+19725551234',
      message: 'Albania',
      data: 'test testerson test@test.com'
    }

    const existing = [
      [ '+19725551234', 'def,albania,abc', 'test', 'q' ]
    ]
    
    let updateData
    const sheets = {
      spreadsheets: {
        values: {
          get: function(data) {
            return Promise.resolve({
              data: {
                values: existing,
              }
            })
          },
          update: function(data) {
            updateData = data
            return Promise.resolve({
              data: {
                updatedRange: data.range
              }
            })
          }
        }
      }
    }

    // act
    await updateRow(1, body.contact, body.message, body.data.split(/\s+/), sheets as any);

    expect(updateData.requestBody.values).toEqual(
      [[ '+19725551234', 'abc,albania,def', 'test', 'testerson', 'test@test.com' ]]);
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
})