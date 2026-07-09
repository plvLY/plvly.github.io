<script setup lang="ts">
import { formatDate } from '~/composables/utils'

const route = useRoute()
const dir = route.path.split('/').slice(0, -1).join('')
const { data } = await useAsyncData(`content-${route.path}`,
  () => queryContent(dir).where({ _path: route.path }).findOne())
const toc = data.value?.body?.toc

const [prev, next] = await queryContent()
    .only(['_path', 'title'])
    .where({_dir:"posts"})
    .sort({ date: -1})
    .findSurround(route.path)
</script>
<template>
  <article class="no-preference">

    <div class="prose m-auto slide-enter-content no-preference">
      <div class="table-of-contents">
        <ul v-if="toc && toc.links">
          <li v-for="link in toc.links" :key="link.text" hover:bg-green>
            <a :href="`#${link.id}`">
              {{ link.text }}
            </a>
						<div v-for="child in link?.children" :key="link.id" hover:bg-red hover:color-white>
							<a :href="`#${child.id}`" ml-5 text-sm op70 hover:color-white>
								{{ child.text }}
							</a>
						</div>
          </li>
        </ul>
      </div>
      <div>
        <ContentDoc :path="$route.path" v-slot="{ doc }">
          <article>
            <h1 class="mb-0">{{ doc.title }}</h1>
            <p
              v-if="doc.date"
              class="opacity-50 !-mt-6"
            >
<!--              <span v-if="doc.author">{{ doc.author }} at </span>-->
              {{ formatDate(doc.date, false) }}
              <span v-if="doc.duration">· {{ doc.duration }}</span>

            </p>
            <ContentRenderer :value="doc" />
          </article>
<!--          <template #not-found>-->
<!--            <h1>Document not found</h1>-->
<!--          </template>-->
        </ContentDoc>
      </div>
      <div class="header back fixed left-75% bottom-7 h-10 op50!">
        <div v-if="prev">
          <RouterLink :to="prev._path">
            <span class="font-mono" hover:bg-green>> next:{{ prev.title }}</span>
          </RouterLink>
        </div>
        <div v-if="next">
          <RouterLink :to="next._path">
            <span class="font-mono" hover:bg-green>> prev:{{ next.title }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>
