"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PRODUCT_IMAGE_FALLBACK } from "@/lib/storefront/product-images";
import { cn } from "@/lib/utils/cn";

type ProductImageProps = {
  /** Must be a local `/images/...` path from `resolveProductImageUrl` or the same fallback. */
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

const baseCrop = "object-cover [object-position:center_45%]";

/**
 * Local `next/image` only. Resolver never emits remote URLs; `onError` swaps to bundled fallback
 * if a file is missing (defensive).
 */
export function ProductImage({ src, alt, sizes, className, priority }: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <>
      <div className="absolute inset-0 z-0 bg-[#141016]" aria-hidden />
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(baseCrop, "z-[1] select-none", className)}
        priority={priority}
        onError={() => {
          setImgSrc((prev) => (prev === PRODUCT_IMAGE_FALLBACK ? prev : PRODUCT_IMAGE_FALLBACK));
        }}
      />
    </>
  );
}
