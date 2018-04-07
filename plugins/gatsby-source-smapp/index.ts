import * as fs from 'fs-extra'
import * as path from 'path'
import {createFileNode} from 'gatsby-source-filesystem/create-file-node'

import download from './download'

export async function sourceNodes(
  { boundActionCreators, store },
  { username, password, dataDir }
) {
  const { createNode } = boundActionCreators
  dataDir = dataDir || 'data/'

  let downloaded = await download({
    dataDir,
    username,
    password
  })

  downloaded.push(...(await fs.readdir(dataDir)))
  downloaded = downloaded.filter((elem, pos) =>
    downloaded.indexOf(elem) == pos
  )

  const promises = downloaded.map(async (csvFile) => {
    const node = await createFileNode(path.join(dataDir, csvFile))
    Object.assign(node.internal, {
      type: "SmappExport"
    })
    Object.assign(node, {
      extension: "smapp"
    })
    createNode(node)
  })

  await Promise.all(promises)
}

export function loadNodeContent(fileNode) {
  return fs.readFile(fileNode.absolutePath, `utf-8`)
}