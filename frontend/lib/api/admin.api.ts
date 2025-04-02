"use server";

import Axios from "./axios";
import { ProductURL } from "./be.constant";
import type {
   IAddProduct,
   IEditProduct,
   IProductRes,
} from "./interfaces/products.interfaces";
import type { ApiResponse } from "./interfaces/response.interfaces";

export async function addProduct(
   //  { name, description, price, stock, categories, images }: IAddProduct,
   form: IAddProduct,
   token: string
): Promise<IProductRes> {
   const url = ProductURL.ADMIN_PRODUCTS;

   //  const form = new FormData();
   //  form.append("name", name);
   //  form.append("description", description);
   //  form.append("price", price + "");
   //  form.append("stock", stock + "");

   //  if (categories && categories.length) {
   //     for (const c of categories) {
   //        form.append("categories", c + "");
   //     }
   //  }

   //  if (images && images.length) {
   //     for (const f of images) {
   //        form.append("images", f);
   //     }
   //  }

   const { data } = await Axios.post<ApiResponse<IProductRes>>(url, form, {
      headers: { Authorization: token },
   });

   return data.data;
}

export async function editProduct(
   //  {
   //     id,
   //     name,
   //     description,
   //     price,
   //     stock,
   //     categories,
   //     images,
   //  }: IEditProduct,
   form: IEditProduct,
   token: string
): Promise<IProductRes> {
   const url = ProductURL.ADMIN_PRODUCTS;

   //  const form = new FormData();
   //  form.append("id", id + "");
   //  if (name) form.append("name", name);
   //  if (description) form.append("description", description);
   //  if (price) form.append("price", price + "");
   //  if (stock) form.append("stock", stock + "");

   //  if (categories && categories.length) {
   //     for (const c of categories) {
   //        form.append("categories", c + "");
   //     }
   //  }

   //  if (images && images.length) {
   //     for (const f of images) {
   //        form.append("images", f);
   //     }
   //  }

   const { data } = await Axios.post<ApiResponse<IProductRes>>(url, form, {
      headers: { Authorization: token },
   });

   return data.data;
}
