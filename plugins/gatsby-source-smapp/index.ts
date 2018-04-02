import * as fs from 'fs-extra'
import * as path from 'path'
import {createFileNode} from 'gatsby-source-filesystem/create-file-node'

export async function sourceNodes(
  { boundActionCreators, store },
  { username, password, dataDir }
) {
  const { createNode } = boundActionCreators
  dataDir = dataDir || 'data/'

  const downloaded = await fs.readdir(dataDir)

  downloaded.forEach(async (csvFile) => {
    const node = await createFileNode(path.join(dataDir, csvFile))
    Object.assign(node.internal, {
      type: "SmappExport"
    })
    Object.assign(node, {
      extension: "smapp"
    })
    createNode(node)
  })
}

export function loadNodeContent(fileNode) {
  return fs.readFile(fileNode.absolutePath, `utf-8`)
}