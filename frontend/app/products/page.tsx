"use client";
import { ProductCard } from "@/components/products/ProductCard";
import { IProduct } from "@/lib/api/interfaces/products.interfaces";
import { filterStore } from "@/lib/store/filter.store";
import { useAddToCart } from "@/lib/graphql/queries/cart.query";
import { useProducts } from "@/lib/graphql/queries/products.query";

export default function Page() {
   const {
      page,
      limit,
      setPage,
      setLimit,
      next_page,
      prev_page,
      setSearch,
      total_page,
   } = filterStore();

   const { loading, products, error } = useProducts();
   const { addToCart, addToCartError } = useAddToCart();

   if (error) return <>Error Happened</>;

   if (loading || !products) return <>Loading</>;

   const handlePrev = () => {
      if (!prev_page) return;

      setPage(page - 1);
   };
   const handleNext = () => {
      if (!next_page) return;
      setPage(page + 1);
   };
   const handleLimit = (e) => {
      const limit = e.target?.value;
      setLimit(limit);
   };

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-6">Products</h1>

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: IProduct) => (
               <ProductCard
                  addToCart={addToCart}
                  key={product.id}
                  product={product}
               />
            ))}
         </div>

         {/* Pagination */}
         <div className="mt-8 flex justify-center gap-2">
            <button
               onClick={handlePrev}
               disabled={!prev_page}
               className="px-4 py-2 border rounded disabled:opacity-50"
            >
               Previous
            </button>
            <span className="px-4 py-2">
               Page {page} of {total_page}
            </span>
            <button
               onClick={handleNext}
               disabled={!next_page}
               className="px-4 py-2 border rounded disabled:opacity-50"
            >
               Next
            </button>
         </div>
      </div>
   );
}
