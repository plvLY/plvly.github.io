export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = query.token as string
  const secret = process.env.ANALYTICS_SECRET

  if (!secret || token !== secret) {
    throw createApiError('Unauthorized access to analytics stats', 'AUTH_FAILED', 401)
  }

  const stats = await getDetailedStats()
  return stats
})
