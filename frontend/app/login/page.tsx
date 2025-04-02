"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Separator } from "../../components/ui/separator";
import { loginStore } from "../../lib/store/login.store";
import { useToast } from "../../hooks/use-toast";
import { useErrorHandler } from "../../hooks/use-error-handler";
import { useMutation } from "@apollo/client";
import { REGISTER } from "@/lib/graphql/queries/register.query";

export default function LoginPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const router = useRouter();
   const { toast } = useToast();

   // Use our new error handler hook
   const { error, handleError, clearError } = useErrorHandler();

   // Use the login store
   const {
      googleLogin,
      loading: storeLoading,
      user,
      isAdmin,
      setAdmin,
      login: loginFBS,
   } = loginStore();

   const [login, { data, loading, error: loginErr }] = useMutation(
      REGISTER,
      {
         variables: {
            name: user?.displayName,
            email: user?.email,
            uid: user?.uid,
         },
      }
   );

   // Redirect if user is already logged in

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      clearError();

      try {
         await loginFBS(email, password);
         await login();

         toast({
            title: "Login successful",
            description: "You have been logged in successfully",
            variant: "success",
         });
      } catch (err) {
         handleError(err);
      }
   };

   const handleGoogleLogin = async () => {
      clearError();
      try {
         await googleLogin();
         const {
            data: { register },
            errors,
         } = await login();

         if (errors) throw errors;
         if (register.admin) {
            setAdmin(!!register.admin);
            router.push("/admin/products");
         } else {
            router.push("/products");
         }

         toast({
            title: "Login successful",
            description:
               "You have been logged in with Google successfully",
            variant: "success",
         });
      } catch (err) {
         handleError(err);
      }
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
                     disabled={loading}
                  >
                     {loading ? "Logging in..." : "Login"}
                  </Button>

                  <Separator className="my-4" />

                  <Button
                     type="button"
                     variant="outline"
                     className="w-full flex items-center justify-center gap-2"
                     onClick={handleGoogleLogin}
                     disabled={loading}
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
