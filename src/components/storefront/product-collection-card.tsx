"use client";

import type { Route } from "next";
import Link from "next/link";
import { ProductImage } from "@/components/storefront/product-image";
import { Badge, Card, CardContent } from "@/components/ui";
import type { CollectionProduct } from "@/lib/storefront/collections-data";
import { resolveProductImageUrl } from "@/lib/storefront/product-images";
import { resolveProductPieceHref } from "@/lib/storefront/resolve-product-piece-href";
import { cn } from "@/lib/utils/cn";

type ProductCollectionCardProps = {
  name: string;
  collection: string;
  price: string;
  material: string;
  tag?: string;
  slug?: string;
  href?: string;
  /** When slug is missing, used to deep-link into the collections experience */
  category?: CollectionProduct["category"];
};

export function ProductCollectionCard({ name, collection, price, material, tag, slug, href, category }: ProductCollectionCardProps) {
  const pieceHref = resolveProductPieceHref({ name, slug, href, category });
  const src = resolveProductImageUrl(slug, name);

  return (
    <Card
      className={cn(
        "group overflow-hidden rounded-2xl border border-white/[0.07] bg-surface/90 shadow-[0_10px_44px_rgba(6,4,10,0.48)] ring-1 ring-white/[0.05]",
        "transition-all duration-500 ease-premium",
        "motion-safe:hover:-translate-y-1.5 hover:border-accent/30 hover:shadow-[0_28px_64px_rgba(6,4,12,0.55)] hover:ring-accent/[0.12]"
      )}
    >
      <CardContent className="p-0">
        <Link
          href={pieceHref}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="relative aspect-[4/5] overflow-hidden border-b border-white/[0.06] bg-[#141016]">
            {tag ? (
              <span className="absolute left-3.5 top-3.5 z-20 sm:left-4 sm:top-4">
                <Badge variant="luxury" className="px-3.5 py-1.5 text-[10px] font-bold tracking-[0.18em]">
                  {tag}
                </Badge>
              </span>
            ) : null}
            <ProductImage
              src={src}
              alt={name}
              sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="transition-transform duration-[700ms] ease-premium group-hover:scale-[1.045]"
            />
            <div
              className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-background/35 via-transparent to-white/[0.04]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-0 z-[2] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),inset_0_0_48px_rgba(196,165,116,0.04)]"
              aria-hidden
            />
          </div>
        </Link>

        <div className="space-y-5 px-6 pb-7 pt-6">
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted/75">{collection}</p>
            <Link href={pieceHref} className="block">
              <h3 className="font-display text-[1.28rem] font-medium leading-snug tracking-[-0.02em] text-foreground transition-colors duration-300 group-hover:text-accent-soft md:text-[1.35rem]">
                {name}
              </h3>
            </Link>
            <p className="text-[0.9375rem] leading-relaxed text-muted/95">{material}</p>
          </div>

          <div className="flex items-end justify-between gap-4 border-t border-white/[0.08] pt-5">
            <p className="font-display text-[1.45rem] font-medium tracking-[-0.02em] text-foreground md:text-[1.5rem]">{price}</p>
            <Link
              href={pieceHref}
              className={cn(
                "premium-ring inline-flex shrink-0 touch-manipulation items-center justify-center font-medium transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-premium",
                "h-10 min-h-10 rounded-full border border-white/[0.14] bg-[color-mix(in_srgb,var(--color-surface-2)_92%,transparent)] px-6 text-[0.8125rem] tracking-[0.06em] text-foreground",
                "shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_4px_18px_rgba(0,0,0,0.28)] hover:border-accent/50 hover:bg-[color-mix(in_srgb,var(--color-accent)_11%,var(--color-surface-2))] hover:shadow-[0_0_28px_rgba(196,165,116,0.2),inset_0_1px_0_rgba(255,255,255,0.12)] active:translate-y-px"
              )}
            >
              View piece
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
