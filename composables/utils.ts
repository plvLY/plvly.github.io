import dayjs from 'dayjs'

export function formatDate(d: string | Date, onlyDate = true) {
  const date = dayjs(d)
  if (onlyDate || date.year() === dayjs().year())
    return date.format('MM-DD')
  return date.format('YYYY-MM-DD')
}

export async function getCount() {
  const ips = useState('ips', () => [])
  const counter = useCookie('counter')
  const ipFetch = await fetch('https://api.ipify.org?format=json');
  const {ip} = await ipFetch.json();
  ips.value.push(ip)
  counter.value = ips.value.length + ''
  return ips
}