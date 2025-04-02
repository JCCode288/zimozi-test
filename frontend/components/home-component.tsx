"use client";

import { loginStore } from "@/lib/store/login.store";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function HomeComponent() {
   const user = loginStore().user;
   const isAdmin = loginStore().isAdmin;

   return (
      <div className="space-x-4 mt-6">
         {!user && (
            <>
               <Link href="/login">
                  <Button className="neon-button">Sign In</Button>
               </Link>
               <Link href="/register">
                  <Button
                     variant="outline"
                     className="border-[hsl(var(--neon))] text-[hsl(var(--neon))] hover:bg-[hsl(var(--neon))] hover:text-background"
                  >
                     Register
                  </Button>
               </Link>
            </>
         )}
         {isAdmin ? (
            <Link href="/admin/products">
               <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-[hsl(var(--neon))]"
               >
                  Manage Products
               </Button>
            </Link>
         ) : (
            <Link href="/products">
               <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-[hsl(var(--neon))]"
               >
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         )}
      </div>
   );
}
