<script setup lang="ts">
import { formatDate } from "~/composables/utils"
import type { CollectionMeta, Post } from "~/types"

useHead({
  title: '文章',
})

const getYear = (a: Date | string | number) => new Date(a).getFullYear()

const route = useRoute()
const viewAll = computed(() => route.query.view === 'all')

const { data: list } = await useAsyncData('posts', () =>
  queryContent('/posts').sort({ date: -1 } as const).find()
)

const { data: collectionsData } = await useAsyncData('collections', () =>
  queryContent('/collections').findOne()
)

function getArticleCount(posts: Post[], slug: string): number {
  if (slug === 'other') return posts.filter((p) => !p.collection).length
  return posts.filter((p) => p.collection === slug).length
}

interface YearGroup {
  year: number
  posts: Post[]
}

const groupedByYear = computed(() => {
  const posts = (list.value || []) as Post[]
  const groups: Record<number, Post[]> = {}
  for (const post of posts) {
    const year = getYear(post.date)
    if (!groups[year]) groups[year] = []
    groups[year].push(post)
  }
  return Object.entries(groups)
    .sort(([a], [b]) => +b - +a)
    .map(([year, posts]) => ({ year: +year, posts }))
})

const cards = computed(() => {
  const posts = (list.value || []) as Post[]
  const configs = (collectionsData.value?.collections ?? []) as CollectionMeta[]
  const result = configs
    .filter(c => getArticleCount(posts, c.slug) > 0)
    .map(c => ({ ...c, count: getArticleCount(posts, c.slug) }))
  return result
})

const { pageCounts } = usePageCounts()

const latestPosts = computed(() => {
  const posts = (list.value || []) as Post[]
  const configs = (collectionsData.value?.collections ?? []) as CollectionMeta[]
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(p => ({
      ...p,
      collectionName: configs.find(c => c.slug === p.collection)?.name
    }))
})
</script>

<template>
  <div class="container-main slide-enter-content">
    <!-- View: Collection cards (default) -->
    <template v-if="!viewAll">
      <div class="collection-grid">
        <RouterLink
          v-for="card in cards"
          :key="card.slug"
          :to="`/collections/${card.slug}`"
          class="collection-card"
          :style="{ borderTopColor: card.color, '--card-color': card.color }"
        >
          <div class="card-inner">
            <div :class="card.icon" class="card-icon" />
            <h3 class="card-name">{{ card.name }}</h3>
            <p class="card-count">{{ card.count }} 篇文章</p>
            <p class="card-desc">{{ card.description }}</p>
          </div>
        </RouterLink>
      </div>

      <section v-if="latestPosts.length" class="latest-section">
        <h2 class="latest-heading">最新文章</h2>
        <div class="latest-list">
          <RouterLink
            v-for="post in latestPosts"
            :key="post._path || post.path"
            :to="post._path || post.path"
            class="latest-item"
          >
            <span class="latest-date">{{ formatDate(post.date, true) }}</span>
            <span class="latest-title">{{ post.title }}</span>
            <span class="latest-meta">
              <span v-if="post.collectionName" class="latest-tag">{{ post.collectionName }}</span>
              <span v-if="post.lang" class="latest-tag">{{ post.lang }}</span>
              <span v-if="post.duration" class="latest-duration">{{ post.duration }}</span>
              <span v-if="pageCounts[post._path || post.path] != null" class="latest-views">
                <span class="i-mdi-eye-outline" />
                {{ pageCounts[post._path || post.path] }}
              </span>
            </span>
          </RouterLink>
        </div>
      </section>

      <div class="view-all-link">
        <RouterLink :to="{ path: '/posts', query: { view: 'all' } }" class="view-all-btn">
          <span class="i-mdi-file-document-outline" />
          查看全部文章
          <span class="i-mdi-arrow-right" />
        </RouterLink>
      </div>
    </template>

    <!-- View: All posts by year (time-line) -->
    <template v-else>
      <div class="view-controls">
        <RouterLink :to="'/posts'" class="back-btn">
          <span class="i-mdi-arrow-left" />
          合集视图
        </RouterLink>
      </div>

      <YearGroup
        v-for="group in groupedByYear"
        :key="group.year"
        :year="group.year"
        :posts="group.posts"
        :page-counts="pageCounts"
      />
    </template>

    <p v-if="!list?.length" class="text-center text-[var(--c-text-tertiary)] py-20">
      暂无文章
    </p>
  </div>
</template>

<style scoped>
.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.collection-card {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  padding: 2rem 1.5rem;
  min-height: 180px;
  text-decoration: none;
  cursor: pointer;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-top: 3px solid;
  transition: all 0.25s ease;
}

.collection-card:hover {
  background: var(--c-surface-hover);
  border-color: var(--c-border-hover);
  border-top-color: inherit;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.25rem;
}

.card-icon {
  font-size: 1.75rem;
  margin-bottom: 0.35rem;
  color: var(--c-text-secondary);
  transition: color 0.25s ease;
}

.collection-card:hover .card-icon {
  color: var(--card-color);
}

.card-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  color: var(--c-text-primary);
}

.card-count {
  font-size: 0.8rem;
  margin: 0;
  color: var(--c-text-tertiary);
}

.card-desc {
  font-size: 0.78rem;
  margin: 0.5rem 0 0;
  line-height: 1.4;
  color: var(--c-text-tertiary);
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}

.collection-card:hover .card-desc {
  max-height: 3em;
  opacity: 1;
}

.latest-section {
  margin-top: 3rem;
}

.latest-heading {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: var(--c-text-tertiary);
  margin: 0 0 0.75rem;
  user-select: none;
}

.latest-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.latest-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.6rem 0.8rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease;
}

.latest-item:hover {
  background: var(--c-surface-hover);
}

.latest-date {
  font-size: 0.8rem;
  color: var(--c-text-tertiary);
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  width: 3.2rem;
  text-align: right;
}

.latest-title {
  font-size: 0.9375rem;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.latest-item:hover .latest-title {
  color: hsl(217, 65%, 55%);
}

.latest-meta {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
}

.latest-tag {
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
  background: var(--c-border);
  color: var(--c-text-secondary);
  opacity: 0.6;
}

.latest-duration {
  font-size: 0.7rem;
  color: var(--c-text-tertiary);
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  opacity: 0.6;
}

.latest-views {
  font-size: 0.7rem;
  color: var(--c-text-tertiary);
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  opacity: 0.6;
}

.latest-item:hover .latest-tag,
.latest-item:hover .latest-duration,
.latest-item:hover .latest-views {
  opacity: 1;
}

.view-all-link {
  margin-top: 3rem;
  text-align: center;
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  text-decoration: none;
  color: var(--c-text-secondary);
  border: 1px solid var(--c-border);
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  color: hsl(217, 65%, 55%);
  border-color: hsl(217, 65%, 55%);
  background: var(--c-surface-hover);
}

.view-controls {
  margin-bottom: 2rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  text-decoration: none;
  color: var(--c-text-tertiary);
  transition: color 0.2s ease;
}

.back-btn:hover {
  color: hsl(217, 65%, 55%);
}

@media (max-width: 768px) {
  .collection-grid {
    grid-template-columns: 1fr;
  }
}
</style>
