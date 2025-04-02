"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, UserCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { loginStore } from "@/lib/store/login.store";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CartDrawer from "@/components/cart-drawer";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
   DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const pathname = usePathname();
   const { user, logout } = loginStore();
   const [isAdmin, setIsAdmin] = useState(false);
   const [mounted, setMounted] = useState(false);
   const [isLoggingOut, setIsLoggingOut] = useState(false);
   const { toast } = useToast();

   // Handle hydration mismatch
   useEffect(() => {
      setMounted(true);
   }, []);

   // Check if user is admin
   useEffect(() => {
      if (user) {
         // In a real app, you would check user claims or roles in your database
         setIsAdmin(user.email === "admin@example.com");
      }
   }, [user]);

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
   };

   const handleLogout = async () => {
      try {
         setIsLoggingOut(true);
         await logout();
         toast({
            title: "Logged out",
            description: "You have been logged out successfully",
            variant: "success",
         });
         window.location.href = "/";
      } catch (error) {
         console.error("Error logging out:", error);
         toast({
            title: "Error",
            description: "Failed to log out",
            variant: "destructive",
         });
      } finally {
         setIsLoggingOut(false);
      }
   };

   // Base nav items that are always visible
   const baseNavItems = [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
   ];

   // Auth nav items that change based on authentication state
   const authNavItems = user
      ? []
      : [
           { name: "Login", href: "/login" },
           { name: "Register", href: "/register" },
        ];

   // Admin nav items only visible to admin users
   const adminNavItems = isAdmin
      ? [{ name: "Admin", href: "/admin" }]
      : [];

   // Combine all nav items
   const navItems = [...baseNavItems, ...adminNavItems, ...authNavItems];

   if (!mounted) {
      return null;
   }

   return (
      <header className="border-b border-[hsl(var(--neon))] bg-background shadow-md">
         <div className="container flex h-16 items-center justify-between px-4 md:px-6">
            <Link href="/" className="flex items-center gap-2">
               <span className="text-xl font-bold neon-text">MyStore</span>
            </Link>
            <nav className="hidden md:flex gap-6 items-center">
               {navItems.map((item) => (
                  <Link
                     key={item.href}
                     href={item.href}
                     className={cn(
                        "text-sm font-medium transition-colors hover:text-[hsl(var(--neon))]",
                        pathname === item.href
                           ? "neon-text"
                           : "text-muted-foreground"
                     )}
                  >
                     {item.name}
                  </Link>
               ))}

               {user && (
                  <>
                     <CartDrawer />
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2 hover:text-[hsl(var(--neon))]"
                           >
                              <UserCircle className="h-4 w-4" />
                              {user.displayName ||
                                 user.email?.split("@")[0]}
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem asChild>
                              <Link
                                 href="/profile"
                                 className="cursor-pointer"
                              >
                                 <User className="mr-2 h-4 w-4" />
                                 Profile
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              onClick={handleLogout}
                              className="cursor-pointer"
                              disabled={isLoggingOut}
                           >
                              {isLoggingOut ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging out...
                                 </>
                              ) : (
                                 <>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                 </>
                              )}
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </>
               )}
            </nav>
            <div className="md:hidden flex items-center gap-4">
               {user && <CartDrawer />}
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
                     <span className="text-xl font-bold neon-text">
                        MyStore
                     </span>
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
                        className={cn(
                           "flex items-center py-2 text-lg font-medium",
                           pathname === item.href
                              ? "neon-text"
                              : "text-muted-foreground"
                        )}
                        onClick={toggleMenu}
                     >
                        {item.name}
                     </Link>
                  ))}
                  {user && (
                     <>
                        <Link
                           href="/profile"
                           className="flex items-center py-2 text-lg font-medium text-muted-foreground hover:text-[hsl(var(--neon))]"
                           onClick={toggleMenu}
                        >
                           <User className="mr-2 h-4 w-4" />
                           Profile
                        </Link>
                        <Button
                           variant="ghost"
                           className="flex items-center justify-start py-2 text-lg font-medium hover:text-[hsl(var(--neon))]"
                           onClick={() => {
                              handleLogout();
                              toggleMenu();
                           }}
                           disabled={isLoggingOut}
                        >
                           {isLoggingOut ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 Logging out...
                              </>
                           ) : (
                              <>
                                 <LogOut className="mr-2 h-4 w-4" />
                                 Logout
                              </>
                           )}
                        </Button>
                     </>
                  )}
               </nav>
            </div>
         )}
      </header>
   );
}
