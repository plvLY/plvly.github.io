import dayjs from 'dayjs'
import {$fetch} from "ofetch";

/**
* 时间格式化
* */
export function formatDate(d: string | Date, onlyDate = true) {
  const date = dayjs(d)
  if (onlyDate || date.year() === dayjs().year())
    return date.format('MM-DD')
  return date.format('YYYY-MM-DD')
}

/**
 * 获取当前时间
 * format： YYYY-MM-DD HH:mm:ss
 */
export function getCurrentDate() {
  const currentDate = dayjs(new Date())
  return currentDate.format('YYYY-MM-DD HH:mm:ss')
}

/*
* 防抖
* */
export function debounce(fn: Function, interval: number) {
  let timeout: any = null
  return function () {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => {
      fn.apply(window, arguments)
    }, interval ? interval : 300)
  }
}

/**
 * 获取IP相关信息
 */
type Location = {
  nation: string,
  province: string,
  city: string,
}
export async function getIpInfo() {
  const {data,error} = useAsyncData('ipInfo',
    () => $fetch(`https://webapi-pc.meitu.com/common/ip_location`, {
      method: 'GET',
      mode: 'no-cors',
    }))
  const ipInfo = data.value?.data
  let ip: string = '',address: string = "";
  if(ipInfo){
    ip = Object.keys(ipInfo)[0]
    let location: Location = Object.values(ipInfo)[0] as Location
    address = location.nation.concat('·').concat(location.province).concat('·').concat(location.city)
  }
  return {ip, address}
}