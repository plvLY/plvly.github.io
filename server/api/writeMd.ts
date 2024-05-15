type Msg = {
  msg: string,
  ip: string,
  date: string,
  addr: string
}
type DefaultData = {
  web: Msg[]
}

import {JSONFilePreset} from "lowdb/node";

export default defineEventHandler(async (event) => {
  const defaultData: DefaultData = {web: []}
  const db = await JSONFilePreset('public/webMsgDB.json', defaultData);
  let body: any = await readBody(event)
  if (body != null) {
    // 有值就push,没值就拉倒
    db.data.web.push(body);
    await db.write();
  }
  return db
})
