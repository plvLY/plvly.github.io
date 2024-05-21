export default defineEventHandler(async (event) => {
  const db = useDatabase()
  let body = await readBody(event)
  console.log(body)
  const id = String(Math.round(Math.random() * 10_000));
  await db.sql`INSERT INTO plv_pv VALUES (${id}, ${body.msg}, ${body.ip}, ${body.date},${body.addr})`;

  const { rows } = await db.sql`SELECT * FROM plv_pv order by date desc `;

  return {rows};
})