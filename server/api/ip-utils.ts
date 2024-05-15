import {$fetch} from "ofetch";

export default defineEventHandler(async (event) => {

  // const getIp = await $fetch('https://api.ipify.org/?format=json')
  // const address = await $fetch(`http://ip-api.com/json?lang=zh-CN`)
  // const address = await $fetch(`http://pv.sohu.com/`)
  const address = await $fetch(`https://webapi-pc.meitu.com/common/ip_location`)

  return address? address : undefined
})
