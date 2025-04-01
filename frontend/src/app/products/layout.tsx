import type React from "react";

import * as page_metadata from "@/app/products/metadata.json";
import type { Metadata } from "next";

export const metadata: Metadata = page_metadata;

export default function ProductsLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return <>{children}</>;
}
