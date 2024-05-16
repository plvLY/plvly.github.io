<script setup lang="ts">
import { images } from '~/composables/data'
import {Starport} from "vue-starport";

import { useStorage} from "@vueuse/core";
import {getCurrentDate} from "~/composables/utils";

const mode = useStorage('starport-image-mode',true)
const logInfo = useStorage('log-info',true)

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
// 需要有修改文件的权限
// 访问情况记录
//获取当前IP位置相信
/*
const address = await $fetch('/api/ip-utils',{method: 'POST'})
const ip = address?Object.keys(address.data)[0] : undefined
const nation = address ? Object.values(address.data)[0]?.nation : '银河'
const province = address ? Object.values(address.data)[0]?.province : '太阳系'
const city = address ? Object.values(address.data)[0]?.city : '地球'
const location = nation.concat('·').concat(province).concat('·').concat(city)
const { data } = await useAsyncData(
    'mountains',
    () => $fetch('/api/count2DB',{
      method: 'POST',
      body: {
        date:getCurrentDate(),addr:location,ip:ip
      }
    }
    )
)
 */
</script>

<template>
  <div class="px6 py-2 items-center ">
    <div id="gallery" class="flex" >
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