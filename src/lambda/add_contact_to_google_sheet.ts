import handler from './add_contact_to_google_sheet/index'
import { IEvent } from './common/types';

exports.handler = function(event: IEvent, context, callback) {
  handler(event, context)
    .then((body: string) => callback(null, {
      statusCode: 200,
      body: body || ''
    }))
    .catch((err) => callback(err.toString(), {
      statusCode: 500,
      body: err.toString()
    }))
}
