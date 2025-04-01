import type React from "react"

import * as page_metadata from "@/app/register/metadata.json"
import type { Metadata } from "next"

export const metadata: Metadata = page_metadata

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

