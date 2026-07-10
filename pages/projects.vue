<script setup lang="ts">
import PIcon from '~/components/PIcon.vue'

const { data } = await useAsyncData('projects', () => queryContent('/projects').findOne())

const projects = data?.value?.projects

function slug(name: string): string {
  return name.toLowerCase().replace(/[\s\\\/]+/g, '-')
}
</script>

<template>
  <div class="container-wide slide-enter-content">
    <p class="text-center mb-8 text-[var(--c-text-tertiary)] text-base italic">
      {{ data?.title }}
    </p>

    <div class="sticky top-0 z-10 bg-[var(--c-bg)] pb-3 mb-6 border-b border-[var(--c-border)]">
      <div class="flex flex-wrap gap-2 justify-center">
        <a
          v-for="key in Object.keys(projects || {})"
          :key="key"
          :href="`#${slug(key)}`"
          class="px-2.5 py-1 text-xs rounded border border-[var(--c-border)] transition-all duration-200 no-underline text-inherit opacity-50 hover:opacity-100"
        >
          {{ key }}
        </a>
      </div>
    </div>

    <div v-for="(key, cidx) in Object.keys(projects || {})" :key="cidx" class="mb-12">
      <div
        :id="slug(key)"
        class="mb-4"
      >
        <h2 class="text-base font-semibold m-0">{{ key }}</h2>
      </div>

      <div
        class="grid gap-4"
        :class="projects && projects[key].length > 2 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'"
      >
        <a
          v-for="(item, idx) in (projects ? projects[key] : [])"
          :key="idx"
          class="flex items-start gap-4 p-4 rounded-lg border border-[var(--c-border)] transition-all duration-200 no-underline text-inherit hover:bg-[var(--c-surface-hover)] group"
          :href="item.link"
          target="_blank"
          :title="item.name"
        >
          <div class="flex-none">
            <PIcon :name="item.icon || 'BookmarkFilled'" class-name="w-8 p-1.5 rounded-lg bg-[var(--c-border)] text-[var(--c-text-tertiary)] transition-colors" />
          </div>
          <div class="flex-auto min-w-0">
            <div class="text-sm font-medium truncate transition-colors">{{ item.name }}</div>
            <div class="text-xs text-[var(--c-text-tertiary)] mt-1 line-clamp-2">{{ item.desc }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

