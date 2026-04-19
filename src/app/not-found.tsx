import type { Route } from "next";
import Link from "next/link";
import { StorefrontShell } from "@/components/layouts/storefront-shell";
import { buttonVisualClasses } from "@/components/ui";

/** Fallback for unmatched URLs outside the storefront segment tree (includes full chrome). */
export default function RootNotFound() {
  return (
    <StorefrontShell>
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-label-sm font-semibold uppercase tracking-[0.16em] text-accent-soft">404</p>
        <h1 className="mt-3 max-w-md font-display text-display-lg text-foreground">This page isn&apos;t here</h1>
        <p className="mt-3 max-w-md text-body text-muted">
          The link may be outdated. Try the catalog or return home.
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
    </StorefrontShell>
  );
}
