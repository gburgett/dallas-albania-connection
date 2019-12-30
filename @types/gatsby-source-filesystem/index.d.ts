
declare module 'gatsby-source-filesystem' {
  export interface FileNode { 
    id: string,
    children: string[],
    parent: null,
    internal:
    {
      contentDigest: string,
      type: 'File',
      mediaType: string,
      /** 'File "the/file/relative/path.ext" */
      description: string,
      owner: 'gatsby-source-filesystem'
    },
    sourceInstanceName: string,
    absolutePath: string,
    relativePath: string,
    extension: string,
    size: number,
    prettySize: string,
    modifiedTime: string,
    accessTime: string,
    changeTime: string,
    birthTime: string,
    root: string,
    dir: string,
    base: string,
    ext: string,
    name: string,
    relativeDirectory: string,
    dev: number,
    mode: number,
    nlink: number,
    uid: number,
    gid: number,
    rdev: number,
    blksize: number,
    ino: number,
    blocks: number,
    atimeMs: number,
    mtimeMs: number,
    ctimeMs: number,
    birthtimeMs: number,
    atime: string,
    mtime: string,
    ctime: string,
    birthtime: string
  }
}