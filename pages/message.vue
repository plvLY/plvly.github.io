<script setup lang="ts">
import type { Message } from '~/types'
import { formatDate } from '~/composables/utils'
import PIcon from '~/components/PIcon.vue'

useHead({
  title: '留言',
})

const msg = ref('')
const msgList = ref<Message[]>([])
const loading = ref(false)
const cooldown = ref(false)
const errorMsg = ref('')

let errorTimer: ReturnType<typeof setTimeout> | null = null
function showError(text: string) {
  errorMsg.value = text
  if (errorTimer) clearTimeout(errorTimer)
  errorTimer = setTimeout(() => { errorMsg.value = '' }, 4000)
}

onMounted(async () => {
  try {
    const { rows, error: queryErr } = await $fetch<{ rows: Message[]; error?: string }>('/api/db/query')
    msgList.value = rows
    if (queryErr) showError(queryErr)
  } catch {
    showError('留言加载失败')
  }
})

async function saveMd() {
  if (!msg.value || loading.value || cooldown.value) return
  loading.value = true
  try {
    const { rows } = await $fetch<{ rows: Message[] }>('/api/db/insert', {
      method: 'POST',
      body: { msg: msg.value.trim() },
    })
    msgList.value = rows
    msg.value = ''
    errorMsg.value = ''
    cooldown.value = true
    setTimeout(() => { cooldown.value = false }, 30_000)
  } catch {
    showError('留言保存失败，请稍后再试')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container-main slide-enter-content">
    <div class="max-w-180 mx-auto">
      <div class="flex gap-2 items-center justify-center mb-6">
        <div class="flex-1 flex items-center rounded-lg border border-[var(--c-border)] overflow-hidden focus-within:border-[hsl(217,65%,55%)] transition-colors">
          <input
            v-model.trim="msg"
            placeholder="说句话吧……"
            type="text"
            autocomplete="off"
            class="flex-1 h-10 px-3 text-sm bg-transparent border-none outline-none text-inherit"
            @keyup.enter="saveMd"
          >
          <!-- Honeypot: invisible to humans, bots fill it -->
          <input
            name="website"
            type="text"
            tabindex="-1"
            autocomplete="off"
            class="h-0 w-0 p-0 m-0 border-none outline-none absolute opacity-0 pointer-events-none"
          >
          <button
            class="h-10 px-4 flex items-center gap-1.5 text-sm transition-all duration-200 disabled:opacity-40"
            :disabled="loading || cooldown || !msg"
            @click="saveMd"
          >
            <PIcon name="SendAltFilled" class-name="w-4 h-4 align-middle" :class="msg ? 'text-[hsl(217,65%,55%)]' : ''" />
            <span class="hidden sm:inline">{{ cooldown ? '冷却中' : '发送' }}</span>
          </button>
        </div>
      </div>

      <p v-if="errorMsg" class="text-center text-red op80 pt-2 text-sm">
        {{ errorMsg }}
      </p>

      <div class="space-y-2">
        <div
          v-for="item in msgList"
          :key="item.id"
          class="rounded-lg px-4 py-3 border border-[var(--c-border)] transition-all duration-200"
        >
          <div class="text-sm leading-relaxed">{{ item.msg }}</div>
          <div class="flex items-center gap-3 mt-1.5 text-xs text-[var(--c-text-tertiary)]">
            <span>{{ formatDate(item.date) }}</span>
            <span
              v-if="item.addr"
              class="flex items-center gap-1 flex-none rounded px-1.5 py-0.5 bg-[var(--c-border)]"
            >
              <PIcon name="LocationFilled" class-name="w-3 h-3 align-middle" />
              {{ item.addr }}
            </span>
          </div>
        </div>

        <p v-if="!msgList.length" class="text-center text-[var(--c-text-tertiary)] py-16">
          还没有留言，来说第一句话吧！
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder {
  opacity: 0.35;
  font-style: italic;
}
</style>
