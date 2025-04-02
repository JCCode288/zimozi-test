"use client";

import type React from "react";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/graphql/client";

export default function GraphQLProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
