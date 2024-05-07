<script setup lang="ts">
import {Starport} from "vue-starport";
import {useStorage} from "@vueuse/core";

const appConfig = useAppConfig()

function toTop(){
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const { y: scroll } = useWindowScroll()

const mode = useStorage('starport-image-mode',true)
const idx = 0
</script>

<template>
  <header class="header z-40">
    <client-only>
      <button
          title="Scroll to top"
          class="fixed left-80% bottom-25 w-10 h-10 hover:op50
      hover-bg-hex-8883 transition duration-300 z-100 print:hidden border-rd-full border-0"
          :class="scroll > 300 ? 'op50' : 'op0! pointer-events-none'"
          @click="toTop()"
      >TOP</button>
    </client-only>

    <div class="back fixed left-80% bottom-15 h-10" :class="$route.path !== '/' ? 'op100' : 'op0! pointer-events-none'">
      <RouterLink
          :to="$route.path.split('/').slice(0, -1).join('/') || '/'"
      >
        <span class="font-mono">> cd ../</span>
      </RouterLink>
    </div>
    <nav class="nav">
<!--      <div class="fixed ">-->
<!--        <RouterLink-->
<!--            :to="`/info`"-->
<!--        >-->
<!--          <client-only>-->
<!--            <Starport-->
<!--                :port="String(idx)"-->
<!--                :class="mode ? 'aspect-1/1' : 'aspect-16/9'"-->
<!--                transition-all duration-800-->
<!--            >-->
<!--              <Logo-->
<!--                  :class="mode ? 'rounded' : ''"-->
<!--                  :index="idx"-->
<!--              />-->
<!--            </Starport>-->
<!--          </client-only>-->
<!--        </RouterLink>-->
<!--        <RouterLink to="/info" title="个人信息" class="flex align-center items-center">-->
<!--          <NuxtImg src="/logo.png" alt="" class="w-10 h-10" />-->
<!--          <span class="lt-md:hidden">{{ appConfig.title }}</span>-->
<!--        </RouterLink>-->
<!--      </div>-->

      <div class="spacer print:op0"/>
      <div class="right" >

        <RouterLink to="/" title="首页">
          <span class="lt-md:hidden">首页</span>
          <div class="i-mdi-archive-eye md:hidden text-size-2xl"  />
        </RouterLink>
        <RouterLink to="/posts" title="文章">
          <span class="lt-md:hidden">文章</span>
          <div class="i-mdi-archive-eye md:hidden text-size-2xl"  />
        </RouterLink>
        <RouterLink to="/projects" title="项目">
          <span class="lt-md:hidden">Demo</span>
          <div class="i-mdi-folder-cog md:hidden text-size-2xl" />
        </RouterLink>
        <RouterLink to="/info" title="关于">
          <span class="lt-md:hidden">关于</span>
          <div class="i-mdi-archive-eye md:hidden text-size-2xl"  />
        </RouterLink>
        <a href="https://gitee.com/plv-coding" target="_blank" title="Gitee" class="lt-md:hidden">
          <div class="i-mdi-gitlab text-size-2xl" />
        </a>
        <a href="https://github.com/plvLY" target="_blank" title="GitHub" class="lt-md:hidden">
          <div class="i-mdi-github text-size-2xl" />
        </a>
        <ToggleTheme />
      </div>
    </nav>

  </header>
</template>

<style scoped>

.header h1{
  margin-bottom: 0;
}
.nav {
  padding: 2rem;
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  box-sizing: border-box;
}

.nav > * {
  margin: auto;
}

.nav img {
  margin-bottom: 0;
}

.nav a,.back a {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.6;
  outline: none;
}

.nav a:hover {
  opacity: 1;
  text-decoration-color: inherit;
}

.nav .right {
  display: grid;
  grid-gap: 1.2rem;
  grid-auto-flow: column;
}

.nav .right > * {
  margin: auto;
}

</style>