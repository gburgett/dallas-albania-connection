import csv from 'csvtojson'
import * as _ from 'lodash'
import * as crypto from 'crypto'
import * as path from 'path'
import * as fs from 'fs-extra'

const convertToJson = async (data, options) => {
  const jsonData = await csv(options).fromString(data)

  if (!jsonData) {
    throw new Error(`CSV to JSON conversion failed!`)
  }

  return jsonData.map(row => {
    Object.keys(row).forEach(key => {
      const camelCased = _.camelCase(key)
      if (camelCased != key) {
        row[camelCased] = row[key]
        delete(row[key])
      }
    })
    return row
  })
}

async function onCreateNode(
  { node, actions },
  options
) {
  const { createNode, createParentChildLink } = actions
  // Filter out non-csv content
  if (node.extension !== `smapp`) {
    return
  }
  // Load CSV contents
  const content = await loadNodeContent(node)
  // Parse
  let parsedContent = await convertToJson(content, options)

  if (_.isArray(parsedContent)) {
    let csvArray = parsedContent.map((obj, i) => {
      const objStr = JSON.stringify(obj)
      const contentDigest = crypto
        .createHash(`md5`)
        .update(objStr)
        .digest(`hex`)

      return {
        ...obj,
        name: node.name,
        year: path.basename(node.dir),
        id: obj.id ? obj.id : `${node.id} [${i}] >>> CSV`,
        children: [],
        parent: node.id,
        internal: {
          contentDigest,
          // TODO make choosing the "type" a lot smarter. This assumes
          // the parent node is a file.
          // PascalCase
          type: _.upperFirst(_.camelCase(`${node.internal.type} Csv`)),
        },
      }
    })

    // Strip out duplicates - this can happen when two students share a designation
    // (ex. a married couple)
    csvArray = _.uniqBy(csvArray, node => {
      return node.designation + node.amount + node.date + node.donorName
    })

    _.each(csvArray, y => {
      createNode(y)
      createParentChildLink({ parent: node, child: y })
    })
  }

  return
}

function loadNodeContent(fileNode) {
  return fs.readFile(fileNode.absolutePath, `utf-8`)
}

exports.onCreateNode = onCreateNode
