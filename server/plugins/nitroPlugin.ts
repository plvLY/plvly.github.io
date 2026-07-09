import { setEnvironmentContext } from '@netlify/blobs'

function getEnv(key: string): string | undefined {
  const { Deno, Netlify, process } = globalThis as any
  return Netlify?.env?.get?.(key) ?? Deno?.env?.get?.(key) ?? process?.env?.[key]
}

function tryInitBlobsContext() {
  const raw = getEnv('NETLIFY_BLOBS_CONTEXT')
  if (!raw) return false

  const data = JSON.parse(Buffer.from(raw, 'base64').toString())
  setEnvironmentContext({
    deployID: data.deploy_id ?? '',
    siteID: data.site_id ?? '',
    token: data.token ?? '',
    primaryRegion: data.primary_region ?? '',
    apiURL: data.api_url ?? '',
    edgeURL: data.edge_url ?? '',
    uncachedEdgeURL: data.uncached_edge_url ?? '',
  })
  return true
}

export default defineNitroPlugin(() => {
  try {
    tryInitBlobsContext()
  } catch {
    // Netlify Blobs not available in this environment
  }
})