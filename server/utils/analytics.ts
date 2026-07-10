import { $fetch } from "ofetch"
import { getStore } from '@netlify/blobs'
import type { VisitRecord, DetailedStats } from '~/types'

const STORE_NAME = 'plv-blog'

const geoCache = new Map<string, { data: GeoResult | null; time: number }>()
const GEO_TTL = 60_000

interface GeoResult {
  ip: string
  nation: string
  province: string
  city: string
}

export async function getGeoInfo(ip: string): Promise<GeoResult | null> {
  if (!ip) return null
  const cached = geoCache.get(ip)
  if (cached && Date.now() - cached.time < GEO_TTL) return cached.data

  try {
    const address = await $fetch(`http://ip-api.com/json/${ip}?lang=zh-CN&fields=status,country,regionName,city,query`, {
      retry: 1,
      retryDelay: 500,
    }) as any

    if (address?.status === 'success') {
      const result = {
        ip: address.query,
        nation: address.country,
        province: address.regionName,
        city: address.city,
      }
      geoCache.set(ip, { data: result, time: Date.now() })
      return result
    }
    return null
  } catch {
    return null
  }
}

const BOT_RE = /bot|crawler|spider|scraper|curl|wget|python|go-http-client|nagios|pingdom|uptimerobot|headless|chrome-lighthouse|whatsapp|facebook|twitter|slack/i

export function isBot(ua: string): boolean {
  return BOT_RE.test(ua)
}

const publicCache: { data: number | null; time: number } = { data: null, time: 0 }

export async function addVisit(record: VisitRecord) {
  const store = getStore(STORE_NAME)
  const today = new Date().toISOString().slice(0, 10)
  const key = `analytics:visits:${today}`
  const visits: VisitRecord[] = (await store.get(key, { type: 'json' })) || []
  visits.unshift(record)
  await store.setJSON(key, visits)
  publicCache.data = null
}

const statsCache: { data: DetailedStats | null; time: number } = { data: null, time: 0 }

export async function getDetailedStats(): Promise<DetailedStats> {
  const now = Date.now()
  if (statsCache.data !== null && now - statsCache.time < 30_000) {
    return statsCache.data
  }

  const store = getStore(STORE_NAME)
  const dailyCounts: Record<string, number> = {}
  const pageCounts: Record<string, number> = {}
  const regionCounts: Record<string, number> = {}
  let total = 0
  const todayStr = new Date().toISOString().slice(0, 10)
  let todayCount = 0

  try {
    const result = await store.list({ prefix: 'analytics:visits:' })
    for (const blob of result.blobs) {
      const date = (blob.key as string).replace('analytics:visits:', '')
      const visits: VisitRecord[] = (await store.get(blob.key as string, { type: 'json' })) || []
      const count = visits.length
      total += count
      dailyCounts[date] = count
      if (date === todayStr) todayCount = count

      for (const v of visits) {
        pageCounts[v.path] = (pageCounts[v.path] || 0) + 1
        if (v.addr) {
          const parts = v.addr.split('·')
          const region = parts[0] === '中国' ? (parts[1] || '中国') : parts[0]
          regionCounts[region] = (regionCounts[region] || 0) + 1
        }
      }
    }
  } catch {}

  const sortedDates = Object.entries(dailyCounts).sort(([a], [b]) => a.localeCompare(b)).slice(-30)
  const topPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a).slice(0, 10)
    .map(([path, count]) => ({ path, count }))

  const regions = Object.entries(regionCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([region, count]) => ({ region, count }))

  const result: DetailedStats = {
    total,
    today: todayCount,
    trend: sortedDates.map(([date, count]) => ({ date, count })),
    topPages,
    regions,
  }

  statsCache.data = result
  statsCache.time = now
  return result
}

export async function getPublicTotal(): Promise<number> {
  const now = Date.now()
  if (publicCache.data !== null && now - publicCache.time < 60_000) {
    return publicCache.data
  }

  const store = getStore(STORE_NAME)
  let total = 0

  try {
    const result = await store.list({ prefix: 'analytics:visits:' })
    for (const blob of result.blobs) {
      const visits: VisitRecord[] = (await store.get(blob.key as string, { type: 'json' })) || []
      total += visits.length
    }
  } catch {}

  publicCache.data = total
  publicCache.time = now
  return total
}
