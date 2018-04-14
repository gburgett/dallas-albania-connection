import * as requestLib from 'request'
import { RequestCallback, Request, Response, RequestAPI } from 'request';

/** 
 * Wraps the "write" method of a writable stream in an async promise
 * that automatically handles the drain event
 */
export function asyncWriter(stream: NodeJS.WritableStream): (chunk: any) => Promise<void> {
  let draining = true
  function doWrite(chunk: any) {
    return new Promise<void>((resolve, reject) => {
      if (draining) {
        draining = stream.write(chunk, (err: any) => {
          if(err) {
            reject(err)
          } else {
            resolve()
          }
        })
      } else {
        stream.once('drain', () => {
          // await recursive
          doWrite(chunk)
            .then(resolve)
            .catch(reject)
        })
      }
    })
  }

  return doWrite
}

/** Makes the request API use promises. */
export function promisify<TReq extends Request, TOptions, TRequiredUriUrl>(
    request: RequestAPI<TReq, TOptions, TRequiredUriUrl>
  ) {

  const extendedLib = function(uri: string, options?: TOptions) {
    return request(uri);
  }
  return Object.assign(extendedLib, {
    get: (url: string) => p(c => request.get(url, c)),
    post: (url: string, options: TOptions) => p(c => request.post(url, options, c))
  });

  function p(req: (cb: RequestCallback) => Request): Promise<Response> {
    return new Promise((resolve, reject) => {
      req((err, resp, body) => {
        if (err) {
          reject(err)
          return
        }

        if(resp.statusCode == 302) {
          request.get(resp.headers['location'], (err, resp, body) => {
            if (err) {
              reject(err)
              return
            }

            resolve(resp)
          })
        } else {
          resolve(resp)
        }
      })
    })
  }
}