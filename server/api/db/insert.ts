import { getStore } from '@netlify/blobs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.msg || typeof body.msg !== 'string' || body.msg.length > 500) {
    throw createError({ statusCode: 400, message: 'Invalid message' })
  }

  const store = getStore('plv-blog')
  const messages = (await store.get('messages', { type: 'json' })) || []
  messages.unshift({
    id: crypto.randomUUID(),
    msg: body.msg.trim(),
    ip: body.ip ?? '',
    date: body.date ?? '',
    addr: body.addr ?? '',
  })
  await store.setJSON('messages', messages)
  return { rows: messages }
})
