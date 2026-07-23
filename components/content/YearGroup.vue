<script setup lang="ts">
import type { Post } from "~/types"

defineProps<{
  year: number
  posts: Post[]
  pageCounts?: Record<string, number>
}>()
</script>

<template>
  <div class="year-group">
    <div class="year-bg">{{ year }}</div>

    <div class="posts">
      <PostItem
        v-for="post in posts"
        :key="post.path"
        :post="post"
        :count="pageCounts?.[post._path || post.path]"
      />
    </div>
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
</style>
