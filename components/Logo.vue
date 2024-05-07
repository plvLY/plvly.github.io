<script setup lang="ts">
import { images } from '~/composables/data'

const { index } = defineProps<{
  index: number
}>()
const src = computed(() => images[index])
const counter = ref(Math.round(Math.random() * 100))

</script>

<template>
  <div class="my-component overflow-hidden w-full h-full transition-all duration-900 relative select-none">
    <img
        class="object-cover block w-full h-full"
        :src="src"
        alt="">
  </div>
</template>