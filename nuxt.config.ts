// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/google-fonts",
    "@nuxt/ui",
    "@nuxt/eslint",
    "@vueuse/nuxt",
  ],

  googleFonts: {
    families: {
      "Open Sans": [400, 700]
    }
  },

  compatibilityDate: "2025-02-03"
})
