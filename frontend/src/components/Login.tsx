"use client";
import { useLoginStore } from "@/lib/store/login.store";
import { useEffect } from "react";

export default function Login() {
   const store = useLoginStore();

   const login = store.login;
   const register = store.register;
   const loading = store.loading;
   const user = store.user;

   const googleLogin = store.googleLogin;

   const handleGoogleLogin = () => googleLogin();

   useEffect(() => {
      login("hi@mail.com", "testing123");
   }, []);

   if (loading) return <>Loading</>;
   if (!user) return <>User Not Found</>;

   return (
      <div>
         <div>{JSON.stringify(user)}</div>
         <button onClick={handleGoogleLogin}>Login with google</button>
      </div>
   );
}
