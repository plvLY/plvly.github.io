export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = query.token as string
  const secret = process.env.ANALYTICS_SECRET

  if (!secret || token !== secret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const stats = await getDetailedStats()
  return stats
})
