import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body className={inter.className}>
            <div className="flex flex-col min-h-screen">
               <Navbar />
               <main className="flex-1">{children}</main>
               <Footer />
            </div>
         </body>
      </html>
   );
}
