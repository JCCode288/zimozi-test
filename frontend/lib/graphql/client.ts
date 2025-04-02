"use client";

import {
   ApolloClient,
   InMemoryCache,
   createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { loginStore } from "../store/login.store";

// Create an http link that points to the local API route
const httpLink = createHttpLink({
   uri: "/api/graphql",
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
   if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
         console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
         );
      });
   }
   if (networkError) {
      console.error(`[Network error]: ${networkError}`);
   }
});

// Auth link for adding the token to requests
const authLink = setContext(async (_, { headers }) => {
   // Get the token from the store

   // Check if we're in a browser environment before accessing localStorage
   // Use the persisted store to get the token
   const token = await loginStore.getState().user?.getIdToken();

   return {
      headers: {
         ...headers,
         authorization: token ? `Bearer ${token}` : "",
      },
   };
});

// Create the Apollo Client
export const client = new ApolloClient({
   link: authLink.concat(httpLink).concat(errorLink), // Make sure to use the link chain
   cache: new InMemoryCache(),
   defaultOptions: {
      watchQuery: {
         fetchPolicy: "cache-and-network",
         errorPolicy: "all",
      },
      query: {
         fetchPolicy: "cache-first",
         errorPolicy: "all",
      },
   },
});
