"use client";
import client from "@/lib/graphql/client";
import { ApolloProvider } from "@apollo/client";

export default function ApolloWrapper({
   children,
}: React.PropsWithChildren) {
   return <ApolloProvider client={client}>{children}</ApolloProvider>;
   // return <>{children}</>;
}
