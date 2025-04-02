"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
   useAddProduct,
   useEditProduct,
   useProduct,
} from "@/lib/graphql/queries/products.query";
import { useCategories } from "@/lib/graphql/queries/categories.query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Save, ArrowLeft, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Select } from "@/components/ui/select";

interface ProductFormProps {
   productId?: number;
}

export default function ProductForm({ productId }: ProductFormProps) {
   const router = useRouter();
   const { toast } = useToast();
   const isEditing = !!productId;

   // Form state
   const [formData, setFormData] = useState({
      name: "",
      description: "",
      price: "",
      stock: "",
      selectedCategories: [] as number[],
   });
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [imageFiles, setImageFiles] = useState<File[]>([]);
   const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

   // GraphQL hooks
   const { detail: productData, loading: productLoading } = useProduct(
      productId + ""
   );
   const { categories, loading: categoriesLoading } = useCategories();

   const [addProduct] = useAddProduct();
   const [editProduct] = useEditProduct();

   // Load product data if editing
   useEffect(() => {
      if (isEditing && productData) {
         const product = productData;
         setFormData({
            name: product.name,
            description: product.description,
            price: product.price + "",
            stock: product.stock?.stock + "",
            selectedCategories:
               product.categories?.map((cat) => cat.id) || [],
         });
      }
   }, [isEditing, productData]);

   // Handle form input changes
   const handleInputChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
      let { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   // Handle category selection
   const handleCategoryToggle = (categoryId: number) => {
      const category = categoryId;
      if (isNaN(category)) return;

      setFormData((prev) => {
         const isSelected = prev.selectedCategories.includes(category);
         return {
            ...prev,
            selectedCategories: isSelected
               ? prev.selectedCategories.filter((id) => id !== category)
               : [...prev.selectedCategories, category],
         };
      });
   };

   // Handle image upload
   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
         const newFiles = Array.from(e.target.files);
         setImageFiles((prev) => [...prev, ...newFiles]);

         // Create preview URLs
         const newPreviewUrls = newFiles.map((file) =>
            URL.createObjectURL(file)
         );
         setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      }
   };

   // Remove image from preview
   const removeImage = (index: number) => {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
      setImagePreviewUrls((prev) => {
         // Revoke the URL to prevent memory leaks
         URL.revokeObjectURL(prev[index]);
         return prev.filter((_, i) => i !== index);
      });
   };

   // Handle form submission
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
         const price = +formData.price;
         const stock = +formData.stock;

         if (isNaN(price) || isNaN(stock) || price <= 0 || stock < 0) {
            toast({
               title: "Invalid input",
               description: "Please enter valid price and stock values",
               variant: "destructive",
            });
            setIsSubmitting(false);
            return;
         }

         const productInput = {
            name: formData.name,
            description: formData.description,
            price,
            stock,
            categories: formData.selectedCategories.map((el) => +el),
            // We'll handle image uploads separately
         };

         if (isEditing) {
            await editProduct({
               variables: {
                  input: {
                     id: productId,
                     ...productInput,
                  },
               },
            });
            toast({
               title: "Product updated",
               description: "The product has been updated successfully",
               variant: "success",
            });
         } else {
            await addProduct({
               variables: {
                  input: productInput,
               },
            });
            toast({
               title: "Product added",
               description: "The product has been added successfully",
               variant: "success",
            });
         }

         // Redirect back to products list
         router.push("/admin/products");
      } catch (error) {
         console.error("Error saving product:", error);
         toast({
            title: "Error",
            description: `Failed to ${
               isEditing ? "update" : "add"
            } product. Please try again.`,
            variant: "destructive",
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   // Clean up preview URLs when component unmounts
   useEffect(() => {
      return () => {
         imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      };
   }, [imagePreviewUrls]);

   if (isEditing && productLoading) {
      return (
         <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
         </div>
      );
   }

   return (
      <>
         <div className="container py-8">
            <div className="flex items-center mb-6">
               <Link href="/admin/products" className="mr-4">
                  <Button variant="outline" size="icon">
                     <ArrowLeft className="h-4 w-4" />
                  </Button>
               </Link>
               <h1 className="text-3xl font-bold">
                  {isEditing ? "Edit Product" : "Add New Product"}
               </h1>
            </div>

            <Card className="max-w-3xl mx-auto">
               <CardHeader>
                  <CardTitle>
                     {isEditing
                        ? "Edit Product Details"
                        : "Product Details"}
                  </CardTitle>
                  <CardDescription>
                     {isEditing
                        ? "Update the product information below"
                        : "Fill in the details to add a new product"}
                  </CardDescription>
               </CardHeader>
               <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-6">
                     {/* Basic Information */}
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="name">Product Name *</Label>
                           <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                           />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="description">
                              Description *
                           </Label>
                           <Textarea
                              id="description"
                              name="description"
                              value={formData.description}
                              onChange={handleInputChange}
                              rows={4}
                              required
                           />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Label htmlFor="price">Price *</Label>
                              <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    Rp
                                 </span>
                                 <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="pl-7"
                                    required
                                 />
                              </div>
                           </div>

                           <div className="space-y-2">
                              <Label htmlFor="stock">Stock *</Label>
                              <Input
                                 id="stock"
                                 name="stock"
                                 type="number"
                                 min="0"
                                 step="1"
                                 value={formData.stock}
                                 onChange={handleInputChange}
                                 required
                              />
                           </div>
                        </div>
                     </div>

                     {/* Categories */}
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <Label>Categories</Label>
                           <Button>
                              <Plus /> Add New Category
                           </Button>
                        </div>
                        {categoriesLoading ? (
                           <div className="flex items-center space-x-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Loading categories...</span>
                           </div>
                        ) : categories.length > 0 ? (
                           //  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                           <Select>
                              {categories.map((category) => (
                                 <option
                                    key={category.id}
                                    className="flex items-center space-x-2"
                                    value={category.id}
                                 >
                                    <Checkbox
                                       id={`category-${category.id}`}
                                       checked={formData.selectedCategories.includes(
                                          category.id
                                       )}
                                       onCheckedChange={() =>
                                          handleCategoryToggle(category.id)
                                       }
                                    />
                                    <Label
                                       htmlFor={`category-${category.id}`}
                                       className="cursor-pointer"
                                    >
                                       {category.name}
                                    </Label>
                                 </option>
                              ))}
                           </Select>
                        ) : (
                           //  </div>
                           <p className="text-sm text-muted-foreground">
                              No categories available
                           </p>
                        )}
                     </div>

                     {/* Image Upload */}
                     <div className="space-y-2">
                        <Label htmlFor="images">Product Images</Label>
                        <div className="border border-dashed border-input rounded-md p-4">
                           <Input
                              id="images"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                              className="hidden"
                           />
                           <Label
                              htmlFor="images"
                              className="flex flex-col items-center justify-center cursor-pointer"
                           >
                              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground">
                                 Click to upload images
                              </span>
                           </Label>
                        </div>

                        {/* Image Previews */}
                        {imagePreviewUrls.length > 0 && (
                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                              {imagePreviewUrls.map((url, index) => (
                                 <div
                                    key={index}
                                    className="relative group"
                                 >
                                    <img
                                       src={url || "/placeholder.svg"}
                                       alt={`Preview ${index + 1}`}
                                       className="w-full h-24 object-cover rounded-md"
                                    />
                                    <button
                                       type="button"
                                       onClick={() => removeImage(index)}
                                       className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                       <X className="h-4 w-4" />
                                    </button>
                                 </div>
                              ))}
                           </div>
                        )}

                        {isEditing &&
                           productData?.images &&
                           productData.images.length > 0 && (
                              <div className="mt-4">
                                 <h4 className="text-sm font-medium mb-2">
                                    Current Images
                                 </h4>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {productData.images.map(
                                       (image, index) => (
                                          <div
                                             key={index}
                                             className="relative"
                                          >
                                             <img
                                                src={
                                                   image.url ||
                                                   "/placeholder.svg"
                                                }
                                                alt={
                                                   image.name ||
                                                   `Product image ${
                                                      index + 1
                                                   }`
                                                }
                                                className="w-full h-24 object-cover rounded-md"
                                             />
                                          </div>
                                       )
                                    )}
                                 </div>
                              </div>
                           )}
                     </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                     <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/admin/products")}
                        disabled={isSubmitting}
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {isEditing ? "Updating..." : "Adding..."}
                           </>
                        ) : (
                           <>
                              <Save className="mr-2 h-4 w-4" />
                              {isEditing
                                 ? "Update Product"
                                 : "Add Product"}
                           </>
                        )}
                     </Button>
                  </CardFooter>
               </form>
            </Card>
         </div>
      </>
   );
}
