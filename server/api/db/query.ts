export default defineEventHandler(async () => {
  try {
    const all = stripIps(await getAllMessages())
    return { rows: all }
  } catch {
    return { rows: [], error: '留言加载失败' }
  }
})
