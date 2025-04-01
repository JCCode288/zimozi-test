const BASE_URL = process.env.BE_URL;

export class AuthURL {
   static BASE_PATH = `${BASE_URL}/auth` as const;
   static REGISTER = `${this.BASE_PATH}/v1/register` as const;
}

export class ProductURL {
   static BASE_PATH = `${BASE_URL}/product` as const;
   static PRODUCT = `${this.BASE_PATH}/v1/products` as const;
   static CART = `${this.BASE_PATH}/v1/cart` as const;
   static CHECKOUT = `${this.BASE_PATH}/v1/checkout` as const;
   static ORDERS = `${this.BASE_PATH}/v1/orders` as const;
   static CATEGORIES = `${this.BASE_PATH}/v1/categories` as const;
   static ADMIN_PRODUCTS = `${this.BASE_PATH}/v1/admin/products` as const;
   static IMAGE = `${this.BASE_PATH}/v1/image` as const;
}
