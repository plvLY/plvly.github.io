<script setup lang="ts">

const route = useRoute()
/*获取文件夹路由*/
const pRoute = route.path.split('/').slice(0, -1).join('')
/*查询当前路由下文章信息的文章*/
const { data } = await useAsyncData('', () => queryContent(pRoute).where({ _path: route.path }).findOne())
/*获取toc信息*/
const toc = data.value?.body?.toc
console.log(toc)
// const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
/*获取相邻文章地址*/
const [prev, next] = await queryContent()
    .only(['_path', 'title'])
    .where({_dir:"posts"})
    .sort({ date: -1})
    .findSurround(route.path)
// console.log(queryContent().where({_dir:"posts"}).findSurround(route.path))
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
        <div>
          <RouterLink
              :to="prev?._path || ''"
          >
            <span class="font-mono" hover:bg-green>> next:{{prev?prev.title:'没了，别点！'}}</span>
          </RouterLink>
        </div>
        <div>
          <RouterLink
              :to="next?._path || ''"
          >
            <span class="font-mono" hover:bg-green>> prev:{{next?next.title:'没了，别点！'}}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </article>
</template>
