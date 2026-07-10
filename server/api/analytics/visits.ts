import { getStore } from '@netlify/blobs'
import type { VisitRecord } from '~/types'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const token = query.token as string
  const secret = process.env.ANALYTICS_SECRET

  if (!secret || token !== secret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const page = Math.max(1, parseInt(query.page as string) || 1)
  const pageSize = Math.min(200, Math.max(1, parseInt(query.pageSize as string) || 50))
  const days = Math.max(1, parseInt(query.days as string) || 7)

  const store = getStore('plv-blog')
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = cutoff.toISOString().slice(0, 10)

  let all: VisitRecord[] = []

  try {
    const result = await store.list({ prefix: 'analytics:visits:' })
    for (const blob of result.blobs) {
      const date = (blob.key as string).replace('analytics:visits:', '')
      if (date < cutoffStr) continue
      const visits: VisitRecord[] = (await store.get(blob.key as string, { type: 'json' })) || []
      all.push(...visits)
    }
  } catch {}

  all.sort((a, b) => b.time.localeCompare(a.time))

  const total = all.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const items = all.slice(start, start + pageSize)

  return { items, total, page, pageSize, totalPages }
})
