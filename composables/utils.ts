import dayjs from 'dayjs'

export function formatDate(d: string | Date, onlyDate = true) {
  const date = dayjs(d)
  if (onlyDate || date.year() === dayjs().year())
    return date.format('MM-DD')
  return date.format('YYYY-MM-DD')
}

export function getCurrentDate() {
  const currentDate = dayjs(new Date())
  return currentDate.format('YYYY-MM-DD HH:mm:ss')
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, interval = 300): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, args)
    }, interval)
  }
}