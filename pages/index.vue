<script setup lang="ts">
import { images } from '~/composables/data'
import {Starport} from "vue-starport";

import { useStorage} from "@vueuse/core";

// console.log(images)
// const mode = true
const mode = useStorage('starport-image-mode',true)
const logInfo = useStorage('log-info',true)
const toggle = useToggle(mode)

const enum UserInfo {
  UserName = '吖飘PLV',
  ContactType = 'QQ',
  QQ = '837965182',
  Metier = '码农'
}
if (logInfo.value){
  console.log('%c作者:%s,\n职业:%s,\n联系方式:%s->%s','color: skyblue; font-size: 30px;',UserInfo.UserName,UserInfo.Metier,UserInfo.ContactType,UserInfo.QQ)
  logInfo.value = !logInfo.value
}
// console.log(logInfo.value)
</script>

<template>
  <div class="px6 py-2 items-center ">
    <div id="gallery" class="flex" >
<!--    <div id="gallery" grid="~ cols-1 sm:cols-1 md:cols-2 lg:cols-3 xl:cols-3 px-10 justify-center" >-->
      <div class="w-20 h-20">
        <RouterLink
            v-for="img, idx of images"
            :key="img"
            :to="`/info`"
        >
          <client-only>
            <Starport
                :port="String(idx)"
                :class="mode ? 'aspect-1/1' : 'aspect-16/9'"
                transition-all duration-800 w-20 h-20
            >
              <Logo
                  :class="mode ? 'rounded ' : ''"
                  :index="idx"
              />
            </Starport>
          </client-only>
        </RouterLink>
      </div>
      <div class="prose m-auto slide-enter-content no-preference ">
        <ContentDoc path="/"/>
      </div>
    </div>
  </div>
</template>