import * as fs from 'fs-extra'
import * as path from 'path'
import {createFileNode} from 'gatsby-source-filesystem/create-file-node'

import download from './download'

export async function sourceNodes(
  { boundActionCreators, store },
  { username, password, dataDir }
) {
  const { createNode, setPluginStatus } = boundActionCreators
  dataDir = dataDir || 'data/'

  let cookies
  if (
    store.getState().status.plugins &&
    store.getState().status.plugins[`gatsby-source-smapp`]
  ) {
    cookies = store.getState().status.plugins[`gatsby-source-smapp`]
  }

  function saveCookies(cookies: any) {
    setPluginStatus(cookies)
  }

  let downloaded = await download({
      dataDir,
      username,
      password
    },
    cookies,
    saveCookies
  )

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