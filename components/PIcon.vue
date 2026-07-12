<script setup lang="ts">
import BookmarkFilled from '~icons/carbon/bookmark-filled'
import SendAltFilled from '~icons/carbon/send-alt-filled'
import LocationFilled from '~icons/carbon/location-filled'
import Blog from '~icons/carbon/blog'
import LogoPython from '~icons/carbon/logo-python'
import ConditionPoint from '~icons/carbon/condition-point'
import Language from '~icons/carbon/language'
import Ai from '~icons/carbon/ai'
import Application from '~icons/carbon/application'
import ServerProxy from '~icons/carbon/server-proxy'
import ChartBar from '~icons/carbon/chart-bar'

const registry: Record<string, Component> = {
  blog: markRaw(Blog),
  bookmarkfilled: markRaw(BookmarkFilled),
  sendaltfilled: markRaw(SendAltFilled),
  locationfilled: markRaw(LocationFilled),
  logopython: markRaw(LogoPython),
  conditionpoint: markRaw(ConditionPoint),
  language: markRaw(Language),
  ai: markRaw(Ai),
  application: markRaw(Application),
  serverproxy: markRaw(ServerProxy),
  chartbar: markRaw(ChartBar),
}

const props = withDefaults(defineProps<{
  name: string
  className?: string
}>(), { className: '' })

const icon = computed(() => {
  const key = props.name.toLowerCase().replace(/[-_\s]/g, '')
  return registry[key] || null
})
</script>

<template>
  <component :is="icon" :class="className" v-bind="$attrs" />
</template>

<style scoped>

</style>