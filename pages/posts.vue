<script setup lang="ts">
import {formatDate} from "~/composables/utils";
import type {ParsedContent} from "@nuxt/content/types";
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'

useHead({
  title: '文章',
})

const getYear = (a: Date | string | number) => new Date(a).getFullYear()
const isFuture = (a?: Date | string | number) => a && new Date(a) > new Date()
const isSameYear = (a?: Date | string | number, b?: Date | string | number) => a && b && getYear(a) === getYear(b)

/*是否是同一组*/
function isSameGroup(a: ParsedContent, b?: ParsedContent) {
  return (isFuture(a.date) === isFuture(b?.date)) && isSameYear(a.date, b?.date)
}

/*提取年份 作为分类名称*/
function getGroupName(p: ParsedContent) {
  if (isFuture(p.date))
    return 'Upcoming'
  return getYear(p.date)
}

/* 排序-按时间倒序*/
const query: QueryBuilderParams = { path: '/posts', sort: [{ date: -1 }] }

</script>

<template >
  <div class="prose m-auto p-l-40 slide-enter-content">
    <ContentList :query="query">
      <template #default="{ list }">
        <div v-for="(post, idx) in list" :key="post._path">
          <div
              v-if="!isSameGroup(post, list[idx - 1])"
              class="select-none relative h20 pointer-events-none slide-enter"
              :style="{ '--enter-stage': idx-2, '--enter-step': '60ms', }"
          >
            <span class="text-8em color-transparent absolute left--3rem top--2rem font-bold text-stroke-2 text-stroke-hex-aaa op20">
              {{ getGroupName(post) }}
            </span>
          </div>
          <div class="slide-enter" :style="{ '--enter-stage': idx, '--enter-step': '60ms', }" >
            <component
                :is="'RouterLink'"
                :to="post._path"
                class="item block font-normal mb-6 mt-2 no-underline"
            >
              <li class="no-underline" flex="~ col md:row gap-2 md:items-center">
                <div class="title text-lg leading-1.2em" flex="~ gap-2 wrap">
                  <span
                      v-if="post.lang"
                      class="align-middle flex-none text-xs bg-zinc:15 text-zinc5 rounded px-1 py-0.5 ml--12 mr2 my-auto hidden md:block"
                  >{{post.lang}}</span>
                  <span class="align-middle">{{ post.title }}</span>
                  <span
                      v-if="post.redirect"
                      class="align-middle op50 flex-none text-xs ml--1.5
                      i-mdi-arrow-up-right"
                      title="External"
                  />
                </div>
                <div flex="~ gap-2 items-center">
                  <span class="text-sm op50 ws-nowrap">
                {{ formatDate(post.date, true) }}
              </span>
                  <span v-if="post.duration" class="text-sm op40 ws-nowrap">· {{ post.duration }}</span>
                </div>
              </li>
            </component>
          </div>
        </div>
      </template>
      <template #not-found>
        <p>No articles found.</p>
      </template>
    </ContentList>
  </div>


</template>

<style scoped>

</style>