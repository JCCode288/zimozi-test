"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      try {
         // In a real app, you would validate credentials against your backend
         // This is just a mock implementation
         if (email === "admin@example.com" && password === "admin123") {
            // Store authentication state (in a real app, use a proper auth solution)
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userRole", "admin");
            router.push("/admin");
         } else if (
            email === "user@example.com" &&
            password === "user123"
         ) {
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userRole", "user");
            router.push("/products");
         } else {
            setError("Invalid email or password");
         }
      } catch (err) {
         setError("An error occurred during login");
         console.error(err);
      } finally {
         setIsLoading(false);
      }
   };

   const handleGoogleLogin = () => {
      setIsLoading(true);
      // In a real app, you would implement Google OAuth
      // This is just a mock implementation
      setTimeout(() => {
         localStorage.setItem("isAuthenticated", "true");
         localStorage.setItem("userRole", "user");
         router.push("/products");
      }, 1000);
   };

   return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle className="text-2xl">Login</CardTitle>
               <CardDescription>
                  Enter your credentials to access your account
               </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
               <CardContent className="space-y-4">
                  {error && (
                     <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                     </Alert>
                  )}
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Button
                           variant="link"
                           className="p-0 h-auto text-sm"
                           type="button"
                        >
                           Forgot password?
                        </Button>
                     </div>
                     <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>
                  <Button
                     type="submit"
                     className="w-full"
                     disabled={isLoading}
                  >
                     {isLoading ? "Logging in..." : "Login"}
                  </Button>

                  <Separator className="my-4" />

                  <Button
                     type="button"
                     variant="outline"
                     className="w-full flex items-center justify-center gap-2"
                     onClick={handleGoogleLogin}
                     disabled={isLoading}
                  >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="w-5 h-5"
                     >
                        <path
                           fill="#4285F4"
                           d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                           fill="#34A853"
                           d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                           fill="#FBBC05"
                           d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                           fill="#EA4335"
                           d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                     </svg>
                     Continue with Google
                  </Button>
               </CardContent>
               <CardFooter className="flex justify-center">
                  <p className="text-sm text-muted-foreground">
                     Don't have an account?{" "}
                     <Link
                        href="/register"
                        className="text-primary hover:underline"
                     >
                        Register
                     </Link>
                  </p>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
}
