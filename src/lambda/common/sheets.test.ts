import test from 'ava'

import {findContactRows} from './sheets';

test('finds contact rows in sheet', async (t) => {
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

  t.deepEqual(rows, [ 1 ])
})
