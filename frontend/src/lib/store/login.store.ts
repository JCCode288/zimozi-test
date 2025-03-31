import { create } from "zustand";
import { googleSignIn, register, signIn } from "../firebase";
import { User } from "firebase/auth";

interface IAuthData {
   isLoggedIn: boolean;
   uid: string | null;
   token: string | null;
   loading: boolean;
   user: User | null;
}

interface IAuthStore extends IAuthData {
   login: (email: string, password: string) => void;
   register: (name: string, email: string, password: string) => void;
   googleLogin: () => void;
}

const initialState: IAuthData = {
   isLoggedIn: false,
   uid: null,
   token: null,
   loading: false,
   user: null,
};

export const useLoginStore = create<IAuthStore>((set, get) => ({
   ...initialState,

   login: async function (email: string, password: string) {
      set((state) => ({ ...state, loading: true }));
      try {
         const user = await signIn(email, password);
         console.log(user, "<<< USER");
         set((state) => ({ ...state, user }));
         set((state) => ({ ...state, loading: false }));
      } catch (err) {
         set((state) => ({ ...state, loading: false }));
         console.error(err, "<<< LOGIN");
      }
   },

   register: async function (
      name: string,
      email: string,
      password: string
   ) {
      set((state) => ({ ...state, loading: true }));
      try {
         const user = await register(name, email, password);
         console.log(user);
         set((state) => ({ ...state, user }));
         set((state) => ({ ...state, loading: false }));
      } catch (err) {
         set((state) => ({ ...state, loading: false }));
         console.error(err, "<<< REGISTER");
      }
   },

   googleLogin: async function () {
      set((state) => ({ ...state, loading: true }));
      try {
         const user = await googleSignIn();
         console.log(user);
         set((state) => ({ ...state, user }));
         set((state) => ({ ...state, loading: false }));
      } catch (err) {
         set((state) => ({ ...state, loading: false }));
         console.error(err, "<<< SIGN GOOGLE");
      }
   },
}));
