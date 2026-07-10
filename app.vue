<template>
  <div class="font-sans text-gray-700 dark:text-gray-200 relative">
    <NuxtLayout >
      <NuxtLoadingIndicator />
      <div>
        <StarportCarrier>
          <NuxtPage />
        </StarportCarrier>
      </div>
    </NuxtLayout>
  </div>
</template>
<script setup lang="ts">
import {StarportCarrier} from "vue-starport";

useAnalytics()

const appConfig = useAppConfig()

useSeoMeta({
  title: () => `${appConfig.title}`,
  ogTitle: () => `${appConfig.title}`,
  description: 'PLV 的个人博客',
})
</script>