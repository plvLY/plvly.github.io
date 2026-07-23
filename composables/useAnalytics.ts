export function useAnalytics() {
  if (import.meta.server) return
  if (localStorage.getItem('plv_skip_analytics')) return

  const route = useRoute()

  // Session-based: full visit record once per session
  if (!sessionStorage.getItem('plv_session_recorded')) {
    sessionStorage.setItem('plv_session_recorded', '1')
    const payload = new Blob([JSON.stringify({ path: route.path })], { type: 'application/json' })
    navigator.sendBeacon('/api/analytics/record', payload)
  }

  // Page view tracking: every navigation counts as a page view
  $fetch('/api/analytics/page-view', {
    method: 'POST',
    body: { path: route.path },
  }).catch(() => {})

  // Watch for route changes to track subsequent navigations
  watch(() => route.path, (path) => {
    $fetch('/api/analytics/page-view', {
      method: 'POST',
      body: { path },
    }).catch(() => {})
  })
}
