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
      :class="prefersReduced ? '' : 'animate-glow'"
      :style="{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(217, 65%, 55%, 0.08) 0%, transparent 60%)',
      }"
    />
    <div
      class="w-full h-full dark:lt-md:hidden hidden dark:block"
      :class="prefersReduced ? '' : 'animate-glow'"
      :style="{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(217, 70%, 65%, 0.06) 0%, transparent 60%)',
      }"
    />
  </div>
</template>

<style scoped>
@keyframes glow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

.animate-glow {
  animation: glow 8s ease-in-out infinite;
}
</style>
