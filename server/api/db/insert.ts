import { getStore } from '@netlify/blobs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.msg || typeof body.msg !== 'string' || body.msg.length > 500) {
    throw createError({ statusCode: 400, statusMessage: '无效留言' })
  }

  try {
    const store = getStore('plv-blog')
    const messages = (await store.get('messages', { type: 'json' })) || []
    messages.unshift({
      id: crypto.randomUUID(),
      msg: body.msg.trim(),
      ip: body.ip ?? '',
      date: body.date ?? '',
      addr: body.city ?? '',
    })
    await store.setJSON('messages', messages)
    return { rows: messages }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: '留言保存失败，请稍后再试',
    })
  }
})
