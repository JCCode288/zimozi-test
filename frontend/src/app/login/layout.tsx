import type React from "react";

import * as page_metadata from "@/app/login/metadata.json";
import { Metadata } from "next";

export const metadata: Metadata = page_metadata;

export default function LoginLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <>{children}</>;
}
