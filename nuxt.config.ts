import Icons from 'unplugin-icons/vite'

export default defineNuxtConfig({
  devtools: { enabled: true, componentInspector: false },
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

  mdc: {
    highlight: {
      langs: [
        'dockerfile', 'java',
        'js', 'ts', 'typescript', 'json', 'bash', 'yaml',
        'css', 'html', 'vue', 'md','sql','http','mermaid','cmd','bat'
      ],
    },
  },

  content: {
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
        searchDepth: 4
      }
    },
    components: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
    transformers: [
      '~/transformers/reading-time',
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

  nitro: {
    node: true,
  },

  compatibilityDate: '2026-07-10'
})