import dayjs from 'dayjs'

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