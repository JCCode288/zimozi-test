"use client";

import dynamic from "next/dynamic";
import { DayPickerProvider } from "react-day-picker";

export default function MainProvider({ children }) {
   const ThemeProvider = dynamic(
      () => import("@/components/theme-provider"),
      { ssr: false }
   );
   const GraphQLProvider = dynamic(
      () => import("@/components/providers/GraphQLProvider"),
      { ssr: false }
   );
   const Toaster = dynamic(() => import("@/components/ui/toaster"), {
      ssr: false,
   });
   const AuthProvider = dynamic(
      () => import("@/components/providers/AuthProvider"),
      { ssr: false }
   );

   return (
      <ThemeProvider
         attribute="class"
         defaultTheme="dark"
         enableSystem={false}
      >
         <DayPickerProvider initialProps={{}}>
            <AuthProvider>
               <GraphQLProvider>
                  {children}
                  <Toaster />
               </GraphQLProvider>
            </AuthProvider>
         </DayPickerProvider>
      </ThemeProvider>
   );
}
