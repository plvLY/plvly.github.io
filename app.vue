<template>
  <div class="font-sans text-gray-700 dark:text-gray-200 relative">
    <NuxtLayout >
      <NuxtLoadingIndicator />
      <StarportCarrier>
        <NuxtPage />
      </StarportCarrier>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import {StarportCarrier} from "vue-starport";

useHead({
  meta: [
    { name: "description", content: "这是PLV的博客站点" },
  ]
})
useSeoMeta({
  title: 'PLV-简约博客',
  ogTitle: 'PLV-简约博客',
  description: '这是PLV的博客站点',
})
</script>