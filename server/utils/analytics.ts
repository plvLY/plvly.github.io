import { getStore } from '@netlify/blobs'
import type { VisitRecord, DetailedStats } from '~/types'

const STORE_NAME = 'plv-blog'

interface GeoResult {
  nation: string
  province: string
  city: string
}

export function getGeoFromHeaders(event: any): GeoResult | null {
  const nation = getHeader(event, 'x-nf-client-country')
  const province = getHeader(event, 'x-nf-client-region')
  const city = getHeader(event, 'x-nf-client-city')

  if (!nation) return null

  return {
    nation,
    province: province || '',
    city: city || '',
  }
}

const BOT_RE = /bot|crawler|spider|scraper|curl|wget|python|go-http-client|nagios|pingdom|uptimerobot|headless|chrome-lighthouse|whatsapp|facebook|twitter|slack/i

export function isBot(ua: string): boolean {
  return BOT_RE.test(ua)
}

const publicCache: { data: number | null; time: number } = { data: null, time: 0 }

export async function addVisit(record: VisitRecord, event: any) {
  const store = getStore(STORE_NAME)
  const today = new Date().toISOString().slice(0, 10)

  // 1. Flattened storage for detailed records (eliminate race conditions on record list)
  const recordKey = `analytics:visit:${today}:${record.id}`
  await store.setJSON(recordKey, record)

  // 2. Pre-aggregate totals (Accept slight race condition on totals, but O(1) read)
  const totalKey = 'analytics:global_total'
  const total = (await store.get(totalKey, { type: 'json' })) || 0
  await store.setJSON(totalKey, total + 1)

  // 3. Pre-aggregate daily trends
  const summaryKey = 'analytics:daily_summary'
  const summary: Record<string, number> = (await store.get(summaryKey, { type: 'json' })) || {}
  summary[today] = (summary[today] || 0) + 1
  await store.setJSON(summaryKey, summary)

  // 4. Pre-aggregate page counts
  const pageKey = 'analytics:page_counts'
  const pageCounts: Record<string, number> = (await store.get(pageKey, { type: 'json' })) || {}
  pageCounts[record.path] = (pageCounts[record.path] || 0) + 1
  await store.setJSON(pageKey, pageCounts)

  // 5. Pre-aggregate region counts
  if (record.addr) {
    const regionKey = 'analytics:region_counts'
    const regionCounts: Record<string, number> = (await store.get(regionKey, { type: 'json' })) || {}
    const region = record.addr.split('·')[0] === '中国' ? (record.addr.split('·')[1] || '中国') : record.addr.split('·')[0]
    regionCounts[region] = (regionCounts[region] || 0) + 1
    await store.setJSON(regionKey, regionCounts)
  }

  publicCache.data = null
}

const statsCache: { data: DetailedStats | null; time: number } = { data: null, time: 0 }

export async function getDetailedStats(): Promise<DetailedStats> {
  const now = Date.now()
  if (statsCache.data !== null && now - statsCache.time < 30_000) {
    return statsCache.data
  }

  const store = getStore(STORE_NAME)
  
  try {
    const total = (await store.get('analytics:global_total', { type: 'json' })) || 0
    const dailySummary: Record<string, number> = (await store.get('analytics:daily_summary', { type: 'json' })) || {}
    const pageCounts: Record<string, number> = (await store.get('analytics:page_counts', { type: 'json' })) || {}
    const regionCounts: Record<string, number> = (await store.get('analytics:region_counts', { type: 'json' })) || {}
    
    const todayStr = new Date().toISOString().slice(0, 10)
    const todayCount = dailySummary[todayStr] || 0

    const sortedDates = Object.entries(dailySummary)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)

    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
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
  } catch (e) {
    console.error('Failed to fetch detailed stats:', e)
    return { total: 0, today: 0, trend: [], topPages: [], regions: [] }
  }
}

const pageCountsCache: { data: Record<string, number> | null; time: number } = { data: null, time: 0 }

export async function addPageView(path: string) {
  const store = getStore(STORE_NAME)
  const pageKey = 'analytics:page_counts'
  const pageCounts: Record<string, number> = (await store.get(pageKey, { type: 'json' })) || {}
  pageCounts[path] = (pageCounts[path] || 0) + 1
  await store.setJSON(pageKey, pageCounts)
  pageCountsCache.data = null
}

export async function getPageCounts(): Promise<Record<string, number>> {
  const now = Date.now()
  if (pageCountsCache.data !== null && now - pageCountsCache.time < 60_000) {
    return pageCountsCache.data
  }

  const store = getStore(STORE_NAME)
  try {
    const pageCounts: Record<string, number> = (await store.get('analytics:page_counts', { type: 'json' })) || {}
    pageCountsCache.data = pageCounts
    pageCountsCache.time = now
    return pageCounts
  } catch {
    return {}
  }
}

export async function getPublicTotal(): Promise<number> {
  const now = Date.now()
  if (publicCache.data !== null && now - publicCache.time < 60_000) {
    return publicCache.data
  }

  const store = getStore(STORE_NAME)
  try {
    const total = (await store.get('analytics:global_total', { type: 'json' })) || 0
    publicCache.data = total
    publicCache.time = now
    return total
  } catch {
    return 0
  }
}
