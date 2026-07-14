import { getGeoFromIp } from '~/server/utils/geo'

export default defineEventHandler(async (event) => {
  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIp = getHeader(event, 'x-real-ip')
  const clientIp = forwarded?.split(',')[0]?.trim() || realIp || ''

  if (!clientIp) return null

  const geo = await getGeoFromIp(clientIp)
  if (!geo) return null

  return { ip: clientIp, ...geo }
})
