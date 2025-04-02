import type React from "react";
import "./globals.css";
import MainProvider from "@/components/providers/main-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en" className="dark">
         <body className="min-h-screen flex flex-col">
            <MainProvider>
               <Navbar />
               <main className="flex-grow">{children}</main>
               <Footer />
            </MainProvider>
         </body>
      </html>
   );
}
