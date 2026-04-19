import type { Route } from "next";
import Link from "next/link";
import { buttonVisualClasses } from "@/components/ui";

/**
 * Shown when `notFound()` is called from a storefront route (e.g. invalid product slug).
 * `StorefrontShell` is already applied by the parent layout — do not wrap again.
 */
export default function StorefrontNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-soft">404</p>
      <h1 className="mt-3 max-w-md font-display text-display-lg text-foreground">This page isn&apos;t here</h1>
      <p className="mt-3 max-w-md text-body text-muted">
        The link may be outdated, or the piece may have moved. Try the catalog or return home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href={"/" as Route} className={buttonVisualClasses({ variant: "secondary" })}>
          Home
        </Link>
        <Link href={"/products" as Route} className={buttonVisualClasses()}>
          View catalog
        </Link>
      </div>
    </div>
  );
}
