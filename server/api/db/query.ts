import { getStore } from '@netlify/blobs'

export default defineEventHandler(async () => {
  try {
    const store = getStore('plv-blog')
    const raw = await store.get('messages', { type: 'json' })
    return { rows: raw ?? [] }
  } catch (error) {
    return { rows: [], error: '留言加载失败' }
  }
})
