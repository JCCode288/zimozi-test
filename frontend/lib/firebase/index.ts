"use client";

import { initializeApp } from "firebase/app";
import {
   createUserWithEmailAndPassword,
   getAuth,
   GoogleAuthProvider,
   signInWithEmailAndPassword,
   signInWithPopup,
   signOut,
   updateProfile,
} from "firebase/auth";

const cred = {
   apiKey: process.env.NEXT_PUBLIC_FBS_API_KEY,
   authDomain: process.env.NEXT_PUBLIC_FBS_AUTH_DOMAIN,
   projectId: process.env.NEXT_PUBLIC_FBS_PROJECT_ID,
   storageBucket: process.env.NEXT_PUBLIC_FBS_STORAGE_BUCKET,
   messagingSenderId: process.env.NEXT_PUBLIC_FBS_MESSAGE_SENDER,
   appId: process.env.NEXT_PUBLIC_FBS_APP_ID,
};

const app = initializeApp(cred);
const auth = getAuth(app);

export async function signIn(email: string, password: string) {
   const cred = await signInWithEmailAndPassword(auth, email, password);
   return cred.user;
}

export async function register(
   name: string,
   email: string,
   password: string
) {
   const cred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
   );

   await updateProfile(cred.user, { displayName: name });

   return cred.user;
}

export async function googleSignIn() {
   const provider = new GoogleAuthProvider();
   const res = await signInWithPopup(auth, provider);
   const cred = GoogleAuthProvider.credentialFromResult(res);

   if (!cred) {
      const error = new Error("failed to login");
      // Add a code property to mimic Firebase error structure
      (error as any).code = "auth/invalid-auth";
      throw error;
   }

   return res.user;
}

export async function logout() {
   return signOut(auth);
}

export { auth };
