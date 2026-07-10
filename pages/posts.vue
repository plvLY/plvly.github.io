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
  <div class="container-main slide-enter-content">
    <div
      v-for="group in groupedByYear"
      :key="group.year"
      class="year-group"
    >
      <div class="year-bg">{{ group.year }}</div>

      <div class="posts">
        <RouterLink
          v-for="post in group.posts"
          :key="post.path"
          :to="post.path"
          class="post-item"
        >
          <span class="post-dot" />
          <span class="post-date">{{ formatDate(post.date, true) }}</span>
          <span class="post-title">{{ post.title }}</span>
          <span v-if="post.duration" class="post-duration">{{ post.duration }}</span>
        </RouterLink>
      </div>
    </div>

    <p v-if="!groupedByYear.length" class="text-center text-[var(--c-text-tertiary)] py-20">
      暂无文章
    </p>
  </div>
</template>

<style scoped>
.year-group {
  position: relative;
  padding-top: 3.5rem;
  padding-bottom: 1rem;
}

.year-bg {
  position: absolute;
  top: 0;
  left: 0;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.08em;
  color: var(--c-text-primary);
  opacity: 0.06;
  pointer-events: none;
  user-select: none;
  padding: 0.6rem 0 0 1.2rem;
  white-space: nowrap;
}

.posts {
  position: relative;
  z-index: 1;
  max-width: 42rem;
  margin: 0 auto;
}

.post-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease;
}

.post-item:hover {
  background: var(--c-surface-hover);
}

.post-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--c-border);
  background: transparent;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.post-item:hover .post-dot {
  background: hsl(217, 65%, 55%);
  border-color: hsl(217, 65%, 55%);
  transform: scale(1.45);
  box-shadow: 0 0 0 4px hsla(217, 65%, 55%, 0.12);
}

.post-date {
  font-size: 0.8rem;
  color: var(--c-text-tertiary);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  width: 3.2rem;
  text-align: right;
  transition: color 0.2s ease;
}

.post-item:hover .post-date {
  color: var(--c-text-secondary);
}

.post-title {
  font-size: 0.9375rem;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.post-item:hover .post-title {
  color: hsl(217, 65%, 55%);
}

.post-duration {
  font-size: 0.7rem;
  color: var(--c-text-tertiary);
  flex-shrink: 0;
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.post-item:hover .post-duration {
  opacity: 1;
}

@media (max-width: 768px) {
  .year-group {
    padding-top: 2.5rem;
  }

  .year-bg {
    font-size: clamp(2rem, 8vw, 3rem);
    padding: 0.4rem 0 0 0.8rem;
  }

  .posts {
    max-width: none;
  }
}
</style>
