export function useAnalytics() {
  if (import.meta.server) return

  if (localStorage.getItem('plv_skip_analytics')) return

  if (sessionStorage.getItem('plv_session_recorded')) return
  sessionStorage.setItem('plv_session_recorded', '1')

  const route = useRoute()
  const payload = new Blob([JSON.stringify({ path: route.path })], { type: 'application/json' })
  navigator.sendBeacon('/api/analytics/record', payload)
}
