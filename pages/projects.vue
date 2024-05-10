<script setup lang="ts">
import PIcon from '~/components/PIcon.vue'

const { data } = await useAsyncData('projects', () => queryContent('/projects').findOne())

const projects = data?.value?.projects

function slug(name: string): string {
  return name.toLowerCase().replace(/[\s\\\/]+/g, '-');
}
</script>

<template>
  <div class="max-w-300 mx-auto prose m-auto p-l-40 slide-enter-content">
    <p class="text-center mb5 op50 text-lg italic">
      {{data.title}}
    </p>
    <div v-for="(key, cidx) in Object.keys(projects)" :key="cidx"
     :style="{ '--enter-stage': cidx + 1 }"
     slide-enter
     class="pb-10"
    >
      <div
        :id="slug(key)"
        class="select-none relative h20 pointer-events-none slide-enter"
        :style="{
          '--enter-stage': cidx - 2,
          '--enter-step': '60ms',
        }"
      >
        <span class="text-5em color-transparent absolute left--1rem top-0rem font-bold leading-1em text-stroke-1.5 text-stroke-hex-aaa op35 dark:op20" >
          {{ key }}
        </span>
      </div>
      <div
        class="project-grid py-2 max-w-500 mx-auto"
        grid="~ cols-1 md:cols-2 gap-4 lg:cols-3"
      >
        <a
          v-for="(item, idx) in projects[key]"
          :key="idx"
          class="item relative flex items-center"
          :href="item.link"
          target="_blank"
          :title="item.name"
        >
          <PIcon :name="item.icon || 'BookmarkFilled'" class-name="w-10 opacity-50 pr-1"/>
          <div class="flex-auto">
            <div class="text-normal">{{ item.name }}</div>
            <div class="desc text-sm opacity-50 font-normal" v-html="item.desc" />
          </div>
        </a>
      </div>
    </div>
  </div>
  <div class="prose">
    <div class="table-of-contents  pl-10">
      <div class="table-of-contents-anchor">
        <div class="i-mdi-menu-open text-size-2xl" />
      </div>
      <ul class="pl-1">
        <li v-for="key of Object.keys(projects)" :key="key">
          <a :href="`#${slug(key)}`">{{ key }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>