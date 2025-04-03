import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import Axios from "./lib/api/axios";
import { AuthURL } from "./lib/api/be.constant";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
   const cookie = await cookies();
   const token = cookie.get("token");

   if (!token?.value)
      return NextResponse.redirect(new URL("/products", req.url));

   try {
      const {
         data: { data, status, message },
      } = await Axios.get(AuthURL.VALIDATE, {
         headers: { Authorization: token.value },
      });

      if (!data.admin)
         return NextResponse.redirect(new URL("/products", req.url));
   } catch (err) {
      return NextResponse.redirect(new URL("/products", req.url));
   }

   return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
   matcher: ["/admin/:path*", "/profile"],
};
