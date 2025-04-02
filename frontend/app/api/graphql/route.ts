import { ApolloServer } from "@apollo/server"
import { startServerAndCreateNextHandler } from "@as-integrations/next"
import { typeDefs } from "@/lib/graphql/schema"
import { resolvers } from "@/lib/graphql/resolvers"

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Create handler for Next.js API route
const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    // Get the authorization header
    const token = req.headers.get("authorization") || ""

    return {
      token,
      req,
    }
  },
})

// Export the handler as GET and POST methods
export { handler as GET, handler as POST }

