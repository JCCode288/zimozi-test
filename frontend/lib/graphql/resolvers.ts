import {
   getAllProducts,
   getProductById,
   getCategories,
   getCartItems,
   addToCart,
   checkout,
   getOrderHistory,
   addNewCategory,
} from "../api/products.api";
import { addProduct, editProduct } from "../api/admin.api";
// Import the login function from auth.api
import { register } from "../api/auth.api";
import { cookies } from "next/headers";

export const resolvers = {
   Query: {
      hello: () => "world",

      products: async (_, { page = 1, limit = 10, query = "" }) => {
         try {
            const queryParams = query ? JSON.parse(query) : {};
            return await getAllProducts(queryParams, page, limit);
         } catch (error) {
            console.error("GraphQL products query error:", error);
            throw new Error(`Failed to fetch products: ${error.message}`);
         }
      },

      product: async (_, { id }) => {
         try {
            return await getProductById(Number(id));
         } catch (error) {
            console.error(
               `GraphQL product query error for ID ${id}:`,
               error
            );
            throw new Error(`Failed to fetch product: ${error.message}`);
         }
      },

      categories: async (_, { page = 1, limit = 10, name = "" }) => {
         try {
            return await getCategories(name, page, limit);
         } catch (error) {
            console.error("GraphQL categories query error:", error);
            throw new Error(
               `Failed to fetch categories: ${error.message}`
            );
         }
      },

      cart: async (_, __, context) => {
         try {
            const result = await getCartItems(context.token);
            return result;
         } catch (error) {
            console.error("GraphQL cart query error:", error);
            // Return an empty cart instead of throwing an error
            return {
               cart_items: [],
               cart_total: 0,
            };
         }
      },

      orders: async (_, { page = 1, limit = 10 }, context) => {
         try {
            return await getOrderHistory(context.token, page, limit);
         } catch (error) {
            console.error("GraphQL orders query error:", error);
            throw new Error(`Failed to fetch orders: ${error.message}`);
         }
      },
   },

   Mutation: {
      addProduct: async (_, { input }, context) => {
         try {
            return await addProduct(input, context.token);
         } catch (error) {
            console.error("GraphQL addProduct mutation error:", error);
            throw new Error(`Failed to add product: ${error.message}`);
         }
      },

      editProduct: async (_, { input }, context) => {
         try {
            const { id, name, description, price, stock, categories } =
               input;
            return await editProduct(
               {
                  id: Number(id),
                  name,
                  description,
                  price,
                  stock,
                  categories: categories
                     ? categories.map(Number)
                     : undefined,
                  images: [], // Note: File uploads require special handling in GraphQL
               },
               context.token
            );
         } catch (error) {
            console.error("GraphQL editProduct mutation error:", error);
            throw new Error(`Failed to edit product: ${error.message}`);
         }
      },

      addToCart: async (_, { product_id, quantity }, context) => {
         try {
            console.log("[Add Cart]", product_id, quantity);
            // Call the API function
            const result = await addToCart(
               {
                  product_id,
                  quantity,
               },
               context.token
            );

            console.log("GraphQL addToCart result:", result);

            // Ensure the response has all required fields for GraphQL

            return result;
         } catch (error) {
            console.error("GraphQL addToCart mutation error:", error);
            throw new Error(`Failed to add to cart: ${error.message}`);
         }
      },

      checkout: async (_, __, context) => {
         try {
            // Log the token to verify it's being passed correctly
            console.log(
               "Checkout mutation context token:",
               context.token ? "Present" : "Missing"
            );

            return await checkout(context.token);
         } catch (error) {
            console.error("GraphQL checkout mutation error:", error);
            throw new Error(`Failed to checkout: ${error.message}`);
         }
      },

      addCategory: async (_, { name }, context) => {
         try {
            return await addNewCategory({ name }, context.token);
         } catch (error) {
            console.error("GraphQL addCategory mutation error:", error);
            throw new Error(`Failed to add category: ${error.message}`);
         }
      },

      register: async (_, { name, uid, email }, context) => {
         try {
            const cookie = await cookies();
            cookie.set("token", context.token);
            return await register({ name, uid, email });
         } catch (error) {
            console.error("GraphQL register mutation error:", error);
            throw new Error(`Failed to register: ${error.message}`);
         }
      },
   },
};
