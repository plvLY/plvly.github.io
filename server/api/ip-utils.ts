import { $fetch } from "ofetch";

let cached: unknown = null
let cacheTime = 0
const CACHE_TTL = 60_000

export default defineEventHandler(async () => {
  if (cached && Date.now() - cacheTime < CACHE_TTL) {
    return cached
  }

  try {
    const address = await $fetch('https://webapi-pc.meitu.com/common/ip_location', {
      retry: 1,
      retryDelay: 500,
    })
    cached = address
    cacheTime = Date.now()
    return address
  } catch {
    return null
  }
})
