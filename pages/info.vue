<script setup lang="ts">
import {Starport} from "vue-starport";

const props = defineProps({
  no: { type: Number, default: 0 }
})

const size = 200
</script>

<template>
  <div class="max-w-180 mx-auto px-6 md:px-10 py-10 slide-enter-content">
    <div class="flex flex-col items-center mb-8">
      <client-only>
        <Starport
            :port="String(props.no)"
            class="w-32 h-32 transition-all duration-800"
        >
          <Logo
              class="rounded-full shadow-sm"
              :index="props.no"
          />
        </Starport>
      </client-only>
    </div>
    <div class="prose m-auto no-preference">
      <ContentDoc path="/info"/>
    </div>
  </div>
</template>
