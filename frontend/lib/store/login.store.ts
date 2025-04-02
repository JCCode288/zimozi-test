"use client";

// Keep the persist middleware for client-side storage, but make it safe for SSR
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { register, signIn, logout as firebaseLogout } from "../firebase";
import type { User } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { cookies } from "next/headers";

const clientStorage = createJSONStorage(() => localStorage);

interface IAuthData {
   isLoggedIn: boolean;
   uid: string | null;
   token: string | null;
   loading: boolean;
   user: User | null;
   isAdmin: boolean;
}

interface IAuthStore extends IAuthData {
   login(email: string, password: string): void;
   register: (name: string, email: string, password: string) => void;
   googleLogin: () => void;
   setUser: (user: User) => void;
   setAdmin: (isAdmin: boolean) => void;
   logout: () => Promise<void>;
}

export const loginStore = create<IAuthStore>()(
   persist(
      (set, get) => ({
         // Default initial state
         isLoggedIn: false,
         uid: null,
         token: null,
         loading: false,
         user: null,
         isAdmin: false,

         async login(email, password) {
            const user = await signIn(email, password);
            const token = await user.getIdToken();
            localStorage.user_token = token;

            set((state) => ({
               ...state,
               user,
               token,
               isLoggedIn: true,
               loading: false,
            }));
         },

         register: async (
            name: string,
            email: string,
            password: string
         ) => {
            set((state) => ({ ...state, loading: true }));
            try {
               const user = await register(name, email, password);
               console.log("Firebase registration successful:", user);

               const token = await user.getIdToken();

               localStorage.user_token = token;

               set((state) => ({
                  ...state,
                  user,
                  token,
                  isLoggedIn: true,
                  loading: false,
               }));
            } catch (err) {
               set((state) => ({ ...state, loading: false }));
               console.error("Registration error:", err);
               throw err;
            }
         },

         googleLogin: async () => {
            set((state) => ({ ...state, loading: true }));
            try {
               const provider = new GoogleAuthProvider();
               const res = await signInWithPopup(auth, provider);
               const cred = GoogleAuthProvider.credentialFromResult(res);

               if (!cred) {
                  const error = new Error("failed to login");
                  (error as any).code = "auth/invalid-auth";
                  throw error;
               }

               const user = res.user;
               console.log("Google login successful:", user);

               // Get the token
               const token = await user.getIdToken();

               set((state) => ({
                  ...state,
                  user,
                  token,
                  isLoggedIn: true,
                  loading: false,
               }));
            } catch (err) {
               set((state) => ({ ...state, loading: false }));
               console.error(err, "<<< SIGN GOOGLE");
               throw err;
            }
         },

         // Update the logout method to ensure localStorage is cleared
         logout: async () => {
            try {
               await firebaseLogout();

               // Clear token from localStorage
               if (typeof window !== "undefined") {
                  localStorage.removeItem("authToken");
                  console.log("Token removed from localStorage in logout");
               }

               // Update store state
               set((state) => ({
                  ...state,
                  user: null,
                  token: null,
                  isLoggedIn: false,
               }));
            } catch (err) {
               console.error("Logout error:", err);
               throw err;
            }
         },
         setUser(user) {
            set((state) => ({ ...state, user: user }));
         },
         setAdmin(isAdmin) {
            set((state) => ({ ...state, isAdmin }));
         },
      }),
      {
         name: "auth-storage", // unique name for the storage
         storage: clientStorage,
         partialize: (state) => ({
            token: state.token,
            isLoggedIn: state.isLoggedIn,
         }),
      }
   )
);
