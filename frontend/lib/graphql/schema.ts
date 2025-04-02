import gql from "graphql-tag";

export const typeDefs = gql`
   type Query {
      hello: String
      products(page: Int, limit: Int, query: String): ProductsRes!
      product(id: ID!): Product!
      categories(name: String): [Category]!
      cart: Cart!
      orders(page: Int, limit: Int): OrderRes!
   }

   type Mutation {
      addProduct(input: AddProductInput!): Product!
      editProduct(input: EditProductInput!): Product!
      addToCart(product_id: ID!, quantity: Int!): AddToCart!
      checkout: Checkout!
      addCategory(name: String!): Category!
      register(name: String!, email: String!, uid: String!): RegisterUser!
   }

   # Base types
   type Pagination {
      page: Int!
      limit: Int!
      total_data: Int!
      total_page: Int!
      next_page: Boolean!
      prev_page: Boolean!
   }

   # Product types
   type Stock {
      id: ID!
      stock: Int!
      created_at: String!
      updated_at: String!
   }

   type Category {
      id: ID!
      name: String!
      created_at: String!
      updated_at: String!
   }

   type Image {
      id: ID!
      url: String!
      name: String!
      type: Int!
      created_at: String!
      updated_at: String!
   }

   type Product {
      id: ID!
      name: String!
      description: String!
      price: Int!
      stock: Stock!
      categories: [Category!]!
      images: [Image!]!
      created_at: String!
      updated_at: String!
   }

   # Responses
   type ProductsRes {
      data: [Product]!
      pagination: Pagination
   }

   # Cart types
   type CartTotal {
      quantity: Int!
      price: Float!
   }

   type CartProduct {
      id: ID!
      name: String!
      description: String!
      price: Float!
      stock: Stock!
      created_at: String!
      updated_at: String!
   }

   type CartItem {
      product: CartProduct!
      image: Image
      total: CartTotal!
   }

   type Cart {
      cart_items: [CartItem]!
      cart_total: Int!
   }

   # Order types
   type Order {
      product: CartProduct!
      total: CartTotal!
      user_id: ID!
      ordered_at: String!
   }

   type OrderRes {
      data: [Order]!
      pagination: Pagination!
   }

   type AddToCart {
      id: ID!
      is_processed: Boolean!
      created_at: String!
      updated_at: String!
   }

   type Checkout {
      id: ID!
      quantity: Int!
      is_processed: Boolean!
      product_id: ID!
      user_id: ID!
      created_at: String!
      updated_at: String!
   }

   # User types
   type RegisterUser {
      id: ID!
      name: String!
      email: String!
      uid: String!
      admin: Admin
      created_at: String!
      updated_at: String!
   }

   type Admin {
      id: ID!
      created_at: String!
      updated_at: String!
   }

   type LoginUser {
      id: ID!
      name: String!
      email: String!
      role: String!
   }

   type LoginData {
      token: String!
      user: LoginUser!
   }

   # Input types
   input AddProductInput {
      name: String!
      description: String!
      price: Float!
      stock: Int!
      categories: [Int!]
      images: [String!]
   }

   input EditProductInput {
      id: ID!
      name: String
      description: String
      price: Int
      stock: Int
      categories: [Int!]
      images: [String!]
   }
`;
