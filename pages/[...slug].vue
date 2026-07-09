<script setup lang="ts">
import { formatDate } from '~/composables/utils'

const route = useRoute()
const dir = route.path.split('/').slice(0, -1).join('')
const { data } = await useAsyncData(`content-${route.path}`,
  () => queryContent(dir).where({ _path: route.path }).findOne())

const [prev, next] = await queryContent()
    .only(['_path', 'title'])
    .where({_dir:"posts"})
    .sort({ date: -1})
    .findSurround(route.path)
</script>

<template>
  <article class="px-6 md:px-10 py-10 slide-enter-content">
    <div class="prose m-auto max-w-180">
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
          </p>
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
  </article>
</template>
