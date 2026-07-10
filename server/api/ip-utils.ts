import { $fetch } from "ofetch"

const cache = new Map<string, { data: ReturnType; time: number }>()
const CACHE_TTL = 60_000

type ReturnType = { ip: string; nation: string; province: string; city: string } | null

export default defineEventHandler(async (event) => {
  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIp = getHeader(event, 'x-real-ip')
  const clientIp = forwarded?.split(',')[0]?.trim() || realIp || ''

  if (!clientIp) return null

  const cached = cache.get(clientIp)
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data
  }

  try {
    const address = await $fetch(`http://ip-api.com/json/${clientIp}?lang=zh-CN&fields=status,country,regionName,city,query`, {
      retry: 1,
      retryDelay: 500,
    })

    if (address?.status === 'success') {
      const result = {
        ip: address.query,
        nation: address.country,
        province: address.regionName,
        city: address.city,
      }
      cache.set(clientIp, { data: result, time: Date.now() })
      return result
    }
    return null
  } catch {
    return null
  }
})
