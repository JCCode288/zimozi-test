"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Navbar() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const pathname = usePathname();

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
   };

   const navItems = [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "Login", href: "/login" },
   ];

   return (
      <header className="border-b bg-background">
         <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2">
               <span className="text-xl font-bold">Ecommerce</span>
            </Link>
            <nav className="hidden md:flex gap-6">
               {navItems.map((item) => (
                  <Link
                     key={item.href}
                     href={item.href}
                     className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname === item.href
                           ? "text-primary"
                           : "text-muted-foreground"
                     )}
                  >
                     {item.name}
                  </Link>
               ))}
            </nav>
            <div className="md:hidden">
               <Button variant="ghost" size="icon" onClick={toggleMenu}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
               </Button>
            </div>
         </div>
         {isMenuOpen && (
            <div className="fixed inset-0 z-50 bg-background md:hidden">
               <div className="container flex h-16 items-center justify-between px-4">
                  <Link href="/" className="flex items-center gap-2">
                     <span className="text-xl font-bold">MyStore</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={toggleMenu}>
                     <X className="h-6 w-6" />
                     <span className="sr-only">Close menu</span>
                  </Button>
               </div>
               <nav className="container grid gap-6 px-4 pb-8 pt-6">
                  {navItems.map((item) => (
                     <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center py-2 text-lg font-medium"
                        onClick={toggleMenu}
                     >
                        {item.name}
                     </Link>
                  ))}
               </nav>
            </div>
         )}
      </header>
   );
}
