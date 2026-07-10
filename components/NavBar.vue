<script setup lang="ts">
const route = useRoute()

const mobileMenuOpen = ref(false)

function toggleMobile() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const navLinks = [
  { path: '/', title: '首页', icon: 'i-mdi-home' },
  { path: '/posts', title: '文章', icon: 'i-mdi-file-document' },
  { path: '/projects', title: 'Demo', icon: 'i-mdi-folder-cog' },
  { path: '/info', title: '关于', icon: 'i-mdi-information' },
  { path: '/message', title: '留言', icon: 'i-mdi-message-text' },
]

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="header z-40">
    <nav class="nav">
      <div class="nav-inner">
        <div class="spacer" />
        <div class="right">
          <RouterLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            :title="link.title"
            class="flex nav-link"
            :class="{ active: isActive(link.path) }"
          >
            <span class="lt-md:hidden">{{ link.title }}</span>
            <div :class="link.icon" class="lt-md:hidden text-size-xl" />
          </RouterLink>
          <a href="https://gitee.com/plv-coding" target="_blank" title="Gitee" class="lt-md:hidden flex nav-link">
            <div class="i-mdi-gitlab text-size-xl" />
          </a>
          <a href="https://github.com/plvLY" target="_blank" title="GitHub" class="lt-md:hidden flex nav-link">
            <div class="i-mdi-github text-size-xl" />
          </a>
          <ToggleTheme />
          <button
            class="md:hidden lt-md:flex nav-link text-size-xl"
            title="Menu"
            @click="toggleMobile()"
          >
            <div :class="mobileMenuOpen ? 'i-mdi-close' : 'i-mdi-menu'" class="text-size-xl" />
          </button>
        </div>
      </div>
    </nav>

    <div v-if="mobileMenuOpen" class="mobile-menu">
      <RouterLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="mobile-menu-link"
        :class="{ active: isActive(link.path) }"
        @click="mobileMenuOpen = false"
      >
        <div :class="link.icon" class="text-size-lg" />
        {{ link.title }}
      </RouterLink>
      <div class="mobile-menu-social">
        <a href="https://gitee.com/plv-coding" target="_blank" title="Gitee" class="mobile-menu-link">
          <div class="i-mdi-gitlab text-size-lg" />
          Gitee
        </a>
        <a href="https://github.com/plvLY" target="_blank" title="GitHub" class="mobile-menu-link">
          <div class="i-mdi-github text-size-lg" />
          GitHub
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: relative;
}

.nav {
  width: 100%;
  box-sizing: border-box;
}

.nav-inner {
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
}

.nav-inner .spacer {
  flex: 1;
}

.nav .right {
  display: flex;
  gap: 0.875rem;
  align-items: center;
}

.nav-link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;
  opacity: 0.5;
  outline: none;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0;
  font-size: 0.9375rem;
  background: none;
  border: none;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-link.active {
  opacity: 1;
}

.mobile-menu {
  position: fixed;
  inset: 0;
  top: 4rem;
  z-index: 99;
  background: var(--c-bg);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 0.25rem;
}

.mobile-menu-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: inherit;
  font-size: 1rem;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.mobile-menu-link:hover,
.mobile-menu-link.active {
  opacity: 1;
  background: var(--c-surface-hover);
}

.mobile-menu-social {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}
</style>
