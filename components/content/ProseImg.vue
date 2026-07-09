<template>
  <img :src="src" :alt="alt" loading="lazy" />
</template>

<script setup lang="ts">
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
})
</script>
