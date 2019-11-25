import * as fs from 'fs-extra'
import * as path from 'path'
import globby from 'globby'
import chalk from 'chalk'
import {createFileNode} from 'gatsby-source-filesystem/create-file-node'

import download from './download'

async function sourceNodes(
  { actions, store, createNodeId },
  { username, password, dataDir, sessionId }
) {
  const { createNode, setPluginStatus } = actions
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


  let downloaded = []
  if (process.env.NODE_ENV === `production`) {
    try {
      downloaded = await download({
          dataDir,
          username,
          password,
          sessionId: sessionId || process.env.SMAPP_SESSION_ID
        },
        cookies,
        saveCookies
      )
      // remove "undefined"
      downloaded = downloaded.filter((elem) => elem)
    }catch(e) {
      console.error(chalk.red(`Downloading new CSV files failed!`), e)
    }
  }

  // Add existing csv files in directory
  const globs = await globby(path.join(dataDir, '**/*.csv'))
  downloaded.push(...globs)
  downloaded = downloaded.filter((elem, pos) =>
    downloaded.indexOf(elem) == pos
  )

  // create nodes from csv files
  const promises = downloaded.map(async (csvFile) => {
    const node = await createFileNode(csvFile, createNodeId)
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

exports.sourceNodes = sourceNodes