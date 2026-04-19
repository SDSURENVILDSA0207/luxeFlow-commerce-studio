import type { CatalogProduct } from "@/lib/storefront/products-catalog-data";

type ProductGallerySpecCardProps = {
  product: CatalogProduct;
  selectedMaterial: string;
  selectedSize: string;
  variant: "hero" | "thumb";
};

/**
 * Fourth gallery tile: typography-led “piece details” — not a duplicate product photo.
 * Matches luxury PDP patterns (spec + service cues) without implying alternate photography.
 */
export function ProductGallerySpecCard({
  product,
  selectedMaterial,
  selectedSize,
  variant
}: ProductGallerySpecCardProps) {
  if (variant === "thumb") {
    return (
      <div className="flex h-full min-h-[4.5rem] flex-col justify-between rounded-lg border border-white/[0.1] bg-gradient-to-br from-[#1c181f] via-[#141016] to-[#0f0c12] p-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-muted">Details</p>
        <p className="line-clamp-2 text-[10px] font-medium leading-snug text-foreground/95">{product.name}</p>
        <p className="truncate text-[9px] text-muted">{selectedMaterial}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#1c181f] via-[#141016] to-[#0f0c12] p-8 lg:p-10">
      <div>
        <p className="text-label-sm font-semibold uppercase tracking-[0.12em] text-accent-soft">Piece details</p>
        <h2 className="mt-3 text-balance font-display text-2xl text-foreground lg:text-3xl">{product.name}</h2>
        <p className="mt-2 text-body text-muted">
          <span className="text-foreground/90">{product.collection}</span>
          {" · "}
          {product.material}
        </p>
      </div>
      <div className="space-y-4 border-t border-white/[0.08] pt-6">
        <dl className="grid grid-cols-1 gap-3 text-body-sm sm:grid-cols-2">
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Finish</dt>
            <dd className="mt-1 text-foreground/95">{selectedMaterial}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Size</dt>
            <dd className="mt-1 text-foreground/95">{selectedSize} — complimentary adjustment available</dd>
          </div>
        </dl>
        <ul className="space-y-2 text-body-sm text-muted">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/80" aria-hidden />
            Certified materials with documented provenance
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/80" aria-hidden />
            Complimentary insured shipping &amp; signature packaging
          </li>
        </ul>
      </div>
    </div>
  );
}
