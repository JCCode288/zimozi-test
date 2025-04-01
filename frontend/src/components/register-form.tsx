"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export function RegisterForm() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError("");

      // Basic validation
      if (password !== confirmPassword) {
         setError("Passwords do not match");
         setIsLoading(false);
         return;
      }

      try {
         // In a real app, you would send registration data to your backend
         // This is just a mock implementation
         console.log("Registration data:", { name, email, password });

         // Simulate successful registration
         setTimeout(() => {
            // Store authentication state (in a real app, use a proper auth solution)
            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("userRole", "user");
            router.push("/products");
         }, 1000);
      } catch (err) {
         setError("An error occurred during registration");
         console.error(err);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Card className="w-full max-w-md">
         <CardHeader>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>
               Enter your information to register
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
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                     id="name"
                     placeholder="John Doe"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
                  />
               </div>
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                     id="password"
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                     id="confirmPassword"
                     type="password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     required
                  />
               </div>
            </CardContent>
            <CardFooter>
               <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
               >
                  {isLoading ? "Creating account..." : "Register"}
               </Button>
            </CardFooter>
         </form>
      </Card>
   );
}
