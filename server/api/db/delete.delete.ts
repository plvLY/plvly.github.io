import { getStore } from '@netlify/blobs'
import { getAllMessages, stripIps } from '../utils/messages'
import type { StoredMessage } from '../utils/messages'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = query.token as string
  const secret = process.env.ANALYTICS_SECRET

  if (!secret || token !== secret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const id = query.id as string
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少留言 ID' })
  }

  const store = getStore('plv-blog')
  let deleted = false

  try {
    const result = await store.list({ prefix: 'messages:' })
    for (const blob of result.blobs) {
      const key = blob.key as string
      const messages: StoredMessage[] = (await store.get(key, { type: 'json' })) || []
      const idx = messages.findIndex(m => m.id === id)
      if (idx !== -1) {
        messages.splice(idx, 1)
        if (messages.length > 0) {
          await store.setJSON(key, messages)
        } else {
          await store.delete(key)
        }
        deleted = true
        break
      }
    }
  } catch {
    throw createError({ statusCode: 500, statusMessage: '删除失败' })
  }

  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: '留言未找到' })
  }

  return { rows: stripIps(await getAllMessages()) }
})
