"use client";

import type React from "react";

import ProtectedRoute from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { loginStore } from "@/lib/store/login.store";

export default function ProfilePage() {
   const { user } = loginStore();
   const [displayName, setDisplayName] = useState("");
   const [email, setEmail] = useState("");
   const { toast } = useToast();

   useEffect(() => {
      if (user) {
         setDisplayName(user.displayName || "");
         setEmail(user.email || "");
      }
   }, [user]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, you would update the user profile here
      toast({
         title: "Profile Updated",
         description: "Your profile has been updated successfully",
         variant: "success",
      });
   };

   return (
      <ProtectedRoute>
         <div className="container py-8">
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

            <div className="max-w-md mx-auto">
               <Card>
                  <CardHeader>
                     <CardTitle>Account Information</CardTitle>
                     <CardDescription>
                        Update your account details
                     </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleSubmit}>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="name">Display Name</Label>
                           <Input
                              id="name"
                              value={displayName}
                              onChange={(e) =>
                                 setDisplayName(e.target.value)
                              }
                           />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="email">Email</Label>
                           <Input
                              id="email"
                              type="email"
                              value={email}
                              disabled
                           />
                           <p className="text-sm text-muted-foreground">
                              Email cannot be changed
                           </p>
                        </div>
                     </CardContent>
                     <CardFooter>
                        <Button type="submit">Update Profile</Button>
                     </CardFooter>
                  </form>
               </Card>
            </div>
         </div>
      </ProtectedRoute>
   );
}
