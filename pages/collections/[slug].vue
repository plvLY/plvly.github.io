<script setup lang="ts">
import { formatDate } from "~/composables/utils"
import type { CollectionMeta, Post } from "~/types"

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

const filteredPosts = computed(() => {
  if (!meta.value) return []
  const posts = (list.value || []) as Post[]

  const filtered = slug === 'other'
    ? posts.filter(p => !p.collection)
    : posts.filter(p => p.collection === slug)

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const { pageCounts } = usePageCounts()

const groupedByYear = computed(() => {
  const groups: Record<number, Post[]> = {}
  for (const post of filteredPosts.value) {
    const year = getYear(post.date)
    if (!groups[year]) groups[year] = []
    groups[year].push(post)
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

      <YearGroup
        v-for="group in groupedByYear"
        :key="group.year"
        :year="group.year"
        :posts="group.posts"
        :page-counts="pageCounts"
      />

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

@media (max-width: 768px) {
  .header-hero {
    padding: 1.5rem 1.25rem;
  }

  .hero-title {
    font-size: 1.125rem;
  }
}
</style>
