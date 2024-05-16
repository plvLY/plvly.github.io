import {debounce} from "~/composables/utils";

type Msg = {
  num: string,
  ip: string,
  date: string,
  addr: string
}
type DefaultData = {
  count: Msg[]
}

import {JSONFilePreset} from "lowdb/node";

export default defineEventHandler(async (event) => {
  console.log('count---')
  const defaultData: DefaultData = {count: []}
  const db = await JSONFilePreset('public/countDB.json', defaultData);
  let body = await readBody(event)
  if (body != null) {
    // 有值就push,没值就拉倒
    db.data.count.push(body);
    await db.write();
  }
  return db
})
