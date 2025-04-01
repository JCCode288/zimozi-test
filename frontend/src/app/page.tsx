import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import * as page_metadata from "@/app/metadata.json";
import { Metadata } from "next";

export const metadata: Metadata = page_metadata;

export default function Home() {
   const github_link = "https://github.com/JCCode288";
   return (
      <div className="flex flex-col min-h-screen">
         <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
               <div className="container px-4 md:px-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                     <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                           Zimozi test app by{" "}
                           <Link
                              href={github_link}
                              className="hover:text-blue-900 duration-150 ease-in"
                           >
                              JCCode288
                           </Link>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                           Browse our products and services. Sign in to
                           access your account and manage your orders.
                        </p>
                     </div>
                     <div className="space-x-4">
                        <Link href="/login">
                           <Button>
                              Sign In
                              <ArrowRight className="ml-2 h-4 w-4" />
                           </Button>
                        </Link>
                        <Link href="/products">
                           <Button variant="outline">
                              Browse Products
                           </Button>
                        </Link>
                     </div>
                  </div>
               </div>
            </section>
         </main>
      </div>
   );
}
