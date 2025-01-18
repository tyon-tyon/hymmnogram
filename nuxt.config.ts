// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  modules: ["@nuxt/ui",  '@zadigetvoltaire/nuxt-gtm',],
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
    id: process.env.GTM_ID ?? "",
  },
});