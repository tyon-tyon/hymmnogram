// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@vite-pwa/nuxt",'@zadigetvoltaire/nuxt-gtm',],
  css: [
    '~/public/styles/main.css',
  ],
  app: {
    head: {
      htmlAttrs: {
        lang: 'ja'
      },
      charset: 'utf-16',
      viewport: 'width=device-width,initial-scale=1.0,maximum-scale=1.0',
      title: 'HYMMNOGRAM',
      meta: [
        { name: "theme-color", content: "#11B981" },
        { name: 'description', content: 'HYMMNOGRAM(ヒュムノグラム)は、トリフィラのデータを使用した非公式ヒュムノス辞書サイトです。' },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap",
          crossorigin: "",
        },
        { rel: 'icon', href: `/favicon.ico`, sizes: "16x16" },
        { rel: 'apple-touch-icon', href: `/apple-touch-icon-180x180.png` }
      ],
    }
  },
  gtm: {
    id: 'GTM-MXQQRHGG',
  },
  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "非公式ヒュムノス語辞書 HYMMNOGRAM(ヒュムノグラム)",
      description: "HYMMNOGRAM(ヒュムノグラム)は、トリフィラのデータを使用した非公式ヒュムノス辞書サイトです。",
      theme_color: "#ffffff",
      lang: "ja",
      short_name: "HYMMNOGRAM",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      icons: [
        {
          "src": "pwa-64x64.png",
          "sizes": "64x64",
          "type": "image/png"
        },
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        },
        {
          "src": "maskable-icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
    },
    workbox: {
      navigateFallback: null
    },
  }
});