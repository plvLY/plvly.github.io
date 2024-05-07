<script setup lang="ts">
import { useStorage} from "@vueuse/core";
import {Starport} from "vue-starport";

const props = {
  no: 0
}


const index = computed(() => +props.no)

let size = useStorage('size', 20)
</script>

<template>
  <div flex="~ col" class="px6 py-2 items-center" >
    <div
        class="circle-0 m10 items-center max-w-180"
        flex="~ col sm:row gap6"
    >
      <client-only>
        <Starport
            :port="String(index)"
            :style="{ width: `${size}px`, height: `${size}px` }"
            class="transition-all duration-800"
        >
          <Logo
              class="rounded-1/2 shadow-xl"
              :index="index"
          />
        </Starport>
      </client-only>
    </div>
    <div class="prose m-auto slide-enter-content no-preference ">
      <ContentDoc path="/info"/>
    </div>
  </div>
</template>