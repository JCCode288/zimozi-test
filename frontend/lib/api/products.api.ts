import { AxiosResponse } from "axios";
import Axios from "./axios";
import { ProductURL } from "./be.constant";
import type {
   IAddCart,
   IAddCategory,
   ICart,
   ICartData,
   ICategory,
   ICheckout,
   IOrder,
   IProduct,
} from "./interfaces/products.interfaces";
import type { ApiResponse } from "./interfaces/response.interfaces";

export async function getAllProducts(
   query: Record<string, string> = {},
   page = 1,
   limit = 5
): Promise<ApiResponse<IProduct[]>> {
   const queryParams = new URLSearchParams({
      page: page + "",
      limit: limit + "",
      ...query,
   });

   // Ensure proper URL construction with question mark
   const url = `${ProductURL.PRODUCT}?${queryParams.toString()}`;

   console.log("Fetching products from URL:", url);

   try {
      const { data } = await Axios.get<ApiResponse<IProduct[]>>(url);
      return data;
   } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
   }
}

export async function getProductById(id: number): Promise<IProduct> {
   const url = `${ProductURL.PRODUCT}/${id}`;

   try {
      const { data } = await Axios.get<ApiResponse<IProduct>>(url);
      return data.data;
   } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
   }
}

export async function getCartItems(token: string): Promise<ICart> {
   const url = ProductURL.CART;

   try {
      const { data } = await Axios.get<ApiResponse<ICart>>(url, {
         headers: { Authorization: token },
      });

      // Validate the cart data structure

      return data.data;
   } catch (error) {
      console.error("Error fetching cart items:", error);

      // Return an empty cart instead of throwing
      return {
         cart_items: [],
         cart_total: 0,
      };
   }
}

export async function addToCart(
   payload: IAddCart,
   token: string
): Promise<ICartData> {
   const url = ProductURL.CART;

   try {
      console.log("Adding to cart with payload:", payload);

      // Ensure quantity is a positive integer

      const { data } = await Axios.post<
         IAddCart,
         AxiosResponse<ApiResponse<ICartData>>
      >(url, payload, {
         headers: { Authorization: token },
      });
      console.log("Add to cart response:", data);

      return data.data;
   } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
   }
}

export async function checkout(token: string): Promise<ICheckout> {
   const url = ProductURL.CHECKOUT;
   const conf = {
      headers: { Authorization: token },
   };

   console.log("[Token]", conf);

   try {
      const { data } = await Axios.post<ApiResponse<ICheckout>>(
         url,
         null,
         conf
      );
      return data.data;
   } catch (error) {
      console.error("Error during checkout:", error);
      throw error;
   }
}

export async function getOrderHistory(
   token: string,
   page = 1,
   limit = 10
): Promise<IOrder[]> {
   const query = new URLSearchParams({
      page: page + "",
      limit: limit + "",
   });

   // Ensure proper URL construction with question mark
   const url = `${ProductURL.ORDERS}?${query.toString()}`;

   try {
      const { data } = await Axios.get<ApiResponse<IOrder[]>>(url, {
         headers: { Authorization: token },
      });
      return data.data;
   } catch (error) {
      console.error("Error fetching order history:", error);
      throw error;
   }
}

export async function getCategories(
   name?: string,
   page = 1,
   limit = 10
): Promise<ICategory[]> {
   const queryParams = new URLSearchParams({
      page: page + "",
      limit: limit + "",
   });

   if (name) queryParams.append("name", name);

   // Ensure proper URL construction with question mark
   const url = `${ProductURL.CATEGORIES}?${queryParams.toString()}`;

   try {
      const { data } = await Axios.get<ApiResponse<ICategory[]>>(url);
      return data.data;
   } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
   }
}

export async function addNewCategory(
   category: IAddCategory,
   token: string
): Promise<ICategory> {
   const url = ProductURL.CATEGORIES;

   try {
      const { data } = await Axios.post<ApiResponse<ICategory>>(
         url,
         category,
         {
            headers: { Authorization: token },
         }
      );
      return data.data;
   } catch (error) {
      console.error("Error adding new category:", error);
      throw error;
   }
}
