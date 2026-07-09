<script setup lang="ts">
import type { Message } from '~/types'
import { formatDate, getCurrentDate } from '~/composables/utils'
import PIcon from '~/components/PIcon.vue'

useHead({
  title: '留言',
})

const msg = ref('')
const msgList = ref<Message[]>([])
const location = ref('')
const ip = ref('')
const loading = ref(false)

onMounted(async () => {
  try {
    const [{ rows }, addrRes] = await Promise.all([
      $fetch<{ rows: Message[] }>('/api/db/query'),
      $fetch('/api/ip-utils').catch(() => null),
    ])
    msgList.value = rows

    if (addrRes?.data) {
      const key = Object.keys(addrRes.data)[0]
      ip.value = key
      const loc = Object.values(addrRes.data)[0] as Record<string, string>
      location.value = [loc.nation, loc.province, loc.city].filter(Boolean).join('·')
    }
  } catch {
    // 离线或首次部署时静默失败
  }
})

async function saveMd() {
  if (!msg.value || loading.value) return
  loading.value = true
  try {
    const { rows } = await $fetch<{ rows: Message[] }>('/api/db/insert', {
      method: 'POST',
      body: { msg: msg.value.trim(), date: getCurrentDate(), addr: location.value, ip: ip.value },
    })
    msgList.value = rows
    msg.value = ''
  } catch (e) {
    console.error('Failed to save message', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="prose m-auto slide-enter-content">
    <div class="flex gap-2 items-center justify-center pt-4">
      <input
        v-model.trim="msg"
        placeholder="说句话吧……"
        type="text"
        class="border mr h10 w-100 border-rounded-3 text-center text-zinc5 text-1.1em hover:border-amber focus:outline-none"
        @keyup.enter="saveMd"
      >
      <button
        class="w-25 h-10 border-rounded-3 dark:op90 op50 hover:op100"
        :disabled="loading || !msg"
        @click="saveMd"
      >
        <PIcon name="SendAltFilled" class-name="w-6 align-middle color-emerald" />
        说两句
      </button>
    </div>

    <div class="pt-10 space-y-4">
      <div v-for="item in msgList" :key="item.id" class="flex gap-2 items-center justify-center flex-wrap">
        <span class="op70">{{ item.msg }}</span>
        <span class="text-xs op50 ws-nowrap">{{ formatDate(item.date) }}</span>
        <span
          v-if="item.addr"
          class="flex-none text-xs rounded px-1 py-0.5 hidden md:block"
        >
          <PIcon name="LocationFilled" class-name="w-4 align-middle color-green" />
          {{ item.addr }}
        </span>
      </div>
      <p v-if="!msgList.length" class="text-center op40 pt-10">
        还没有留言，来说第一句话吧！
      </p>
    </div>
  </div>
</template>

<style scoped>
input::placeholder { opacity: 0.4; font-style: italic; }
</style>
