export interface IEvent {
  path: string,
  httpMethod: 'GET' | 'POST' | 'DELETE',
  queryStringParameters: {
    [key: string]: string
  },
  headers: {
   host: string,
   'user-agent': string,
   accept: string,
   'content-length': string,
   'content-type': string,

   [key: string]: string
  },
  body: string,
  isBase64Encoded: false
}