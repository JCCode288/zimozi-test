"use client";

import { IAddCart } from "@/lib/api/interfaces/products.interfaces";
import { productStore } from "@/lib/store/products.store";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";

// Queries
export const GET_CART = gql`
   query GetCart {
      cart {
         cart_items {
            product {
               id
               name
               price
            }
            image {
               url
            }
            total {
               quantity
               price
            }
         }
         cart_total
      }
   }
`;

// Mutations
export const ADD_TO_CART = gql`
   mutation AddToCart($product_id: ID!, $quantity: Int!) {
      addToCart(product_id: $product_id, quantity: $quantity) {
         id
         is_processed
         created_at
         updated_at
      }
   }
`;

export const CHECKOUT = gql`
   mutation Checkout {
      checkout {
         id
         is_processed
      }
   }
`;

export function useCart() {
   const { cart, setCart } = productStore();

   const { data, loading, error, refetch } = useQuery(GET_CART, {
      fetchPolicy: "cache-and-network",
      notifyOnNetworkStatusChange: true,
   });

   useEffect(() => {
      if (data) {
         setCart(data.cart);
      }
   }, [data]);

   return { cart, loading, error, refetch };
}

export function useAddToCart() {
   const [fn, { loading, data, error }] = useMutation(ADD_TO_CART, {
      refetchQueries: [{ query: GET_CART }],
      onError: (error) => {
         console.error("useAddToCart mutation error:", error);
      },
   });

   const addToCart = (item: IAddCart) => fn({ variables: item });

   return { addToCart, addToCartError: error };
}

export function useCheckout() {
   return useMutation(CHECKOUT, {
      refetchQueries: [{ query: GET_CART }],
      onError: (error) => {
         console.error("useCheckout mutation error:", error);
      },
   });
}
