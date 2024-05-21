import Icons from 'unplugin-icons/vite'
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
  },
  vite: {
    plugins: [
      Icons({
        // the feature below is experimental ⬇️
        autoInstall: true
      })
    ]
  },
  app: {
    head: {
      script: [
        {
          src: 'https://hm.baidu.com/hm.js?4a47a6a60103f0fdc4fe28035cef97c0',
        }
      ]
    }
  },
  nitro: {
    experimental: {
      database: true
    },
    database: {
      default: {
        connector: 'sqlite',
        options: {
          name: 'db',
          path: `${__dirname}/`,
        },
      },
    }
  }
})