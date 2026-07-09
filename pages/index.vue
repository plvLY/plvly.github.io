<script setup lang="ts">
import {Starport} from "vue-starport";
</script>

<template>
  <div class="px6 py-2 items-center ">
    <div id="gallery" class="flex" >
      <div class="w-20 h-20">
        <RouterLink to="/info">
          <client-only>
            <Starport
                port="0"
                class="aspect-1/1 transition-all duration-800 w-20 h-20"
            >
              <Logo
                  class="rounded"
                  :index="0"
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