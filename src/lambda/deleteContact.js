import handler from './deleteContact/index'

exports.handler = function(event, context, callback) {
  handler(event, context)
    .then((body) => callback(null, {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    }))
    .catch((err) => callback(err.toString(), {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(err)
    }))
}
