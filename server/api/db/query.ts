import { getStore } from '@netlify/blobs'

export default defineEventHandler(async () => {
  const store = getStore('plv-blog')
  const raw = await store.get('messages', { type: 'json' })
  return { rows: raw ?? [] }
})
