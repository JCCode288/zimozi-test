import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
   // In a real application, you would verify the authentication token here
   // For this example, we're just checking if the path is /admin
   // In a real app, you would use a proper auth solution like NextAuth.js or Clerk

   // This is just a placeholder for demonstration purposes
   // In a real app, this would be handled by your auth provider

   return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
   matcher: ["/admin/:path*"],
};
