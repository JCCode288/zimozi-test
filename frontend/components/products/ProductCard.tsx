import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatCurrency } from "@/lib/utils/format";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "../ui/card";
import { ShoppingCart } from "lucide-react";
import { QuantityDialog } from "../quantity-dialog";
import { useState } from "react";
import { IAddCart } from "@/lib/api/interfaces/products.interfaces";
import { Button } from "../ui/button";

interface ProductCardProps {
   product: {
      id: number;
      name: string;
      description: string;
      price: number;
      images: { url: string }[];
      stock: { stock: number };
   };
   addToCart: (item: IAddCart) => any;
}

export function ProductCard({ product, addToCart }: ProductCardProps) {
   const imageUrl = product.images?.[0]?.url || "";
   const [isOpen, setOpen] = useState(false);
   const handleOpen = () => setOpen(true);
   const handleClose = () => setOpen(false);

   const handleAddCart = async (quantity: number) => {
      return addToCart({ product_id: product.id, quantity });
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>{product.name}</CardTitle>
         </CardHeader>
         <CardContent>
            <Link href={`/products/${product.id}`}>
               <div className="group rounded-lg border border-[hsl(var(--neon))]/20 overflow-hidden shadow-sm hover:shadow-[0_0_10px_rgba(var(--neon-glow),0.2)] hover:border-[hsl(var(--neon))]/40 transition-all duration-300">
                  <ProductImage
                     imageUrl={imageUrl}
                     alt={product.name}
                     className="w-full h-48"
                  />
                  <div className="p-4">
                     <p className="mt-2 font-bold text-lg text-[hsl(var(--neon))]">
                        {formatCurrency(product.price)}
                     </p>
                  </div>
               </div>
            </Link>
         </CardContent>
         <CardFooter>
            <Button
               className="w-full items-center justify-center border-primary border rounded-md flex py-3"
               onClick={handleOpen}
               disabled={product.stock.stock <= 0}
            >
               <ShoppingCart className="mr-2 h-4 w-4" />
               {product.stock.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
         </CardFooter>
         <QuantityDialog
            productName={product.name}
            maxQuantity={product.stock.stock}
            isOpen={isOpen}
            onClose={handleClose}
            onConfirm={handleAddCart}
         />
      </Card>
   );
}
