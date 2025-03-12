
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },  
  runtimeConfig: {
    public: {
      APOLLO_HTTP:  "http://localhost:4000/graphql"
    },
  },
})
