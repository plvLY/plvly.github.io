<script setup lang="ts">
import type { DetailedStats } from '~/types'

definePageMeta({
  alias: ['/admin'],
})

const TOKEN_KEY = 'plv_admin_token'
const token = ref(useRoute().query.token as string || localStorage.getItem(TOKEN_KEY) || '')
const stats = ref<DetailedStats | null>(null)
const error = ref('')
const loading = ref(true)

async function fetchStats() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<DetailedStats>(`/api/analytics/stats?token=${token.value}`)
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

if (token.value) {
  fetchStats()
}

function maxCount(items: { count: number }[]) {
  return items.length ? Math.max(...items.map(i => i.count)) : 1
}

function pct(count: number, items: { count: number }[]) {
  return (count / maxCount(items)) * 100
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
      </template>
    </div>
  </div>
</template>
