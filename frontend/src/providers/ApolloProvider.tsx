"use client";
import { ApolloProvider } from "@apollo/client";

export default function ApolloWrapper({
   children,
}: React.PropsWithChildren) {
   //  return <ApolloProvider>{children}</ApolloProvider>;
   return <>{children}</>;
}
