<script setup lang="ts">
import {formatDate, getCurrentDate} from "~/composables/utils";
import PIcon from '~/components/PIcon.vue'

let msg = ref()
let msgList: any = ref([])
// 获取文件数据
const { data } = await $fetch('/api/message2DB',{method: 'POST'})
msgList.value = data.web
//获取当前IP位置相信
const address = await $fetch('/api/ip-utils',{method: 'POST'})
const ip = address?Object.keys(address.data)[0] : undefined
const nation = address ? Object.values(address.data)[0]?.nation : '银河'
const province = address ? Object.values(address.data)[0]?.province : '太阳系'
const city = address ? Object.values(address.data)[0]?.city : '地球'
const location = nation.concat('·').concat(province).concat('·').concat(city)
// console.log(address.data,Object.keys(address.data),Object.values(address.data))
// 保存文件
async function saveMd() {
  if (!msg.value) return false
  const { data } = await $fetch('/api/message2DB',
    {
      method: 'POST',
      body: {msg: msg.value,date:getCurrentDate(),addr:location,ip:ip}
    })
  msgList.value = data.web
  msg.value = ''
}
</script>

<template>
  <div class="prose m-auto slide-enter-content">
    <div class="">
      <input placeholder="简简单单说句话" type="text" v-model.trim="msg"
       class="border mr h10 w100 border-rounded-3 text-center text-zinc5 text-1.1em hover:border-amber focus:outline-none
      "
    />
<!--      <button class="w-25 h-10 border-rounded-3 dark:op90 op50 hover:op100" @click="saveMd">-->
      <button class="w-25 h-10 border-rounded-3 dark:op90 op50 hover:op100" >
        <PIcon :name="'SendAltFilled'" class-name="w-6 align-middle color-emerald"/>
        说两句
      </button>
    </div>
<!--    <ContentDoc path="/message"/>-->
    <div class="pt-10">
      <div class=" align-middle" flex="~ gap-2 wrap" v-for="item in msgList">

        <span class="op70">{{item.msg}}</span>
        <div flex="~ gap-2 items-center">
          <span class="text-xs op50 ws-nowrap">
            {{ item.date }}
          </span>
        </div>
        <span
          v-if="item.addr"
          class="align-middle flex-none text-xs  rounded px-1 py-0.5  ml2 my-auto hidden md:block"
        >
          <PIcon :name="'LocationFilled'" class-name="w-4 align-middle color-green"/>
          {{item.addr}}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
input::placeholder { opacity: 0.4; font-style: italic; }
</style>