export interface IBase {
   created_at: Date;
   updated_at: Date;
}

export interface IStock extends IBase {
   id: number;
   stock: number;
}

export interface ICategory extends IBase {
   id: number;
   name: string;
}

export type IAddCategory = Pick<ICategory, "name">;

export interface IImage extends IBase {
   id: number;
   url: string;
   name: string;
   type: number;
}

export interface IProduct extends IBase {
   id: number;
   name: string;
   description: string;
   price: number;
   stock: IStock;
   categories: ICategory[];
   images: IImage[];
}

export interface IAddProduct
   extends Omit<
      IProduct,
      "categories" | "images" | "stock" | "created_at" | "updated_at"
   > {
   categories?: number[];
   images?: File[];
   stock: number;
}

export type IProductRes = Pick<IProduct, "id" | "name">;

export type IEditProduct = Partial<IAddProduct> & { id: number };

export interface ICartTotal {
   quantity: number;
   price: number;
}

export type ICartProduct = Omit<IProduct, "images" | "categories">;

export interface ICartItem {
   product: ICartProduct;
   image: IImage;
   total: ICartTotal;
}

export interface ICart {
   cart_items: ICartItem[];
   cart_total: number;
}

export interface ICheckout extends IBase {
   id: number;
   quantity: number;
   is_processed: boolean;
   product_id: number;
   user_id: number;
}

export type IAddCart = Pick<ICheckout, "product_id" | "quantity">;

export type ICartData = Omit<
   ICheckout,
   "product_id" | "user_id" | "quantity"
>;

export interface IOrder {
   product: ICartProduct;
   total: ICartTotal;
   user_id: number;
   ordered_at: Date;
}
