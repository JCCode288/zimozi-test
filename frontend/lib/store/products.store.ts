"use client";

// Keep the persist middleware for client-side storage, but make it safe for SSR
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
   IAddProduct,
   ICart,
   IOrder,
   IProduct,
} from "../api/interfaces/products.interfaces";

const clientStorage = createJSONStorage(() => localStorage);

interface IProductData {
   products: IProduct[] | null;
   detail: IProduct | null;
   cart: ICart | null;
   histories: IOrder[] | null;
   form: IAddProduct | {};
}

interface IProductStore extends IProductData {
   setProducts(products: IProduct[]);
   setDetail(product: IProduct);
   setCart(cart: ICart);
   setHistories(orders: IOrder[]);
   setForm(form: IAddProduct);
}

export const productStore = create<IProductStore>()(
   persist(
      (set, get) => ({
         // Default initial state
         products: null,
         detail: null,
         cart: null,
         histories: null,
         form: {},

         setProducts(products) {
            set((state) => ({ ...state, products }));
         },
         setDetail(product) {
            set((state) => ({ ...state, detail: product }));
         },
         setCart(cart) {
            set((state) => ({ ...state, cart }));
         },
         setForm(form) {
            set((state) => ({ ...state, form }));
         },
         setHistories(orders) {
            set((state) => ({ ...state, histories: orders }));
         },
      }),
      {
         name: "products-storage", // unique name for the storage
         storage: clientStorage,
      }
   )
);
