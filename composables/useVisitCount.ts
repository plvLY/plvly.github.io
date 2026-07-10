export function useVisitCount() {
  const count = ref(0)
  const ready = ref(false)

  if (import.meta.client) {
    $fetch<{ totalVisits: number }>('/api/analytics/public')
      .then((res) => { count.value = res.totalVisits })
      .catch(() => {})
      .finally(() => { ready.value = true })
  }

  return { count: readonly(count), ready: readonly(ready) }
}
