<script setup lang="ts">
const { count, ready } = useVisitCount()
</script>

<template>
  <span v-if="ready" class="text-sm text-[var(--c-text-tertiary)]">
    访客 {{ count.toLocaleString() }} 人次
  </span>
</template>
