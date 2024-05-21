export default defineEventHandler(async () => {
  const db = useDatabase()
  // 查询数据
  const { rows } = await db.sql`SELECT * FROM plv_pv order by date desc`;

  return {rows};
})