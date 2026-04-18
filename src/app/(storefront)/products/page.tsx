import { Suspense } from "react";
import { ProductsCatalog } from "@/components/storefront/products-catalog";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] animate-pulse rounded-2xl border border-border bg-surface-2/50 p-10 text-body-sm text-muted">
          Loading catalog…
        </div>
      }
    >
      <ProductsCatalog />
    </Suspense>
  );
}
