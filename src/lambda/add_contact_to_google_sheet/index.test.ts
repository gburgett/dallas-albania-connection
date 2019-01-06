import test from 'ava'

import handler from './index'
import { IEvent } from '../common/types';

test('posts new info to google sheet', async (t) => {
  const evt = makeEvent(
    { "contact": "+19722759023 ",  "message": "albania" }
  )
  const context = {}

  // act
  await handler(evt, context);

  t.true(true);
})

function makeEvent(body: any, method: IEvent['httpMethod'] = 'POST'): IEvent {
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