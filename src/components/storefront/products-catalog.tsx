"use client";

import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ProductCollectionCard } from "@/components/storefront/product-collection-card";
import { catalogProducts, parsePriceUsd } from "@/lib/storefront/products-catalog-data";
import { Badge, buttonVisualClasses, MenuSelect } from "@/components/ui";

function matchesSearch(
  q: string,
  product: (typeof catalogProducts)[number]
): boolean {
  if (!q) return true;
  const hay = `${product.name} ${product.collection} ${product.material}`.toLowerCase();
  return hay.includes(q);
}

export function ProductsCatalog() {
  const searchParams = useSearchParams();
  const queryRaw = searchParams.get("q")?.trim() ?? "";
  const queryLower = queryRaw.toLowerCase();

  const [sortKey, setSortKey] = useState("featured");

  const sorted = useMemo(() => {
    let list = catalogProducts.filter((p) => matchesSearch(queryLower, p));
    if (sortKey === "price-low") list = [...list].sort((a, b) => parsePriceUsd(a.price) - parsePriceUsd(b.price));
    else if (sortKey === "price-high") list = [...list].sort((a, b) => parsePriceUsd(b.price) - parsePriceUsd(a.price));
    else if (sortKey === "newest") list = [...list].sort((a, b) => b.sortIndex - a.sortIndex);
    else list = [...list].sort((a, b) => a.sortIndex - b.sortIndex);
    return list;
  }, [sortKey, queryLower]);

  return (
    <div className="min-w-0 space-y-space-2xl">
      <section className="relative overflow-hidden rounded-2xl border border-border-strong bg-gradient-to-br from-surface to-surface-2 px-5 py-space-xl shadow-premium sm:px-8 md:px-10">
        <div className="absolute -right-24 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative space-y-5">
          <Badge variant="accent">Fine Jewelry Catalog</Badge>
          <h1 className="max-w-3xl text-balance text-display-lg md:text-display-xl">Explore the complete LuxeFlow product library.</h1>
          <p className="max-w-2xl text-body">
            A premium assortment of rings, pendants, bracelets, and earrings curated for modern collectors and milestone gifting.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={"/collections" as Route} className={buttonVisualClasses()}>
              Browse by Collection
            </Link>
            <Link href={"/c/new-arrivals-collection" as Route} className={buttonVisualClasses({ variant: "secondary" })}>
              View Campaign Edit
            </Link>
          </div>
        </div>
      </section>

      <section className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-label-sm font-semibold uppercase text-accent-soft">Product Catalog</p>
          <h2 className="mt-1">Signature Pieces</h2>
          <p className="mt-1 text-body-sm text-muted">
            {queryRaw
              ? `Showing ${sorted.length} match${sorted.length === 1 ? "" : "es"} for “${queryRaw}”.`
              : `Showing ${sorted.length} premium jewelry products.`}
          </p>
        </div>
        <div className="flex w-full min-w-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <form action="/products" method="get" role="search" className="w-full min-w-0 sm:w-56">
            <input
              type="search"
              name="q"
              defaultValue={queryRaw}
              placeholder="Filter by name or material…"
              aria-label="Search catalog"
              className="premium-ring h-11 w-full rounded-lg border border-border bg-surface-2 px-3 text-body-sm text-foreground placeholder:text-muted/75"
            />
          </form>
          <div className="w-full min-w-0 sm:w-72">
            <MenuSelect
              aria-label="Sort products"
              value={sortKey}
              onChange={setSortKey}
              options={[
                { value: "featured", label: "Sort: Featured" },
                { value: "newest", label: "Sort: Newest" },
                { value: "price-low", label: "Sort: Price · Low to high" },
                { value: "price-high", label: "Sort: Price · High to low" }
              ]}
            />
          </div>
        </div>
      </section>

      {queryRaw && sorted.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface-2/80 px-4 py-6 text-center text-body-sm text-muted">
          No pieces match “{queryRaw}”.{" "}
          <Link href={"/products" as Route} className="font-medium text-accent-soft underline-offset-2 hover:underline">
            Clear search
          </Link>
        </p>
      ) : (
        <section className="grid min-w-0 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4">
          {sorted.map((product) => (
            <ProductCollectionCard
              key={product.slug}
              name={product.name}
              collection={product.collection}
              material={product.material}
              price={product.price}
              tag={product.tag}
              slug={product.slug}
            />
          ))}
        </section>
      )}
    </div>
  );
}
