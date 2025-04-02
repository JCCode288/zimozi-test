import HomeComponent from "@/components/home-component";

export default function Home() {
   return (
      <div className="flex flex-col min-h-screen">
         <main className="flex-1">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
               <div className="container px-4 md:px-6">
                  <div className="flex flex-col items-center space-y-4 text-center">
                     <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none neon-text">
                           Welcome to Our Platform
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                           Browse our products and services. Sign in to
                           access your account and manage your orders.
                        </p>
                     </div>
                     <HomeComponent />
                  </div>
               </div>
            </section>
         </main>
      </div>
   );
}
