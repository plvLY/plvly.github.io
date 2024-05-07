<script setup lang="ts">
const isDark = useDark();

const toggleDark = (event: MouseEvent) => {
  const isAppearanceTransition = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
  )
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })

  // console.log('this.doc-->',endRadius)

  transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
        document.documentElement.animate(
            {
              clipPath: isDark.value
                  ? [...clipPath].reverse()
                  : clipPath,
            },
            {
              duration: 400,
              easing: 'ease-out',
              pseudoElement: isDark.value
                  ? '::view-transition-old(root)'
                  : '::view-transition-new(root)',
            },
        )
      })
}
</script>

<template>
  <a class="select-none" title="Toggle Color Scheme" @click="toggleDark">
    <div class="i-mdi-white-balance-sunny dark:i-mdi-weather-night text-size-2xl" />
  </a>
</template>

<style scoped>

</style>