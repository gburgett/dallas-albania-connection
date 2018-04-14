import * as fs from 'fs-extra'

import download from './download'

let cookies = undefined
if (fs.existsSync('cookies.bak')) {
  cookies = JSON.parse(fs.readFileSync('cookies.bak').toString())
}

function saveCookies(cookies: any) {
  fs.writeFileSync('cookies.bak', JSON.stringify(cookies))
}

download({
    dataDir: 'data/donations',
    username: process.env['SMAPP_USERNAME'],
    password: process.env['SMAPP_PASSWORD']
  },
  cookies,
  saveCookies
).then((files) => {
  console.log('downloaded', files)
}).catch((err) => {
  console.error('error!', err)
})