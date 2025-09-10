<script setup>
const { type} = defineProps(['type'])
import { useStorage} from "@vueuse/core";

</script>

<template>
  <div class=" p-2 rounded language-ts " :class="type" >
    <ContentSlot :use="$slots.default" unwrap="p" />
  </div>
</template>

<style scoped>

.notice{
  --tw-border-opacity: 1;
  border-color: rgb(254 215 170 / var(--tw-border-opacity));
  --tw-bg-opacity: 0.4;
  background-color: rgb(244 67 54 / var(--tw-bg-opacity));
}
.dark .notice{
  --tw-bg-opacity: 0.1;
  background-color: rgb(244 67 54 / var(--tw-bg-opacity));
}

.warning{
  --tw-border-opacity: 1;
  border-color: rgb(254 215 170 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(255 237 213 / var(--tw-bg-opacity));
}
.dark .warning{
  --tw-bg-opacity: 0.1;
  background-color: rgb(255 237 213 / var(--tw-bg-opacity));
}

.tip{
  --tw-border-opacity: 1;
  border-color: rgb(170 196 254 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(170 196 254 / var(--tw-bg-opacity));
}

.dark .tip{
  --tw-bg-opacity: 0.1;
  background-color: rgb(170 196 254 / var(--tw-bg-opacity));
}
</style>