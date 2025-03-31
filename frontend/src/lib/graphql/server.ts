import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import gql from "graphql-tag";

const resolvers = {
   Query: {
      hello: () => "world",
   },
};

const typeDefs = gql`
   type Query {
      hello: String
   }

   type Product {
    id: ID!
    name: String!
    description: String!
    price: Int!
    categories
   }

   type Category {
    
   }
`;

const server = new ApolloServer({
   resolvers,
   typeDefs,
});

export default startServerAndCreateNextHandler(server);
