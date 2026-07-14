import { $fetch } from 'ofetch'

const cache = new Map<string, { data: { nation: string; province: string; city: string }; time: number }>()
const CACHE_TTL = 60_000

export async function getGeoFromIp(ip: string) {
  if (!ip) return null

  const cached = cache.get(ip)
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data
  }

  try {
    const address = await $fetch(`http://ip-api.com/json/${ip}?lang=zh-CN&fields=status,country,regionName,city,query`, {
      retry: 1,
      retryDelay: 500,
    })
    if (address?.status === 'success') {
      const result = { nation: address.country, province: address.regionName, city: address.city }
      cache.set(ip, { data: result, time: Date.now() })
      return result
    }
  } catch {}
  return null
}
