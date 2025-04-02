import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";
import { cookies } from "next/headers";

const server = new ApolloServer({
   resolvers,
   typeDefs,
});

export default startServerAndCreateNextHandler(server, {
   context: async (req) => {
      // Pass the authorization header from the request to the resolvers
      const token = req.headers.authorization || "";
      console.log("[Context] token: ", token);
      const cookie = await cookies();
      cookie.set("token", token);

      return {
         token,
         req,
      };
   },
});
