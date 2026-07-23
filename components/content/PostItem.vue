<script setup lang="ts">
import { formatDate } from "~/composables/utils"
import type { Post } from "~/types"

defineProps<{
  post: Post
  count?: number
}>()
</script>

<template>
  <RouterLink
    :to="post._path || post.path"
    class="post-item"
  >
    <span class="post-bar" />
    <span class="post-date">{{ formatDate(post.date, true) }}</span>
    <span class="post-title">{{ post.title }}</span>
    <span v-if="post.lang" class="post-lang">{{ post.lang }}</span>
    <span v-if="post.duration" class="post-duration">{{ post.duration }}</span>
    <span v-if="count != null" class="post-views">
      <span class="i-mdi-eye-outline post-views-icon" />
      {{ count }}
    </span>
  </RouterLink>
</template>

<style scoped>
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

.post-views {
  font-size: 0.7rem;
  color: var(--c-text-tertiary);
  flex-shrink: 0;
  padding: 0.15rem 0.45rem;
  border-radius: 0.25rem;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.post-item:hover .post-views {
  opacity: 1;
}

.post-views-icon {
  font-size: 0.8rem;
}
</style>
