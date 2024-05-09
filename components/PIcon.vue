<script setup lang="ts">
import {computed} from "vue";
import * as vicons from '@vicons/carbon'

const props = defineProps({
  name: String,
  className: String,
})

const iconName = computed(() => {
  //将图标转换为PascalCase
  const iconComponentName = props.name?.replace(/(\w)/, (match) => match.toUpperCase())
  return vicons[iconComponentName] || null
})
</script>

<template>
    <component :is="iconName" v-bind="$attrs" :class="className"/>
</template>

<style scoped>

</style>