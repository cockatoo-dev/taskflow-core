// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "@nuxt/ui"
  ],
  googleFonts: {
    families: {
      "Open Sans": [400, 700]
    }
  }
})
