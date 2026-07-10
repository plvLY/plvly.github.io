export default defineEventHandler(async () => {
  const total = await getPublicTotal()
  return { totalVisits: total }
})
