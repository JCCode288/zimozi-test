"use client";

import { FirebaseError, initializeApp } from "firebase/app";
import {
   createUserWithEmailAndPassword,
   getAuth,
   GoogleAuthProvider,
   signInWithEmailAndPassword,
   signInWithPopup,
   signOut,
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

   return cred.user;
}

export async function googleSignIn() {
   const provider = new GoogleAuthProvider();
   const res = await signInWithPopup(auth, provider);
   const cred = GoogleAuthProvider.credentialFromResult(res);

   if (!cred)
      throw new FirebaseError("auth/invalid-auth", "failed to login");

   return res.user;
}

export async function logout() {
   return signOut(auth);
}
