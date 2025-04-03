"use client";

// Keep the persist middleware for client-side storage, but make it safe for SSR
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ICategory } from "../api/interfaces/products.interfaces";

const clientStorage = createJSONStorage(() => localStorage);

interface IProductData {
   categories: ICategory[] | [];
}

interface IProductStore extends IProductData {
   setCategories(categories: ICategory[]);
}

export const categoryStore = create<IProductStore>()(
   persist(
      (set, get) => ({
         // Default initial state
         categories: [],

         setCategories(categories) {
            set((state) => ({ ...state, categories }));
         },
      }),
      {
         name: "category-storage", // unique name for the storage
         storage: clientStorage,
         // Optional: specify which parts of the state to persist
      }
   )
);
