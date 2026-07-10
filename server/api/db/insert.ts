import { getStore } from '@netlify/blobs'
import { getGeoInfo, isBot } from '../utils/analytics'
import { getAllMessages, stripIps } from '../utils/messages'
import type { StoredMessage } from '../utils/messages'

const RATE_INTERVAL = 30_000
const HOURLY_WINDOW = 3_600_000
const MAX_PER_HOUR = 30

const ipLog = new Map<string, number[]>()

setInterval(() => {
  const now = Date.now()
  for (const [ip, times] of ipLog) {
    const recent = times.filter(t => now - t < HOURLY_WINDOW)
    if (recent.length) ipLog.set(ip, recent)
    else ipLog.delete(ip)
  }
}, 300_000)

function checkRate(ip: string): { ok: boolean; message?: string } {
  const now = Date.now()
  const times = ipLog.get(ip)?.filter(t => now - t < HOURLY_WINDOW) || []

  if (times.length >= MAX_PER_HOUR) {
    return { ok: false, message: '发言过于频繁，请稍后再试' }
  }
  if (times.length > 0 && now - times[0] < RATE_INTERVAL) {
    return { ok: false, message: '请勿频繁发言' }
  }

  times.unshift(now)
  ipLog.set(ip, times)
  return { ok: true }
}

export default defineEventHandler(async (event) => {
  const cl = parseInt(getHeader(event, 'content-length') || '0')
  if (cl > 10_240) {
    throw createError({ statusCode: 413, statusMessage: '请求体过大' })
  }

  const body = await readBody(event)

  if (!body.msg || typeof body.msg !== 'string' || body.msg.length > 500) {
    throw createError({ statusCode: 400, statusMessage: '无效留言' })
  }

  // Honeypot: hidden field filled by bots
  if (body.website) {
    return { rows: stripIps(await getAllMessages()) }
  }

  const ua = getHeader(event, 'user-agent') || ''
  if (isBot(ua)) return { ok: true }

  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIp = getHeader(event, 'x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || ''

  if (!ip) {
    throw createError({ statusCode: 400, statusMessage: '无法识别请求来源' })
  }

  const rate = checkRate(ip)
  if (!rate.ok) {
    throw createError({ statusCode: 429, statusMessage: rate.message })
  }

  const geo = ip ? await getGeoInfo(ip) : null
  const addr = geo ? [geo.nation, geo.province, geo.city].filter(Boolean).join('·') : ''

  const now = new Date()
  const msg: StoredMessage = {
    id: crypto.randomUUID(),
    msg: body.msg.trim(),
    ip,
    date: now.toISOString(),
    addr,
  }

  try {
    const store = getStore('plv-blog')
    const key = `messages:${now.toISOString().slice(0, 10)}`
    const messages: StoredMessage[] = (await store.get(key, { type: 'json' })) || []
    messages.unshift(msg)
    await store.setJSON(key, messages)

    return { rows: stripIps(await getAllMessages()) }
  } catch {
    throw createError({ statusCode: 500, statusMessage: '留言保存失败，请稍后再试' })
  }
})
