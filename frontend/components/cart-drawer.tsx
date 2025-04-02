"use client";

import { Button } from "@/components/ui/button";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet";
import {
   ShoppingCart,
   Loader2,
   Check,
   AlertCircle,
   LogIn,
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginStore } from "@/lib/store/login.store";
import { useRouter } from "next/navigation";
import { useCart, useCheckout } from "@/lib/graphql/queries/cart.query";

export default function CartDrawer() {
   const { loading, error, cart, refetch } = useCart();
   const [checkout, { loading: checkoutLoading }] = useCheckout();
   const { toast } = useToast();
   const [isOpen, setIsOpen] = useState(false);
   const [cartError, setCartError] = useState<string | null>(null);
   const { user } = loginStore();
   const router = useRouter();

   if (loading || !cart) return <>Loading</>;

   // Extract cart data safely with fallbacks
   const cartItems = cart.cart_items || [];
   const cartTotal = cart.cart_total || 0;

   // Handle opening the cart
   const handleOpenCart = async () => {
      // If user is not logged in, redirect to login page
      if (!user) {
         toast({
            title: "Login Required",
            description: "Please log in to view your cart",
            variant: "destructive",
         });
         router.push("/login");
         return;
      }

      setCartError(null);
      try {
         // Try to refetch cart data when opening
         if (isOpen === false) {
            await refetch();
         }
         setIsOpen(true);
      } catch (err) {
         console.error("Error opening cart:", err);
         setCartError("Failed to load cart data. Please try again.");
         // Still open the cart to show the error
         setIsOpen(true);
      }
   };

   const handleCheckout = async () => {
      setCartError(null);
      try {
         await checkout();
         toast({
            title: "Checkout successful",
            description: "Your order has been placed",
            variant: "success",
         });
         setIsOpen(false);
      } catch (err) {
         console.error("Error during checkout:", err);
         setCartError(
            "There was an error processing your checkout. Please try again."
         );
         toast({
            title: "Checkout failed",
            description: "There was an error processing your order",
            variant: "destructive",
         });
      }
   };

   // Handle retry when there's an error
   const handleRetry = async () => {
      setCartError(null);
      try {
         await refetch();
      } catch (err) {
         console.error("Error retrying cart fetch:", err);
         setCartError("Failed to load cart data. Please try again.");
      }
   };

   return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
         <SheetTrigger asChild>
            <Button
               variant="outline"
               size="icon"
               className="relative"
               onClick={handleOpenCart}
            >
               <ShoppingCart className="h-5 w-5" />
               {user && cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                     {cartItems.length}
                  </span>
               )}
            </Button>
         </SheetTrigger>
         <SheetContent className="w-full sm:max-w-md flex flex-col">
            <SheetHeader>
               <SheetTitle>Your Cart</SheetTitle>
               <SheetDescription>
                  {cartItems.length === 0
                     ? "Your cart is empty"
                     : `You have ${cartItems.length} item${
                          cartItems.length > 1 ? "s" : ""
                       } in your cart`}
               </SheetDescription>
            </SheetHeader>

            {!user ? (
               <div className="flex flex-col items-center justify-center flex-grow p-4">
                  <LogIn className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                     Login Required
                  </h3>
                  <p className="text-center text-muted-foreground mb-4">
                     Please log in to view your cart and make purchases
                  </p>
                  <Button
                     onClick={() => {
                        setIsOpen(false);
                        router.push("/login");
                     }}
                  >
                     Go to Login
                  </Button>
               </div>
            ) : cartError ? (
               <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{cartError}</AlertDescription>
                  <Button
                     variant="outline"
                     size="sm"
                     className="mt-2"
                     onClick={handleRetry}
                  >
                     Try Again
                  </Button>
               </Alert>
            ) : loading ? (
               <div className="flex justify-center items-center flex-grow">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
               </div>
            ) : (
               <>
                  <div className="flex-grow overflow-auto py-4">
                     {cartItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                           Your cart is empty. Add some products to get
                           started.
                        </div>
                     ) : (
                        <div className="space-y-4">
                           {cartItems.map((item, index) => (
                              <div
                                 key={`${item.product.id}-${index}`}
                                 className="flex gap-4"
                              >
                                 <div className="w-20 h-20 relative rounded overflow-hidden">
                                    <Image
                                       src={
                                          item.image?.url ||
                                          "/placeholder.svg?height=80&width=80"
                                       }
                                       alt={item.product.name}
                                       fill
                                       className="object-cover"
                                    />
                                 </div>
                                 <div className="flex-grow">
                                    <h4 className="font-medium">
                                       {item.product.name}
                                    </h4>
                                    <div className="text-sm text-muted-foreground">
                                       Quantity: {item.total.quantity}
                                    </div>
                                    <div className="font-medium">
                                       ${item.total.price}
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>

                  {cartItems.length > 0 && (
                     <div className="mt-auto pt-4">
                        <Separator className="my-4" />
                        <div className="flex justify-between text-lg font-semibold mb-4">
                           <span>Total</span>
                           <span>Rp{cartTotal}</span>
                        </div>
                        <Button
                           className="w-full"
                           onClick={handleCheckout}
                           disabled={checkoutLoading}
                        >
                           {checkoutLoading ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 Processing...
                              </>
                           ) : (
                              <>
                                 <Check className="mr-2 h-4 w-4" />
                                 Checkout
                              </>
                           )}
                        </Button>
                     </div>
                  )}
               </>
            )}
         </SheetContent>
      </Sheet>
   );
}
