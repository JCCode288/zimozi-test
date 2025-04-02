import Link from "next/link";

export default function Footer() {
   return (
      <footer className="border-t border-[hsl(var(--neon))] bg-background">
         <div className="container flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between md:py-6">
            <div className="text-center md:text-left">
               <p className="text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()}{" "}
                  <span className="text-[hsl(var(--neon))]">MyStore</span>.
                  All rights reserved.
               </p>
            </div>
            <div className="flex justify-center gap-4 md:justify-end">
               <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-[hsl(var(--neon))] transition-colors"
               >
                  Terms
               </Link>
               <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-[hsl(var(--neon))] transition-colors"
               >
                  Privacy
               </Link>
            </div>
         </div>
      </footer>
   );
}
