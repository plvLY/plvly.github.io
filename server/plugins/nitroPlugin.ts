import { BlobsServer } from '@netlify/blobs/server'
import type { AddressInfo } from 'node:net'
import { platform } from 'node:process'

let blobServer: BlobsServer | null = null

if (platform === 'win32') {
  const origGetLocalPaths = BlobsServer.prototype.getLocalPaths
  BlobsServer.prototype.getLocalPaths = function (url: URL) {
    const result = (origGetLocalPaths as any).call(this, url)
    if (!result) return result

    const enc = (p: string) => /^[a-zA-Z]:$/.test(p) || !p.includes(':') ? p : encodeURIComponent(p)
    const sep = platform === 'win32' ? '\\' : '/'

    if (result.dataPath) {
      result.dataPath = result.dataPath.split(/[\\/]/).map(enc).join(sep)
    }
    if (result.metadataPath) {
      result.metadataPath = result.metadataPath.split(/[\\/]/).map(enc).join(sep)
    }
    return result
  }

  const origWalk = (BlobsServer as any).walk
  ;(BlobsServer as any).walk = async function (options: any) {
    const { path, prefix, rootPath, result, directories } = options
    const { readdir } = await import('node:fs/promises')
    const { join, relative, isAbsolute } = await import('node:path')
    const entries = await readdir(path, { withFileTypes: true })
    for (const entry of entries) {
      const entryPath = join(path, entry.name)
      const rawRelative = relative(rootPath, entryPath)
      const decodedKey = decodeURIComponent(rawRelative)
      if (entry.isDirectory()) {
        if (directories) {
          result.directories.push(decodedKey)
        }
        await (BlobsServer as any).walk({
          directories,
          path: entryPath,
          prefix,
          rootPath,
          result,
        })
      } else if (decodedKey.startsWith(prefix)) {
        result.blobs.push({ key: decodedKey, etag: '' })
      }
    }
  }
}

export default defineNitroPlugin(async () => {
  const { Deno, Netlify, process: proc } = globalThis as any
  const getEnv = (key: string) =>
    Netlify?.env?.get?.(key) ?? Deno?.env?.get?.(key) ?? proc?.env?.[key]
  if (getEnv('NETLIFY_BLOBS_CONTEXT')) return

  const token = 'local-dev-token'
  const directory = '.netlify/blobs-serve'

  blobServer = new BlobsServer({ directory, port: 0, token })
  const addr: AddressInfo = await blobServer.start() as AddressInfo

  const context = {
    deployID: 'local',
    siteID: 'local',
    token,
    primaryRegion: '',
    edgeURL: `http://localhost:${addr.port}`,
    uncachedEdgeURL: `http://localhost:${addr.port}`,
  }
  const encoded = Buffer.from(JSON.stringify(context)).toString('base64')

  if (Netlify?.env?.set) Netlify.env.set('NETLIFY_BLOBS_CONTEXT', encoded)
  else if (Deno?.env?.set) Deno.env.set('NETLIFY_BLOBS_CONTEXT', encoded)
  else if (proc?.env) proc.env['NETLIFY_BLOBS_CONTEXT'] = encoded

  console.log(`[blobs] Local BlobsServer started on port ${addr.port}`)
})

process.on('SIGINT', async () => {
  if (blobServer) await blobServer.stop()
})
