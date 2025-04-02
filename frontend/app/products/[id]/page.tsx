"use client";

import { useQuery } from "@apollo/client";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import {
   GET_PRODUCT,
   useProduct,
} from "@/lib/graphql/queries/products.query";
import { productStore } from "@/lib/store/products.store";
import { useEffect, useState } from "react";

export default function ProductPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const [id, setId] = useState<string>();

   useEffect(() => {
      params.then(({ id }) => setId(id));
   }, [params]);

   const { loading, detail, error } = useProduct(id);

   if (loading || !detail) return <>Loading</>;

   return (
      <div className="container mx-auto p-4">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
               {detail.images && detail.images.length > 0 ? (
                  <ProductImage
                     imageUrl={detail.images[0].url}
                     alt={detail.name}
                     width={600}
                     height={600}
                     className="w-full h-auto rounded-lg"
                  />
               ) : (
                  <div className="bg-gray-200 w-full h-96 rounded-lg flex items-center justify-center">
                     No image available
                  </div>
               )}
            </div>

            <div>
               <h1 className="text-3xl font-bold mb-2">{detail.name}</h1>
               <p className="text-2xl font-bold text-blue-600 mb-4">
                  {formatCurrency(detail.price)}
               </p>

               <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">
                     Description
                  </h2>
                  <p className="text-gray-700">{detail.description}</p>
               </div>

               <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Stock</h2>
                  <p className="text-gray-700">
                     {detail.stock?.stock || 0} units available
                  </p>
               </div>

               {detail.categories && detail.categories.length > 0 && (
                  <div className="mb-6">
                     <h2 className="text-xl font-semibold mb-2">
                        Categories
                     </h2>
                     <div className="flex flex-wrap gap-2">
                        {detail.categories.map((category) => (
                           <span
                              key={category.id}
                              className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                           >
                              {category.name}
                           </span>
                        ))}
                     </div>
                  </div>
               )}

               <div className="mt-8 text-sm text-gray-500">
                  <p>Added: {detail.created_at.toString()}</p>
                  <p>Last updated: {detail.updated_at.toString()}</p>
               </div>
            </div>
         </div>
      </div>
   );
}
