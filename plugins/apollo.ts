import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import { useRuntimeConfig } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const httpLink = new HttpLink({
    uri: config.public.APOLLO_HTTP, // Uses your runtime config value
    credentials: "include",
  });

  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  // Provide Apollo Client instance to your Nuxt app
  nuxtApp.provide("apollo", apolloClient);
});
