export default defineEventHandler(async () => {
  const db = useDatabase()
  await db.sql`DROP TABLE IF EXISTS plv_pv`;
  await db.sql`CREATE TABLE IF NOT EXISTS plv_pv ("id" TEXT PRIMARY KEY, "msg" TEXT, "ip" TEXT, "date" TEXT, "addr" TEXT)`;
})