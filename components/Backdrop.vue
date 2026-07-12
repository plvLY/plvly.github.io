<script setup lang="ts">
const prefersReduced = ref(false)

onMounted(() => {
  prefersReduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<template>
  <div
    class="fixed top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden"
    style="z-index: -1"
  >
    <div
      class="w-full h-full lt-md:hidden"
      :style="{
        backgroundImage: 'linear-gradient(var(--c-border) 1px, transparent 1px), linear-gradient(90deg, var(--c-border) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        opacity: prefersReduced ? 0.3 : 0.5,
      }"
    />
    <div
      class="w-full h-full hidden dark:block lt-md:hidden"
      :style="{
        backgroundImage: 'linear-gradient(var(--c-border) 1px, transparent 1px), linear-gradient(90deg, var(--c-border) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        opacity: prefersReduced ? 0.15 : 0.3,
      }"
    />
  </div>
</template>
