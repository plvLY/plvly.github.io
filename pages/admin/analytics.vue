<script setup lang="ts">
import type { DetailedStats, VisitRecord, Message } from '~/types'

definePageMeta({
  alias: ['/admin'],
})

const TOKEN_KEY = 'plv_admin_token'
const token = ref(useRoute().query.token as string || '')
const stats = ref<DetailedStats | null>(null)
const error = ref('')
const loading = ref(true)

const visits = ref<VisitRecord[]>([])
const visitsTotal = ref(0)
const visitsPage = ref(1)
const visitsTotalPages = ref(0)
const visitsLoading = ref(false)
const pageSize = 5

async function fetchStats() {
  loading.value = true
  error.value = ''
  try {
    const [res, visitRes] = await Promise.all([
      $fetch<DetailedStats>(`/api/analytics/stats?token=${token.value}`),
      fetchVisits(1, false),
    ])
    stats.value = res
    localStorage.setItem(TOKEN_KEY, token.value)
  } catch (e: any) {
    if (e?.statusCode === 401) {
      error.value = 'Token 无效'
    } else {
      error.value = '加载失败'
    }
    stats.value = null
  } finally {
    loading.value = false
  }
}

async function fetchVisits(page: number, toggleLoading = true) {
  if (toggleLoading) visitsLoading.value = true
  try {
    const res = await $fetch<{
      items: VisitRecord[]
      total: number
      page: number
      pageSize: number
      totalPages: number
    }>(`/api/analytics/visits?token=${token.value}&page=${page}&pageSize=${pageSize}&days=7`)
    visits.value = res.items
    visitsTotal.value = res.total
    visitsPage.value = res.page
    visitsTotalPages.value = Math.max(1, res.totalPages)
  } catch {
    visits.value = []
  } finally {
    if (toggleLoading) visitsLoading.value = false
  }
}

function goPage(p: number) {
  if (p < 1 || p > visitsTotalPages.value || p === visitsPage.value) return
  fetchVisits(p)
}

