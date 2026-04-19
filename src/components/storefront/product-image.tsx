"use client";

import Image from "next/image";
import { useState } from "react";
import { PRODUCT_IMAGE_FALLBACK } from "@/lib/storefront/product-images";
import { cn } from "@/lib/utils/cn";

type ProductImageProps = {
  /** Must be a local `/images/...` path from `resolveProductImageUrl` or the same fallback. */
  src: string;
  alt: string;
  sizes: string;
  /** Replaces default object-fit/position/zoom for gallery crops (hero + thumbs). */
  cropClassName?: string;
  className?: string;
  priority?: boolean;
};

const defaultCrop = "object-cover [object-position:center_45%]";

/**
 * Local `next/image` only. Resolver never emits remote URLs; `onError` swaps to bundled fallback
 * if a file is missing (defensive).
 */
function ProductImageInner({ src, alt, sizes, cropClassName, className, priority }: ProductImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const imgSrc = useFallback ? PRODUCT_IMAGE_FALLBACK : src;

  return (
    <>
      <div className="absolute inset-0 z-0 bg-[#141016]" aria-hidden />
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(cropClassName ?? defaultCrop, "z-[1] select-none", className)}
        priority={priority}
        onError={() => setUseFallback(true)}
      />
    </>
  );
}

/** Remount when `src` or crop changes so fallback state resets without a sync effect. */
export function ProductImage(props: ProductImageProps) {
  return <ProductImageInner key={`${props.src}:${props.cropClassName ?? ""}`} {...props} />;
}
