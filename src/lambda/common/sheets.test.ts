import {findContactRows} from './sheets';

describe('findContactRows', () => {
  test('finds contact rows in sheet', async () => {
    const body = {
      contact: '+19725551234'
    }
    const values = [
      [ '19725551234' ]
    ]
    const sheets = {
      spreadsheets: {
        values: {
          get: () => (
            Promise.resolve({ data: { values } })
          )
        }
      }
    }

    // act
    const rows = await findContactRows(body.contact, sheets);

    expect(rows).toEqual([ 1 ])
  })
})
