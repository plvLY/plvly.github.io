<script setup lang="ts">
import {Starport} from "vue-starport";

const clickTimes: number[] = []
const adminMsg = ref('')

function onTitleClick() {
  const now = Date.now()
  clickTimes.push(now)
  const recent = clickTimes.filter(t => now - t < 3000)
  clickTimes.length = 0
  clickTimes.push(...recent)

  if (recent.length >= 5) {
    const skip = localStorage.getItem('plv_skip_analytics')
    if (skip) {
      localStorage.removeItem('plv_skip_analytics')
      adminMsg.value = '访客统计已开启'
    } else {
      localStorage.setItem('plv_skip_analytics', '1')
      adminMsg.value = '访客统计已关闭（仅供站长）'
    }
    setTimeout(() => { adminMsg.value = '' }, 3000)
  }
}
</script>

<template>
  <div class="container-main slide-enter-content">
    <div class="flex flex-col items-center mb-10">
      <div class="w-20 h-20 mb-4">
        <RouterLink to="/info">
          <client-only>
            <Starport
                port="0"
                class="aspect-1/1 transition-all duration-800 w-20 h-20"
            >
              <Logo
                  class="rounded-2xl shadow-sm"
                  :index="0"
              />
            </Starport>
          </client-only>
        </RouterLink>
      </div>
      <h1 class="text-2xl font-semibold m-0 cursor-pointer select-none" @click="onTitleClick">PLV</h1>
      <p class="text-sm text-[var(--c-text-tertiary)] mt-1.5">个人博客 / 技术笔记</p>
      <client-only>
        <VisitCounter />
      </client-only>
      <p v-if="adminMsg" class="text-xs text-brand-primary mt-2">{{ adminMsg }}</p>
    </div>

    <div class="prose !max-w-none">
      <ContentDoc path="/"/>
    </div>
  </div>
</template>
