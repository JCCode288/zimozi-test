"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { productStore } from "../../store/products.store";
import { useEffect } from "react";
import { filterStore } from "../../store/filter.store";

// Queries
export const GET_PRODUCTS = gql`
   query GetProducts($page: Int, $limit: Int, $query: String) {
      products(page: $page, limit: $limit, query: $query) {
         data {
            id
            name
            description
            price
            stock {
               stock
            }
            images {
               url
            }
            categories {
               id
               name
            }
         }
         pagination {
            page
            limit
            total_data
            total_page
            next_page
            prev_page
         }
      }
   }
`;

export const GET_PRODUCT = gql`
   query GetProduct($id: ID!) {
      product(id: $id) {
         id
         name
         description
         price
         stock {
            stock
         }
         images {
            url
            name
         }
         categories {
            id
            name
         }
         created_at
         updated_at
      }
   }
`;

// Mutations
export const ADD_PRODUCT = gql`
   mutation AddProduct($input: AddProductInput!) {
      addProduct(input: $input) {
         id
         name
      }
   }
`;

export const EDIT_PRODUCT = gql`
   mutation EditProduct($input: EditProductInput!) {
      editProduct(input: $input) {
         id
         name
      }
   }
`;

export function useProducts() {
   const { page, limit, search, setPagination } = filterStore();

   const { products, setProducts } = productStore();
   const { loading, data, error, refetch } = useQuery(GET_PRODUCTS, {
      variables: { page, limit, query: search },
   });

   useEffect(() => {
      if (data) {
         const {
            products: { data: productsData, pagination },
         } = data;

         setProducts(productsData);
         setPagination(pagination);
      }
   }, [data]);

   return { loading, products, error, refetch };
}

export function useProduct(id?: string) {
   const { detail, setDetail } = productStore();

   const { loading, data, error } = useQuery(GET_PRODUCT, {
      variables: { id },
   });

   useEffect(() => {
      if (data) {
         const { product } = data;

         setDetail(product);
      }
   }, [data]);

   return { loading, detail, error };
}

export function useAddProduct() {
   return useMutation(ADD_PRODUCT, {
      refetchQueries: [{ query: GET_PRODUCTS }],
   });
}

export function useEditProduct() {
   return useMutation(EDIT_PRODUCT, {
      refetchQueries: [{ query: GET_PRODUCTS }],
   });
}
