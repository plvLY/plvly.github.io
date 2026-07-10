<script setup lang="ts">
import { formatDate } from '~/composables/utils'
import type { CollectionMeta } from '~/types'

const route = useRoute()
const dir = route.path.split('/').slice(0, -1).join('')
const { data } = await useAsyncData(`content-${route.path}`,
  () => queryContent(dir).where({ _path: route.path }).findOne())

const { data: collectionsData } = await useAsyncData('collections-meta', () =>
  queryContent('/collections').findOne()
)

const collectionName = computed(() => {
  const slug = data.value?.collection as string | undefined
  if (!slug) return null
  const configs = (collectionsData.value?.collections ?? []) as { slug: string; name: string }[]
  return configs.find(c => c.slug === slug)?.name || slug
})

const prev = ref<{ _path: string; title: string } | null>(null)
const next = ref<{ _path: string; title: string } | null>(null)

if (data.value?.collection) {
  const collSlug = data.value.collection as string
  const collPosts = await queryContent()
    .only(['_path', 'title'])
    .where({ _dir: 'posts', collection: collSlug as any })
    .sort({ date: -1 })
    .find() as { _path: string; title: string }[]

  const idx = collPosts.findIndex(p => p._path === route.path)
  if (idx > 0) prev.value = collPosts[idx - 1]
  if (idx < collPosts.length - 1 && idx >= 0) next.value = collPosts[idx + 1]
}

if (!prev.value && !next.value) {
  const [p, n] = await queryContent()
    .only(['_path', 'title'])
    .where({ _dir: 'posts' })
    .sort({ date: -1 })
    .findSurround(route.path)
  if (p) prev.value = p
  if (n) next.value = n
}

const backLink = computed(() => {
  const slug = data.value?.collection as string | undefined
  if (slug) {
    const configs = (collectionsData.value?.collections ?? []) as { slug: string; name: string }[]
    const name = configs.find(c => c.slug === slug)?.name || slug
    return { path: `/collections/${slug}`, label: name }
  }
  return { path: '/posts', label: '文章' }
})

const tocLinks = computed(() => data.value?.body?.toc?.links ?? [])

const showTop = ref(false)
function onScroll() {
  showTop.value = window.scrollY > 400
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="layout-article slide-enter-content">
    <div class="article-main">
      <ContentDoc :path="$route.path" v-slot="{ doc }">
        <article>
          <h1 class="mb-2 text-2xl font-bold">{{ doc.title }}</h1>
          <p v-if="doc.date" class="flex items-center gap-3 text-sm text-[var(--c-text-tertiary)] mb-8">
            <span>{{ formatDate(doc.date, false) }}</span>
            <span v-if="doc.duration" class="op50">· {{ doc.duration }}</span>
            <span
              v-if="doc.lang"
              class="px-2 py-0.5 text-xs rounded bg-[var(--c-border)] text-[var(--c-text-secondary)]"
            >{{ doc.lang }}</span>
            <RouterLink
              v-if="doc.collection && collectionName"
              :to="`/collections/${doc.collection}`"
              class="px-2 py-0.5 text-xs rounded bg-[var(--c-border)] text-[var(--c-text-secondary)] no-underline hover:text-[hsl(217,65%,55%)] transition-colors"
            >{{ collectionName }}</RouterLink>
          </p>
          <div class="mb-6 -mt-2">
            <RouterLink
              :to="backLink.path"
              class="inline-flex items-center gap-1 text-sm text-[var(--c-text-tertiary)] no-underline hover:text-[hsl(217,65%,55%)] transition-colors"
            >
              <div class="i-mdi-arrow-left text-size-sm op50" />
              <span>{{ backLink.label }}</span>
            </RouterLink>
          </div>
          <div class="prose">
            <ContentRenderer :value="doc" />
          </div>
        </article>
      </ContentDoc>

      <div class="mt-12 pt-6 border-t border-[var(--c-border)]">
        <div class="flex justify-between gap-4 text-sm">
          <div v-if="prev" class="flex-1 min-w-0">
            <RouterLink
              :to="prev._path"
              class="no-underline text-[var(--c-text-tertiary)] hover:text-[hsl(217,65%,55%)] transition-colors"
            >
              <span class="op50">←</span>
              <span class="truncate">{{ prev.title }}</span>
            </RouterLink>
          </div>
          <div v-if="next" class="flex-1 min-w-0 text-right">
            <RouterLink
              :to="next._path"
              class="no-underline text-[var(--c-text-tertiary)] hover:text-[hsl(217,65%,55%)] transition-colors"
            >
              <span class="truncate">{{ next.title }}</span>
              <span class="op50">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <aside v-if="tocLinks.length" class="toc-sidebar">
      <div class="toc-label">目录</div>
      <nav class="toc-nav">
        <a
          v-for="link in tocLinks"
          :key="link.id"
          :href="`#${link.id}`"
          class="toc-link"
          :style="{ paddingLeft: `${(link.depth - 2) * 0.75 + 0.5}rem` }"
        >
          {{ link.text }}
        </a>
      </nav>
    </aside>
    <button
      v-show="showTop"
      class="top-btn"
      title="回到顶部"
      @click="scrollToTop"
    >
      <div class="i-mdi-arrow-up text-size-xl" />
    </button>
  </div>
</template>

<style scoped>
.layout-article {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 2.5rem;
  max-width: min(92vw, 72rem);
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
}

.article-main {
  min-width: 0;
  max-width: 70ch;
}

.toc-sidebar {
  position: sticky;
  top: 5rem;
  align-self: start;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
  font-size: 0.875rem;
}

.toc-sidebar::-webkit-scrollbar {
  width: 4px;
}

.toc-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--c-text-tertiary);
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--c-border);
}

.toc-nav {
  display: flex;
  flex-direction: column;
}

.toc-link {
  display: block;
  padding-top: 0.35rem;
  padding-bottom: 0.35rem;
  text-decoration: none;
  color: var(--c-text-tertiary);
  transition: color 0.2s ease;
  line-height: 1.4;
  border-left: 2px solid transparent;
}

.toc-link:hover {
  color: hsl(217, 65%, 55%);
  border-left-color: hsl(217, 65%, 55%);
}

@media (max-width: 1024px) {
  .layout-article {
    grid-template-columns: 1fr;
    max-width: 60rem;
  }

  .toc-sidebar {
    display: none;
  }
}

.top-btn {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 50;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  border: 1px solid var(--c-border);
  background: var(--c-surface-elevated);
  color: var(--c-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,.08);
}
.top-btn:hover {
  color: hsl(217, 65%, 55%);
  border-color: hsl(217, 65%, 55%);
  box-shadow: 0 4px 16px rgba(0,0,0,.12);
}
</style>
