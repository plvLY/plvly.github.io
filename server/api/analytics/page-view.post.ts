export default defineEventHandler(async (event) => {
  const body = await readBody<{ path: string }>(event)
  if (!body?.path) {
    throw createError({ statusCode: 400, message: 'path is required' })
  }
  await addPageView(body.path)
  return { ok: true }
})
