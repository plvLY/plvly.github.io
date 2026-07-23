export default defineEventHandler(async () => {
  const pageCounts = await getPageCounts()
  return { pageCounts }
})
