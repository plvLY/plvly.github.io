export function useAdminTrigger() {
  const adminMsg = ref('')
  const clickTimes = ref<number[]>([])

  function trigger() {
    const now = Date.now()
    clickTimes.value.push(now)
    
    // Keep only clicks within the last 3 seconds
    const recent = clickTimes.value.filter(t => now - t < 3000)
    clickTimes.value = recent

    if (recent.length >= 5) {
      const skip = localStorage.getItem('plv_skip_analytics')
      if (skip) {
        localStorage.removeItem('plv_skip_analytics')
        adminMsg.value = '访客统计已开启'
      } else {
        localStorage.setItem('plv_skip_analytics', '1')
        adminMsg.value = '访客统计已关闭（仅供站长）'
      }
      setTimeout(() => { adminMsg.value = '' }, 3000)
    }
  }

  return {
    adminMsg,
    trigger
  }
}
