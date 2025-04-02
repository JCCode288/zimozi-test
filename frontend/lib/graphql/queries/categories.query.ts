"use client";

import { gql, useQuery, useMutation } from "@apollo/client";
import { filterStore } from "@/lib/store/filter.store";
import { categoryStore } from "@/lib/store/categories.store";
import { useEffect } from "react";

// Queries
export const GET_CATEGORIES = gql`
   query GetCategories($name: String) {
      categories(name: $name) {
         id
         name
      }
   }
`;

// Mutations
export const ADD_CATEGORY = gql`
   mutation AddCategory($name: String!) {
      addCategory(name: $name) {
         id
         name
      }
   }
`;

export function useCategories() {
   const { page, limit } = filterStore();
   const { categories, setCategories } = categoryStore();

   const { data, loading, error } = useQuery(GET_CATEGORIES, {
      variables: { page, limit },
   });

   useEffect(() => {
      if (data) {
         setCategories(data.categories);
      }
   }, [data]);

   return { loading, categories, error };
}

export function useAddCategory() {
   return useMutation(ADD_CATEGORY, {
      refetchQueries: [{ query: GET_CATEGORIES }],
   });
}