function fmtTime(iso: string) {
  const d = new Date(iso)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${mm}-${dd} ${hh}:${mi}`
}

function shortPath(p: string) {
  return p || '/'
}

function city(addr: string | null) {
  if (!addr) return '-'
  const parts = addr.split('·')
  if (parts[0] === '中国') return parts.slice(1).filter(Boolean).join('·') || '中国'
  return parts[0]
}

onMounted(() => {
  const t = token.value || localStorage.getItem(TOKEN_KEY) || ''
  if (t) {
    token.value = t
    fetchStats()
    fetchMessages()
  }
})

function pagesToShow(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  if (total > 1) pages.push(total)
  return pages
}

function maxCount(items: { count: number }[]) {
  return items.length ? Math.max(...items.map(i => i.count)) : 1
}

function pct(count: number, items: { count: number }[]) {
  return (count / maxCount(items)) * 100
}

const messages = ref<Message[]>([])
const messagesLoading = ref(false)
const deletingId = ref<string | null>(null)

async function fetchMessages() {
  messagesLoading.value = true
  try {
    const { rows } = await $fetch<{ rows: Message[] }>('/api/db/query')
    messages.value = rows
  } catch {
    messages.value = []
  } finally {
    messagesLoading.value = false
  }
}

async function deleteMessage(id: string) {
  if (!confirm('确定要删除这条留言吗？')) return
  deletingId.value = id
  try {
    await $fetch(`/api/db/delete?id=${id}&token=${token.value}`, { method: 'DELETE' })
    await fetchMessages()
  } catch {
    // silent
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="container-main slide-enter-content">
    <div class="max-w-200 mx-auto">
      <h1 class="text-xl font-semibold m-0 mb-6">统计面板</h1>

      <template v-if="!token || error">
        <div class="flex gap-2 items-center mb-4">
          <input
            v-model="token"
            placeholder="输入 Token"
            type="text"
            class="flex-1 h-10 px-3 text-sm rounded-lg border border-[var(--c-border)] bg-transparent outline-none focus:border-[hsl(217,65%,55%)] transition-colors"
            @keyup.enter="fetchStats"
          >
          <button
            class="h-10 px-4 text-sm rounded-lg border border-[var(--c-border)] bg-surface transition-all duration-200 hover:bg-surface-hover"
            @click="fetchStats"
          >
            验证
          </button>
        </div>
        <p v-if="error" class="text-sm text-red op80">{{ error }}</p>
      </template>

      <div v-else-if="loading" class="text-sm text-[var(--c-text-tertiary)]">加载中...</div>

      <template v-else-if="stats">
        <!-- stat cards -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div class="rounded-xl border border-[var(--c-border)] p-4">
            <div class="text-xs text-[var(--c-text-tertiary)] mb-1">总访客</div>
            <div class="text-2xl font-semibold">{{ stats.total.toLocaleString() }}</div>
          </div>
          <div class="rounded-xl border border-[var(--c-border)] p-4">
            <div class="text-xs text-[var(--c-text-tertiary)] mb-1">今日</div>
            <div class="text-2xl font-semibold">{{ stats.today.toLocaleString() }}</div>
          </div>
          <div class="rounded-xl border border-[var(--c-border)] p-4">
            <div class="text-xs text-[var(--c-text-tertiary)] mb-1">日均</div>
            <div class="text-2xl font-semibold">{{ stats.trend.length ? Math.round(stats.total / stats.trend.length).toLocaleString() : 0 }}</div>
          </div>
        </div>

        <!-- daily trend -->
        <div class="rounded-xl border border-[var(--c-border)] p-4 mb-4">
          <h2 class="text-sm font-medium m-0 mb-3">近 30 日趋势</h2>
          <div class="flex items-end gap-0.5 h-24">
            <div
              v-for="d in stats.trend"
              :key="d.date"
              class="flex-1 rounded-t-sm transition-all duration-300"
              :style="{
                height: (d.count / maxCount(stats.trend)) * 100 + '%',
                background: 'var(--c-brand, hsl(217, 65%, 55%))',
                opacity: d.count / maxCount(stats.trend) * 0.6 + 0.2,
              }"
              :title="d.date + ' - ' + d.count"
            />
          </div>
        </div>

        <!-- two columns -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- pages -->
          <div class="rounded-xl border border-[var(--c-border)] p-4">
            <h2 class="text-sm font-medium m-0 mb-3">页面排行</h2>
            <div class="space-y-2">
              <div v-for="p in stats.topPages" :key="p.path" class="text-sm">
                <div class="flex justify-between mb-0.5">
                  <span class="truncate">{{ p.path || '/' }}</span>
                  <span class="text-[var(--c-text-tertiary)] shrink-0 ml-2">{{ p.count }}</span>
                </div>
                <div class="h-1.5 rounded-full bg-[var(--c-border)] overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: pct(p.count, stats.topPages) + '%', background: 'hsl(217, 65%, 55%)' }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- regions -->
          <div class="rounded-xl border border-[var(--c-border)] p-4">
            <h2 class="text-sm font-medium m-0 mb-3">地域分布</h2>
            <div class="space-y-2">
              <div v-for="r in stats.regions" :key="r.region" class="text-sm">
                <div class="flex justify-between mb-0.5">
                  <span>{{ r.region || '未知' }}</span>
                  <span class="text-[var(--c-text-tertiary)]">{{ r.count }}</span>
                </div>
                <div class="h-1.5 rounded-full bg-[var(--c-border)] overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: pct(r.count, stats.regions) + '%', background: 'hsl(160, 60%, 50%)' }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- visitor list -->
        <div class="rounded-xl border border-[var(--c-border)] p-4 mt-4">
          <h2 class="text-sm font-medium m-0 mb-3">
            访客列表
            <span class="text-[var(--c-text-tertiary)] font-normal">（最近 7 天，共 {{ visitsTotal }} 条）</span>
          </h2>

          <div v-if="visitsLoading" class="text-sm text-[var(--c-text-tertiary)] py-4">加载中...</div>

          <div v-else-if="!visits.length" class="text-sm text-[var(--c-text-tertiary)] py-4">暂无数据</div>

          <template v-else>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-[var(--c-text-tertiary)] border-b border-[var(--c-border)]">
                    <th class="text-left font-normal py-2 pr-3 w-34">IP</th>
                    <th class="text-left font-normal py-2 pr-3 w-26">城市</th>
                    <th class="text-left font-normal py-2 pr-3">页面</th>
                    <th class="text-left font-normal py-2 w-22">时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="v in visits"
                    :key="v.id"
                    class="border-b border-[var(--c-border)] last:border-none"
                    :title="v.ua || undefined"
                  >
                    <td class="py-2 pr-3 font-mono text-xs align-top whitespace-nowrap">{{ v.ip }}</td>
                    <td class="py-2 pr-3 align-top whitespace-nowrap">{{ city(v.addr) }}</td>
                    <td class="py-2 pr-3 align-top truncate max-w-40">{{ shortPath(v.path) }}</td>
                    <td class="py-2 align-top whitespace-nowrap text-[var(--c-text-tertiary)]">{{ fmtTime(v.time) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-center justify-center gap-1.5 mt-4">
              <button
                class="px-2.5 py-1 rounded text-sm border border-[var(--c-border)] disabled:opacity-30 transition-all duration-200 hover:bg-surface-hover"
                :disabled="visitsPage <= 1"
                @click="goPage(visitsPage - 1)"
              >
                &lt;
              </button>
              <template v-for="p in pagesToShow(visitsPage, visitsTotalPages)" :key="p">
                <span v-if="p === '...'" class="px-1 text-[var(--c-text-tertiary)] select-none">···</span>
                <span
                  v-else
                  class="px-2.5 py-1 rounded text-sm cursor-pointer transition-all duration-200"
                  :class="p === visitsPage ? 'bg-brand-primary/10 text-brand-primary' : 'hover:bg-surface-hover'"
                  @click="goPage(p)"
                >
                  {{ p }}
                </span>
              </template>
              <button
                class="px-2.5 py-1 rounded text-sm border border-[var(--c-border)] disabled:opacity-30 transition-all duration-200 hover:bg-surface-hover"
                :disabled="visitsPage >= visitsTotalPages"
                @click="goPage(visitsPage + 1)"
              >
                &gt;
              </button>
            </div>
          </template>
        </div>

        <!-- message management -->
        <div class="rounded-xl border border-[var(--c-border)] p-4 mt-4">
          <h2 class="text-sm font-medium m-0 mb-3">
            留言管理
            <span class="text-[var(--c-text-tertiary)] font-normal">（共 {{ messages.length }} 条）</span>
          </h2>

          <div v-if="messagesLoading" class="text-sm text-[var(--c-text-tertiary)] py-4">加载中...</div>

          <div v-else-if="!messages.length" class="text-sm text-[var(--c-text-tertiary)] py-4">暂无留言</div>

          <template v-else>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-[var(--c-text-tertiary)] border-b border-[var(--c-border)]">
                    <th class="text-left font-normal py-2 pr-3">内容</th>
                    <th class="text-left font-normal py-2 pr-3 w-26">归属地</th>
                    <th class="text-left font-normal py-2 pr-3 w-22">时间</th>
                    <th class="text-left font-normal py-2 w-16">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in messages"
                    :key="item.id"
                    class="border-b border-[var(--c-border)] last:border-none"
                  >
                    <td class="py-2 pr-3 align-top truncate max-w-60">{{ item.msg }}</td>
                    <td class="py-2 pr-3 align-top whitespace-nowrap">{{ item.addr || '-' }}</td>
                    <td class="py-2 pr-3 align-top whitespace-nowrap text-[var(--c-text-tertiary)]">{{ fmtTime(item.date) }}</td>
                    <td class="py-2 align-top">
                      <button
                        class="px-2 py-0.5 rounded text-xs border border-[var(--c-border)] transition-all duration-200 hover:border-red hover:text-red disabled:opacity-30"
                        :disabled="deletingId === item.id"
                        @click="deleteMessage(item.id)"
                      >
                        {{ deletingId === item.id ? '删除中' : '删除' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
