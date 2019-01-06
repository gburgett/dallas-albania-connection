import handler from './addContact/index'

exports.handler = function(event, context, callback) {
  handler(event, context)
    .then((body) => callback(null, {
      statusCode: 200,
      body: body || ''
    }))
    .catch((err) => callback(err.toString(), {
      statusCode: 500,
      body: err.toString()
    }))
}
