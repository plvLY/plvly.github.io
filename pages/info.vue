<script setup lang="ts">
import {Starport} from "vue-starport";

const props = defineProps({
  no: { type: Number, default: 0 }
})

const size = 200
</script>

<template>
  <div flex="~ col" class="px6 py-2 items-center" >
    <div
        class="circle-0 m10 items-center max-w-180"
        flex="~ col sm:row gap6"
    >
      <client-only>
        <Starport
            :port="String(props.no)"
            class="w-50 h-50 transition-all duration-800"
        >
          <Logo
              class="rounded-1/2 shadow-xl"
              :index="props.no"
          />
        </Starport>
      </client-only>
    </div>
    <div class="prose m-auto slide-enter-content no-preference ">
      <ContentDoc path="/info"/>
    </div>
  </div>
</template>