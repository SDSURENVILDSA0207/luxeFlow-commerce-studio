"use client";

import type { Route } from "next";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ProductImage } from "@/components/storefront/product-image";
import { ProductCollectionCard } from "@/components/storefront/product-collection-card";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { resolveProductImageUrl } from "@/lib/storefront/product-images";

type RelatedProduct = {
  slug: string;
  name: string;
  price: string;
  collection: string;
  material: string;
};

type ProductDetailViewProps = {
  slug: string;
};

const productImages = [
  "Main Editorial View",
  "Side Profile",
  "Material Detail",
  "Lifestyle Styling"
];

const materialOptions = ["18K Yellow Gold", "18K White Gold", "18K Rose Gold"];
const sizeOptions = ["5", "6", "7", "8", "9"];

const relatedProducts: RelatedProduct[] = [
  {
    slug: "vesper-tennis-bracelet",
    name: "Vesper Tennis Bracelet",
    price: "$3,350",
    collection: "Evening Light",
    material: "Platinum, diamond line"
  },
  {
    slug: "etoile-diamond-studs",
    name: "Etoile Diamond Studs",
    price: "$1,190",
    collection: "Bridal Icons",
    material: "18K white gold, diamond"
  },
  {
    slug: "noir-sapphire-pendant",
    name: "Noir Sapphire Pendant",
    price: "$1,780",
    collection: "Midnight Sapphire",
    material: "18K gold, blue sapphire"
  }
];

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const [activeImage, setActiveImage] = useState(productImages[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(materialOptions[0]);
  const [selectedSize, setSelectedSize] = useState(sizeOptions[2]);
  const [bagToast, setBagToast] = useState(false);
  const [bagAdding, setBagAdding] = useState(false);

  const formattedTitle = useMemo(() => {
    const text = slug
      .split("-")
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(" ");
    return text || "Luna Halo Ring";
  }, [slug]);

  const primaryImage = useMemo(() => resolveProductImageUrl(slug), [slug]);

  const addToBag = () => {
    if (bagAdding) return;
    setBagAdding(true);
    window.setTimeout(() => {
      setBagAdding(false);
      setBagToast(true);
      window.setTimeout(() => setBagToast(false), 4000);
    }, 420);
  };

  return (
    <div className="relative space-y-space-2xl">
      {bagToast ? (
        <div
          className="fixed bottom-6 left-4 right-4 z-[100] mx-auto w-[min(calc(100vw-2rem),22rem)] animate-toast-in rounded-xl border border-accent/40 bg-surface px-4 py-3 text-center text-body-sm text-foreground shadow-premium-lg motion-reduce:animate-none motion-reduce:opacity-100"
          role="status"
          aria-live="polite"
        >
          Added to bag — continue shopping or{" "}
          <Link href={"/products" as Route} className="font-semibold text-accent-soft underline-offset-2 hover:underline">
            view catalog
          </Link>
          .
        </div>
      ) : null}
      <section className="grid gap-10 xl:grid-cols-[1.15fr_1fr] xl:gap-14">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#141016] p-5 shadow-[0_16px_48px_rgba(6,4,12,0.45)] ring-1 ring-white/[0.05] lg:p-6">
            <div className="relative aspect-[4/5] max-h-[min(34rem,70vh)] w-full overflow-hidden rounded-xl border border-white/[0.07] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <ProductImage
                src={primaryImage}
                alt={formattedTitle}
                sizes="(max-width: 1280px) 100vw, 55vw"
                priority
              />
              <div className="pointer-events-none absolute left-6 top-6 z-[3]">
                <Badge variant="luxury" className="px-3.5 py-1.5 text-[10px] font-bold tracking-[0.14em]">
                  {activeImage}
                </Badge>
              </div>
              <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-background/30 via-transparent to-white/[0.03]" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {productImages.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveImage(image)}
                className={`premium-ring touch-manipulation rounded-xl border p-2 text-left transition-all duration-200 ${
                  activeImage === image
                    ? "border-accent/65 bg-accent/15 text-accent-soft shadow-premium-soft ring-1 ring-accent/20"
                    : "border-border bg-surface-2 text-muted hover:border-border-strong hover:text-foreground"
                }`}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg border border-white/[0.06]">
                  <ProductImage
                    src={primaryImage}
                    alt={`${formattedTitle} — view ${image}`}
                    sizes="120px"
                  />
                </div>
                <p className="mt-2 line-clamp-2 text-[10px] uppercase tracking-[0.14em]">{image}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          <div className="space-y-4">
            <Badge variant="accent">Signature collection</Badge>
            <h1 className="text-balance text-display-lg">{formattedTitle}</h1>
            <p className="text-body">
              A sculpted fine-jewelry essential balancing timeless silhouette with contemporary proportion for everyday luxury.
            </p>
            <p className="font-display text-display-lg text-foreground">$2,300</p>
          </div>

          <Card className="border-border-strong bg-surface shadow-premium-soft">
            <CardContent className="space-y-6 p-7">
              <div>
                <p className="text-label-sm font-semibold uppercase text-accent-soft">Material</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {materialOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedMaterial(option)}
                      className={`premium-ring touch-manipulation rounded-full border px-3 py-1.5 text-body-sm transition-all duration-200 active:scale-[0.98] motion-reduce:active:scale-100 ${
                        selectedMaterial === option
                          ? "border-accent/65 bg-accent/20 text-accent-soft"
                          : "border-border bg-surface-2 text-muted hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-label-sm font-semibold uppercase text-accent-soft">Size</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`premium-ring touch-manipulation h-10 min-w-10 rounded-lg border px-3 text-body-sm transition-all duration-200 active:scale-[0.98] motion-reduce:active:scale-100 ${
                        selectedSize === size
                          ? "border-accent/65 bg-accent/20 text-accent-soft"
                          : "border-border bg-surface-2 text-muted hover:text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <Button size="lg" type="button" onClick={addToBag} disabled={bagAdding} aria-busy={bagAdding}>
                  {bagAdding ? "Adding…" : "Add to Bag"}
                </Button>
                <Link
                  href={"/c/spring-bridal-event" as Route}
                  className="premium-ring inline-flex h-12 w-full touch-manipulation items-center justify-center rounded-lg border border-border-strong bg-surface-2 px-6 text-body font-medium text-foreground transition-[color,background-color,border-color,transform] duration-200 ease-premium hover:bg-surface-3 hover:border-accent/40 active:translate-y-px"
                >
                  Book Private Consultation
                </Link>
              </div>
              <p className="text-body-sm text-muted">Selected: {selectedMaterial}, Size {selectedSize}</p>
            </CardContent>
          </Card>

          <Card className="bg-surface-2/70">
            <CardContent className="space-y-3 p-5">
              <p className="text-label-sm font-semibold uppercase text-accent-soft">Trust & Service</p>
              <ul className="space-y-2 text-body-sm text-muted">
                <li>Certified precious materials and responsible gemstone sourcing</li>
                <li>Complimentary luxury gift packaging and annual care service</li>
                <li>Secure checkout with private concierge follow-up</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-surface">
          <CardContent className="space-y-4 p-6">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Product Story</p>
            <h2 className="text-heading-xl">Designed to mirror the glow of evening city lights.</h2>
            <p className="text-body-sm text-muted">
              The setting architecture emphasizes brilliance while preserving a clean profile, making it ideal for both daily wear and formal styling. Every piece is finished by master artisans and inspected by our in-house quality atelier.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-surface">
          <CardContent className="space-y-4 p-6">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Shipping & Returns</p>
            <div className="space-y-2 text-body-sm text-muted">
              <p>Complimentary insured express shipping on all domestic orders above $500.</p>
              <p>Dispatched within 24-48 hours, with delivery updates sent by email and SMS.</p>
              <p>30-day complimentary returns and one free size adjustment for eligible pieces.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-label-sm font-semibold uppercase text-accent-soft">Related Products</p>
            <h2 className="mt-1 text-balance">Complete the Collection</h2>
          </div>
          <Link
            href={"/collections" as Route}
            className="shrink-0 text-body-sm text-muted transition-colors hover:text-foreground"
          >
            View all collections
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {relatedProducts.map((product) => (
            <ProductCollectionCard
              key={product.slug}
              name={product.name}
              collection={product.collection}
              material={product.material}
              price={product.price}
              slug={product.slug}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
