import { getGeoFromHeaders, isBot, addVisit } from '~/server/utils/analytics'
import { getGeoFromIp } from '~/server/utils/geo'
import type { VisitRecord } from '~/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body?.path || typeof body.path !== 'string') return { ok: true }

  const ua = getHeader(event, 'user-agent') || ''
  if (isBot(ua)) return { ok: true }

  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIp = getHeader(event, 'x-real-ip')
  const ip = forwarded?.split(',')[0]?.trim() || realIp || ''

  let geo = getGeoFromHeaders(event)
  if (!geo) {
    geo = await getGeoFromIp(ip)
  }
  const addr = geo ? [geo.nation, geo.province, geo.city].filter(Boolean).join('·') : null

  const now = new Date()
  const record: VisitRecord = {
    id: crypto.randomUUID(),
    ip,
    addr,
    path: body.path,
    date: now.toISOString().slice(0, 10),
    time: now.toISOString(),
    ua: ua.slice(0, 200),
  }

  await addVisit(record, event)

  return { ok: true }
})
