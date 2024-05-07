<script setup lang="ts">
import {StarportCarrier} from "vue-starport";
</script>

<template>
    <div>
      <Backdrop />
      <NavBar />
      <main class="px-7 py-10">
<!--      <main class="">-->
          <slot />
      </main>
    </div>
</template>

<style scoped>

</style>