/*
* @Deprecated
* Description：使用lowDB,把相应的数据记录到json文件
* 对于有文件权限问题的环境不太友好
* modify: 2024年5月21日 15点28分
* */
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
  const db = await JSONFilePreset('webMsgDB.json', defaultData);
  let body = await readBody(event)
  if (body != null) {
    // 有值就push,没值就拉倒
    db.data.web.push(body);
    await db.write();
  }
  return db
})
