export default defineEventHandler(async () => {
  const db = useDatabase()
  await db.sql`CREATE TABLE IF NOT EXISTS plv_pv ("id" TEXT PRIMARY KEY, "msg" TEXT, "ip" TEXT, "date" TEXT, "addr" TEXT)`;
  // 查询数据
  const { rows } = await db.sql`SELECT * FROM plv_pv order by date desc`;

  return {rows};
})