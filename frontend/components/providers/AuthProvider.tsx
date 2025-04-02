"use client";

import type React from "react";

import { useEffect } from "react";
import { loginStore } from "@/lib/store/login.store";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   const setUser = loginStore().setUser;

   useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => {
         setUser(user);
      });

      () => {
         unsub();
      };
   }, []);

   return <>{children}</>;
}
