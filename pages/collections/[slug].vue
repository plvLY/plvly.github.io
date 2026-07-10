<script setup lang="ts">
import { formatDate } from "~/composables/utils"
import type { CollectionMeta } from "~/types"

const route = useRoute()
const slug = route.params.slug as string

const { data: collectionsData } = await useAsyncData('collections', () =>
  queryContent('/collections').findOne()
)

const meta = computed<CollectionMeta | undefined>(() => {
  const configs = (collectionsData.value?.collections ?? []) as CollectionMeta[]
  return configs.find(c => c.slug === slug)
})

useHead({
  title: () => meta.value?.name ?? '合集不存在',
})

const getYear = (a: Date | string | number) => new Date(a).getFullYear()

const { data: list } = await useAsyncData('posts', () =>
  queryContent('/posts').find()
)

interface PostItem {
  path: string
  title: string
  date: string
  lang?: string
  duration?: string
}

const filteredPosts = computed(() => {
  if (!meta.value) return []
  const posts = list.value || []

  const filtered = slug === 'other'
    ? posts.filter(p => !p.collection)
    : posts.filter(p => p.collection === slug)

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const groupedByYear = computed(() => {
  const groups: Record<number, PostItem[]> = {}
  for (const post of filteredPosts.value) {
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
    <!-- Invalid slug -->
    <template v-if="!meta">
      <p class="text-center text-[var(--c-text-tertiary)] py-20">
        合集不存在
      </p>
    </template>

    <!-- Valid collection -->
    <template v-else>
      <div class="collection-header">
        <RouterLink to="/posts" class="back-link">
          <span class="i-mdi-arrow-left" />
          合集
        </RouterLink>

        <div class="header-hero" :style="{ borderTopColor: meta.color }">
          <div :class="meta.icon" class="hero-icon" :style="{ color: meta.color }" />
          <h1 class="hero-title">{{ meta.name }}</h1>
          <p class="hero-desc">{{ meta.description }}</p>
          <p class="hero-count">{{ filteredPosts.length }} 篇文章</p>
        </div>
      </div>

      <div v-for="group in groupedByYear" :key="group.year" class="year-group">
        <div class="year-bg">{{ group.year }}</div>

        <div class="posts">
          <RouterLink
            v-for="post in group.posts"
            :key="post.path"
            :to="post.path"
            class="post-item"
          >
            <span class="post-bar" />
            <span class="post-date">{{ formatDate(post.date, true) }}</span>
            <span class="post-title">{{ post.title }}</span>
            <span v-if="post.lang" class="post-lang">{{ post.lang }}</span>
            <span v-if="post.duration" class="post-duration">{{ post.duration }}</span>
          </RouterLink>
        </div>
      </div>

      <p v-if="!groupedByYear.length" class="text-center text-[var(--c-text-tertiary)] py-20">
        暂无文章
      </p>
    </template>
  </div>
</template>

<style scoped>
.collection-header {
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  text-decoration: none;
  color: var(--c-text-tertiary);
  margin-bottom: 1rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: hsl(217, 65%, 55%);
}

.header-hero {
  border-radius: 0.75rem;
  padding: 2rem 2rem 1.75rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-top: 3px solid;
}

.hero-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.hero-title {
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0 0 0.2rem;
  color: var(--c-text-primary);
}

.hero-desc {
  font-size: 0.875rem;
  margin: 0 0 0.2rem;
  line-height: 1.4;
  color: var(--c-text-secondary);
}

.hero-count {
  font-size: 0.8rem;
  margin: 0;
  color: var(--c-text-tertiary);
}

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

.post-bar {
  width: 2px;
  height: 1em;
  border-radius: 1px;
  background: var(--c-border);
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.post-item:hover .post-bar {
  background: hsl(217, 65%, 55%);
  transform: scaleY(1.4);
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

.post-lang {
  font-size: 0.7rem;
  flex-shrink: 0;
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
  background: var(--c-border);
  color: var(--c-text-secondary);
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.post-item:hover .post-lang {
  opacity: 1;
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
  .header-hero {
    padding: 1.5rem 1.25rem;
  }

  .hero-title {
    font-size: 1.125rem;
  }

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
