import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between md:py-6">
        <div className="text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MyStore. All rights reserved.
          </p>
        </div>
        <div className="flex justify-center gap-4 md:justify-end">
          <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  )
}

