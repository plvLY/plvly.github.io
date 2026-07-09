<script setup lang="ts">
import { formatDate } from "~/composables/utils"

useHead({
  title: '文章',
})

const getYear = (a: Date | string | number) => new Date(a).getFullYear()

const { data: list } = await useAsyncData('posts', () =>
  queryContent('/posts').sort({ date: -1 } as const).find()
)

const groupedByYear = computed(() => {
  const groups: Record<number, { path: string; title: string; date: string; lang?: string; duration?: string }[]> = {}
  for (const post of list.value || []) {
    const year = getYear(post.date)
    if (!groups[year]) groups[year] = []
    groups[year].push({
      path: post._path,
      title: post.title,
      date: post.date,
      lang: post.lang,
      duration: post.duration,
    })
  }
  return Object.entries(groups)
    .sort(([a], [b]) => +b - +a)
    .map(([year, posts]) => ({ year: +year, posts }))
})
</script>

<template>
  <div class="max-w-180 mx-auto px-6 md:px-10 py-10 slide-enter-content">
    <div class="max-w-140 mx-auto">
      <div v-for="group in groupedByYear" :key="group.year" class="mb-10">
        <div class="text-xs font-medium tracking-widest text-[var(--c-text-tertiary)] uppercase mb-4 select-none">
          {{ group.year }}
        </div>
        <div class="space-y-0.5">
          <RouterLink
            v-for="post in group.posts"
            :key="post.path"
            :to="post.path"
            class="post-row flex items-baseline gap-3 px-1 py-2 rounded-lg transition-all duration-200 no-underline text-inherit group"
          >
            <span class="text-xs text-[var(--c-text-tertiary)] flex-none w-12 text-right tabular-nums select-none">
              {{ formatDate(post.date, true) }}
            </span>
            <span class="text-sm font-medium truncate flex-1 group-hover:text-[hsl(217,65%,55%)] transition-colors">
              {{ post.title }}
            </span>
            <span v-if="post.duration" class="text-xs text-[var(--c-text-tertiary)] flex-none op50 select-none">
              {{ post.duration }}
            </span>
          </RouterLink>
        </div>
      </div>

      <p v-if="!groupedByYear.length" class="text-center text-[var(--c-text-tertiary)] py-20">
        暂无文章
      </p>
    </div>
  </div>
</template>
