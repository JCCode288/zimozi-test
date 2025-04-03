"use client";

import React from "react";

import { useProducts } from "@/lib/graphql/queries/products.query";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   Pagination,
   PaginationContent,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductImage } from "@/components/ui/ProductImage";
import { formatCurrency } from "@/lib/utils/format";
import { Loader2, Plus, Search, Edit, AlertCircle } from "lucide-react";
import { IProduct } from "@/lib/api/interfaces/products.interfaces";
import { filterStore } from "@/lib/store/filter.store";

export default function AdminProductsPage() {
   const { toast } = useToast();
   const {
      page,
      limit,
      setPage,
      setLimit,
      search,
      setSearch,
      prev_page,
      next_page,
      total_page,
   } = filterStore();

   // Use a higher limit for admin view
   const { loading, error, products, refetch } = useProducts();

   const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         setPage(1);
         await refetch({
            page,
            limit,
            query: search ? JSON.stringify({ name: search }) : "",
         });
      } catch (err) {
         console.error("Search error:", err);
         toast({
            title: "Search failed",
            description: "Failed to search products?. Please try again.",
            variant: "destructive",
         });
      }
   };

   return (
      <>
         <div className="container py-8">
            <Card>
               <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                     <div>
                        <CardTitle className="text-2xl">
                           Manage Products
                        </CardTitle>
                        <CardDescription>
                           View, add, edit, or delete products
                        </CardDescription>
                     </div>
                     <Link href="/admin/products/add">
                        <Button className="w-full md:w-auto">
                           <Plus className="mr-2 h-4 w-4" />
                           Add New Product
                        </Button>
                     </Link>
                  </div>
               </CardHeader>
               <CardContent>
                  {/* Search Bar */}
                  <form
                     onSubmit={handleSearch}
                     className="flex gap-2 mb-6"
                  >
                     <Input
                        placeholder="Search products?..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="max-w-sm"
                     />
                     <Button
                        type="submit"
                        variant="outline"
                        disabled={loading}
                     >
                        {loading ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                           <Search className="h-4 w-4" />
                        )}
                     </Button>
                  </form>

                  {loading ? (
                     <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     </div>
                  ) : error ? (
                     <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
                        <h3 className="font-medium text-lg">
                           Error loading products
                        </h3>
                        <p className="text-muted-foreground">
                           {error.message}
                        </p>
                        <Button onClick={() => refetch()} className="mt-4">
                           Try Again
                        </Button>
                     </div>
                  ) : products?.length === 0 ? (
                     <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                           No products found
                        </p>
                        <Link href="/admin/products/add">
                           <Button>Add Your First Product</Button>
                        </Link>
                     </div>
                  ) : (
                     <>
                        <div className="overflow-x-auto">
                           <Table>
                              <TableHeader>
                                 <TableRow>
                                    <TableHead className="w-[100px]">
                                       Image
                                    </TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Categories</TableHead>
                                    <TableHead className="text-right">
                                       Actions
                                    </TableHead>
                                 </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {products?.map((product: IProduct) => (
                                    <TableRow key={product.id}>
                                       <TableCell>
                                          {product.images &&
                                          product.images.length > 0 ? (
                                             <ProductImage
                                                imageUrl={
                                                   product.images[0].url
                                                }
                                                alt={product.name}
                                                width={80}
                                                height={80}
                                                className="w-20 h-20 object-cover rounded-md"
                                             />
                                          ) : (
                                             <div className="w-20 h-20 bg-muted flex items-center justify-center rounded-md">
                                                <span className="text-xs text-muted-foreground">
                                                   No image
                                                </span>
                                             </div>
                                          )}
                                       </TableCell>
                                       <TableCell className="font-medium">
                                          {product.name}
                                       </TableCell>
                                       <TableCell>
                                          {formatCurrency(product.price)}
                                       </TableCell>
                                       <TableCell>
                                          <span
                                             className={
                                                product.stock?.stock <= 0
                                                   ? "text-destructive"
                                                   : ""
                                             }
                                          >
                                             {product.stock?.stock || 0}
                                          </span>
                                       </TableCell>
                                       <TableCell>
                                          <div className="flex flex-wrap gap-1">
                                             {product.categories?.map(
                                                (category) => (
                                                   <span
                                                      key={category.id}
                                                      className="bg-secondary text-secondary-foreground px-2 py-1 text-xs rounded-full"
                                                   >
                                                      {category.name}
                                                   </span>
                                                )
                                             )}
                                          </div>
                                       </TableCell>
                                       <TableCell className="text-right">
                                          <div className="flex justify-end gap-2">
                                             <Link
                                                href={`/admin/products/edit/${product.id}`}
                                             >
                                                <Button
                                                   variant="outline"
                                                   size="sm"
                                                >
                                                   <Edit className="h-4 w-4" />
                                                   <span className="sr-only">
                                                      Edit
                                                   </span>
                                                </Button>
                                             </Link>
                                          </div>
                                       </TableCell>
                                    </TableRow>
                                 ))}
                              </TableBody>
                           </Table>
                        </div>

                        {/* Pagination */}
                        {total_page > 1 && (
                           <Pagination className="mt-6">
                              <PaginationContent>
                                 <PaginationItem>
                                    <PaginationPrevious
                                       onClick={() => setPage(page - 1)}
                                       className={
                                          !prev_page
                                             ? "pointer-events-none opacity-50"
                                             : "cursor-pointer"
                                       }
                                    />
                                 </PaginationItem>

                                 {Array.from(
                                    { length: total_page },
                                    (_, i) => i + 1
                                 )
                                    .filter(
                                       (p) =>
                                          p === 1 ||
                                          p === total_page ||
                                          Math.abs(p - page) <= 1
                                    )
                                    .map((p, i, arr) => {
                                       // Add ellipsis
                                       if (i > 0 && p - arr[i - 1] > 1) {
                                          return (
                                             <React.Fragment
                                                key={`ellipsis-${p}`}
                                             >
                                                <PaginationItem>
                                                   <span className="px-2">
                                                      ...
                                                   </span>
                                                </PaginationItem>
                                                <PaginationItem>
                                                   <PaginationLink
                                                      onClick={() =>
                                                         setPage(p)
                                                      }
                                                      isActive={page === p}
                                                      className="cursor-pointer"
                                                   >
                                                      {p}
                                                   </PaginationLink>
                                                </PaginationItem>
                                             </React.Fragment>
                                          );
                                       }

                                       return (
                                          <PaginationItem key={p}>
                                             <PaginationLink
                                                onClick={() => setPage(p)}
                                                isActive={page === p}
                                                className="cursor-pointer"
                                             >
                                                {p}
                                             </PaginationLink>
                                          </PaginationItem>
                                       );
                                    })}

                                 <PaginationItem>
                                    <PaginationNext
                                       onClick={() => setPage(page + 1)}
                                       className={
                                          !next_page
                                             ? "pointer-events-none opacity-50"
                                             : "cursor-pointer"
                                       }
                                    />
                                 </PaginationItem>
                              </PaginationContent>
                           </Pagination>
                        )}
                     </>
                  )}
               </CardContent>
            </Card>
         </div>
      </>
   );
}
