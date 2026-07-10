import { getStore } from '@netlify/blobs'

export interface StoredMessage {
  id: string
  msg: string
  ip: string
  date: string
  addr: string
}

export interface SafeMessage {
  id: string
  msg: string
  date: string
  addr: string
}

export async function getAllMessages(): Promise<StoredMessage[]> {
  const store = getStore('plv-blog')
  const all: StoredMessage[] = []

  try {
    const result = await store.list({ prefix: 'messages:' })
    for (const blob of result.blobs) {
      const msgs: StoredMessage[] = (await store.get(blob.key as string, { type: 'json' })) || []
      all.push(...msgs)
    }
  } catch {}

  try {
    const legacy = await store.get('messages', { type: 'json' })
    if (Array.isArray(legacy)) {
      all.push(...legacy)
    }
  } catch {}

  all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return all
}

export function stripIps(msgs: StoredMessage[]): SafeMessage[] {
  return msgs.map(({ ip: _ip, ...rest }) => rest)
}
