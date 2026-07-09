<script setup lang="ts">
defineProps<{
  index: number
}>()
</script>

<template>
  <div class="my-component overflow-hidden w-full h-full transition-all duration-900 relative select-none">
    <img
        class="object-cover block w-full h-full"
        src="/logo.png"
        alt="PLV logo">
  </div>
</template>