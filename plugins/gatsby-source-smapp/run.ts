


import download from './download'

download({
  dataDir: 'data/donations',
  username: process.env['SMAPP_USERNAME'],
  password: process.env['SMAPP_PASSWORD']
}).then((files) => {
  console.log('downloaded', files)
}).catch((err) => {
  console.error('error!', err)
})