export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxt/content",
    '@nuxtjs/mdc',
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/prose.css',
    '~/assets/css/markdown.css',
  ],
  content: {
    // documentDriven: {
    //   layoutFallbacks: ['posts'],
    // },
    highlight: {
      theme: {
        // Default theme (same as single string)
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai'
      }
    },
    markdown: {
      toc: {
        depth: 3,
        searchDepth: 3
      }
    },
    components: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  }
})