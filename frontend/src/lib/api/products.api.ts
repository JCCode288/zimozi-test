import Axios from "./axios";
import { ProductURL } from "./be.constant";
import {
   IAddCart,
   IAddCategory,
   ICart,
   ICartData,
   ICategory,
   ICheckout,
   IOrder,
   IProduct,
} from "./interfaces/products.interfaces";
import { ApiResponse } from "./interfaces/response.interfaces";

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

   const url = ProductURL.PRODUCT + "?" + queryParams.toString();

   const { data } = await Axios.get<ApiResponse<IProduct[]>>(url);

   return data;
}

export async function getProductById(
   id: number
): Promise<ApiResponse<IProduct>> {
   const url = `${ProductURL.PRODUCT}/${id}`;

   const { data } = await Axios.get<ApiResponse<IProduct>>(url);

   return data;
}

export async function getCartItems(): Promise<ApiResponse<ICart>> {
   const url = ProductURL.CART;

   const { data } = await Axios.get<ApiResponse<ICart>>(url);

   return data;
}

export async function addToCart(
   payload: IAddCart
): Promise<ApiResponse<ICartData>> {
   const url = ProductURL.CART;

   const { data } = await Axios.post<ApiResponse<ICartData>>(url, payload);

   return data;
}

export async function checkout(): Promise<ApiResponse<ICheckout>> {
   const url = ProductURL.CHECKOUT;

   const { data } = await Axios.post<ApiResponse<ICheckout>>(url);

   return data;
}

export async function getOrderHistory(
   page = 1,
   limit = 10
): Promise<ApiResponse<IOrder[]>> {
   const query = new URLSearchParams({
      page: page + "",
      limit: limit + "",
   });

   const url = ProductURL.ORDERS + "?" + query.toString();

   const { data } = await Axios.get<ApiResponse<IOrder[]>>(url);

   return data;
}
export async function getCategories(
   query?: Record<string, string>,
   page = 1,
   limit = 10
): Promise<ApiResponse<ICategory[]>> {
   const queryParams = new URLSearchParams({
      page: page + "",
      limit: limit + "",
      ...query,
   });

   const url = ProductURL.CATEGORIES + "?" + queryParams.toString();

   const { data } = await Axios.get<ApiResponse<ICategory[]>>(url);

   return data;
}
export async function addNewCategory(
   category: IAddCategory
): Promise<ApiResponse<ICategory>> {
   const url = ProductURL.CATEGORIES;

   const { data } = await Axios.post<ApiResponse<ICategory>>(
      url,
      category
   );

   return data;
}
