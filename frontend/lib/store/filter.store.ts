import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
   PaginationLimit,
   PaginationResponse,
} from "../api/interfaces/response.interfaces";

export interface IFilterData {
   loading: boolean;
   page: number;
   next_page: boolean;
   prev_page: boolean;
   total_page: number;
   limit: PaginationLimit;
   search?: string;
}

export interface IFilterStore extends IFilterData {
   setPagination(pagination: PaginationResponse);
   setLoading(loading: boolean): void;
   setPage(page: number): void;
   setLimit(limit: number): void;
   setSearch(search: string): void;
}

const initialState: IFilterData = {
   loading: false,
   next_page: false,
   prev_page: false,
   page: 1,
   total_page: 0,
   limit: PaginationLimit.LOW,
   search: "",
};

const clientStorage = createJSONStorage(() => localStorage);

export const filterStore = create<IFilterStore>()(
   persist(
      (set, get) => ({
         ...initialState,

         setLoading(loading) {
            set((state) => ({ ...state, loading }));
         },
         setPagination(pagination) {
            set((state) => ({ ...state, ...pagination }));
         },
         setLimit(limit) {
            set((state) => ({ ...state, limit }));
         },
         setPage(page) {
            set((state) => ({ ...state, page }));
         },
         setSearch(search) {
            set((state) => ({ ...state, search }));
         },
      }),
      { storage: clientStorage, name: "filter-store" }
   )
);
