export interface Message {
  id: string
  msg: string
  ip: string
  date: string
  addr: string
}

export interface VisitRecord {
  id: string
  ip: string
  addr: string | null
  path: string
  date: string
  time: string
  ua: string
}

export interface DetailedStats {
  total: number
  today: number
  trend: { date: string; count: number }[]
  topPages: { path: string; count: number }[]
  regions: { region: string; count: number }[]
}

export interface Post {
  path: string
  title: string
  place?: string
  date: string
  lang?: string
  desc?: string
  platform?: string
  duration?: string
  recording?: string
  radio?: boolean
  video?: boolean
  inperson?: boolean
  redirect?: string
}