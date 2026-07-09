<script setup lang="ts">
import {Starport} from "vue-starport";
</script>

<template>
  <div class="max-w-180 mx-auto px-6 md:px-10 py-10 slide-enter-content">
    <div class="flex flex-col items-center mb-10">
      <div class="w-20 h-20 mb-4">
        <RouterLink to="/info">
          <client-only>
            <Starport
                port="0"
                class="aspect-1/1 transition-all duration-800 w-20 h-20"
            >
              <Logo
                  class="rounded-2xl shadow-sm"
                  :index="0"
              />
            </Starport>
          </client-only>
        </RouterLink>
      </div>
      <h1 class="text-2xl font-semibold m-0">PLV</h1>
      <p class="text-sm text-[var(--c-text-tertiary)] mt-1.5">个人博客 / 技术笔记</p>
    </div>

    <div class="prose m-auto no-preference">
      <ContentDoc path="/"/>
    </div>
  </div>
</template>
