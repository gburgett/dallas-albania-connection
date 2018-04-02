require('ts-node').register({ /* options */ })
var plugin = require('./');

exports.sourceNodes = (utils, properties) => {
  return plugin.sourceNodes(utils, properties)
};