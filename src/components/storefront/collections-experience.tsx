"use client";

import type { Route } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductCollectionCard } from "@/components/storefront/product-collection-card";
import {
  categoryAnchors,
  categoryOrder,
  collectionProducts,
  filterGroups,
  parsePriceUsd,
  productMatchesFilters,
  type CollectionProduct,
  type FilterGroupLabel
} from "@/lib/storefront/collections-data";
import { Badge, buttonVisualClasses, Card, CardContent, Select } from "@/components/ui";
import { cn } from "@/lib/utils/cn";

const initialFilters: Record<FilterGroupLabel, string> = {
  Category: "All",
  Metal: "All",
  Stone: "All",
  Price: "All"
};

function sortProducts(list: CollectionProduct[], sortKey: string): CollectionProduct[] {
  const copy = [...list];
  if (sortKey === "price-low") copy.sort((a, b) => parsePriceUsd(a.price) - parsePriceUsd(b.price));
  else if (sortKey === "price-high") copy.sort((a, b) => parsePriceUsd(b.price) - parsePriceUsd(a.price));
  else if (sortKey === "latest") copy.reverse();
  return copy;
}

export function CollectionsExperience() {
  const [filters, setFilters] = useState<Record<FilterGroupLabel, string>>(initialFilters);
  const [sortKey, setSortKey] = useState("featured");

  const filteredSorted = useMemo(() => {
    const filtered = collectionProducts.filter((p) => productMatchesFilters(p, filters));
    return sortProducts(filtered, sortKey);
  }, [filters, sortKey]);

  const setOption = (groupLabel: FilterGroupLabel, option: string) => {
    setFilters((prev) => ({ ...prev, [groupLabel]: option }));
  };

  const resetFilters = () => setFilters(initialFilters);

  const count = filteredSorted.length;

  return (
    <div className="space-y-space-2xl">
      <section className="relative overflow-hidden rounded-2xl border border-border-strong bg-gradient-to-br from-surface to-surface-2 px-5 py-space-2xl shadow-premium-lg sm:px-8 lg:px-12">
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative space-y-6">
          <Badge variant="accent">Collection Atelier</Badge>
          <h1 className="max-w-3xl text-balance text-display-lg md:text-display-xl">
            Curated pieces for modern jewelry collectors with timeless taste.
          </h1>
          <p className="max-w-2xl text-body">
            Browse elevated categories crafted for everyday elegance and milestone gifting, with premium finishes and signature craftsmanship.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={"/products" as Route} className={buttonVisualClasses()}>
              Shop all pieces
            </Link>
            <Link href={"/c/spring-bridal-event" as Route} className={buttonVisualClasses({ variant: "secondary" })}>
              Spring bridal edit
            </Link>
          </div>
        </div>
      </section>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,17rem)_1fr]">
        <Card className="h-fit min-w-0 border-border bg-surface">
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-heading-lg">Refine</h2>
              <button
                className="premium-ring shrink-0 touch-manipulation rounded-md px-1.5 py-0.5 text-body-sm text-muted transition-colors hover:bg-surface-2/80 hover:text-foreground active:scale-[0.98] motion-reduce:active:scale-100"
                type="button"
                onClick={resetFilters}
              >
                Reset
              </button>
            </div>

            {filterGroups.map((group) => (
              <div key={group.label} className="space-y-3">
                <p className="text-label-sm font-semibold uppercase text-accent-soft">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const active = filters[group.label] === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setOption(group.label, option)}
                        className={cn(
                          "premium-ring touch-manipulation rounded-full border px-3 py-1.5 text-body-sm transition-all duration-200 ease-premium active:scale-[0.97] motion-reduce:active:scale-100",
                          active
                            ? "border-accent/60 bg-accent/20 text-accent-soft"
                            : "border-border bg-surface-2 text-muted hover:border-border-strong hover:text-foreground"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="relative min-w-0 overflow-hidden border-accent/30 bg-gradient-to-br from-accent/[0.08] to-surface">
          <div className="absolute -right-10 top-2 h-44 w-44 rounded-full border border-accent/25" />
          <CardContent className="relative space-y-4 p-6 sm:p-7">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Featured capsule</p>
            <h2 className="max-w-xl text-balance text-display-lg md:text-heading-xl">
              Midnight Sapphire: matching sets for evening and celebration.
            </h2>
            <p className="max-w-xl text-body-sm text-muted">
              Build complete looks with ring, pendant, and earring combinations designed for formal events and gifting.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href={"/c/spring-bridal-event" as Route} className={buttonVisualClasses({ variant: "secondary" })}>
                View campaign
              </Link>
              <Link href={"/products" as Route} className={buttonVisualClasses({ variant: "ghost" })}>
                Browse all pieces
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="min-w-0 space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Collection</p>
            <h2 className="mt-1 text-balance">Explore by category</h2>
            <p className="mt-2 text-body-sm text-muted">
              Showing {count} of {collectionProducts.length} pieces · filters apply across categories.
            </p>
          </div>
          <nav
            className="flex max-w-full flex-wrap gap-2 rounded-xl border border-border/80 bg-surface-2/50 p-1.5"
            aria-label="Jump to category"
          >
            {categoryAnchors.map((a) => (
              <a
                key={a.id}
                href={`#${a.id}`}
                className="premium-ring touch-manipulation rounded-lg px-3 py-2 text-body-sm text-muted transition-colors hover:bg-surface hover:text-foreground active:scale-[0.98] motion-reduce:active:scale-100"
              >
                {a.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="w-full max-w-full sm:max-w-xs">
          <Select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="featured">Sort: Featured</option>
            <option value="latest">Sort: New arrivals</option>
            <option value="price-low">Sort: Price low to high</option>
            <option value="price-high">Sort: Price high to low</option>
          </Select>
        </div>

        <div className="space-y-16">
          {categoryOrder.map((category) => {
            const items = filteredSorted.filter((p) => p.category === category);
            if (items.length === 0) return null;
            const anchorId = category.toLowerCase();
            return (
              <section key={category} id={anchorId} className="scroll-mt-28 space-y-6 md:scroll-mt-32">
                <div className="flex flex-col gap-1 border-b border-border/70 pb-4 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-display text-heading-xl text-foreground">{category}</h3>
                  <span className="text-body-sm text-muted">
                    {items.length} {items.length === 1 ? "piece" : "pieces"}
                  </span>
                </div>
                <div className="grid min-w-0 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4">
                  {items.map((product) => (
                    <ProductCollectionCard
                      key={product.name}
                      name={product.name}
                      collection={product.collection}
                      material={product.material}
                      price={product.price}
                      tag={product.tag}
                      slug={product.slug}
                      category={product.category}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {count === 0 ? (
          <p className="rounded-xl border border-border bg-surface-2/80 px-4 py-6 text-center text-body-sm text-muted">
            No pieces match these filters.{" "}
            <button
              type="button"
              className="touch-manipulation text-accent-soft underline decoration-accent-soft/50 transition-opacity hover:opacity-90 active:opacity-80"
              onClick={resetFilters}
            >
              Clear filters
            </button>
          </p>
        ) : null}
      </section>
    </div>
  );
}
