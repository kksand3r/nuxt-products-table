// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Список Продуктів",
    },
  },

  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ["~/assets/css/styles.css"],
  modules: ["@nuxt/ui", "@vueuse/nuxt"],
})
