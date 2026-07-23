export function usePageCounts() {
  const pageCounts = ref<Record<string, number>>({})
  const ready = ref(false)

  async function fetchPageCounts() {
    try {
      const res = await $fetch<{ pageCounts: Record<string, number> }>('/api/analytics/page-counts')
      pageCounts.value = res.pageCounts ?? {}
    } catch {
      pageCounts.value = {}
    } finally {
      ready.value = true
    }
  }

  if (import.meta.client) {
    onMounted(fetchPageCounts)
  }

  return { pageCounts, ready, refresh: fetchPageCounts }
}
