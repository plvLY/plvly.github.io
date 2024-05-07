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
</script>