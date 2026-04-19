/**
 * PDP gallery: honest labels + distinct visuals per slot.
 *
 * We only have one studio photograph per SKU on disk, so three slots use intentional
 * crops/zooms of that image (different framing, not fake “side angle” photography).
 * The fourth slot is a specifications / service card — visually unique, not a repeated photo.
 */

export type GalleryMaterialKey = "yellow" | "white" | "rose";

export type GallerySlot =
  | {
      id: "full" | "detail" | "texture";
      kind: "photo";
      /** Short label under thumbnails */
      label: string;
      /** Badge on hero */
      badge: string;
    }
  | {
      id: "details";
      kind: "card";
      label: string;
      badge: string;
    };

export const PRODUCT_GALLERY_SLOTS: GallerySlot[] = [
  {
    id: "full",
    kind: "photo",
    label: "Full view",
    badge: "Full view"
  },
  {
    id: "detail",
    kind: "photo",
    label: "Detail close-up",
    badge: "Detail close-up"
  },
  {
    id: "texture",
    kind: "photo",
    label: "Finish & texture",
    badge: "Finish & texture"
  },
  {
    id: "details",
    kind: "card",
    label: "Piece details",
    badge: "Piece details"
  }
];

/** Map UI material string → framing key (shifts crop anchors; same photo, different emphasis). */
export function galleryMaterialKeyFromOption(materialOption: string): GalleryMaterialKey {
  if (materialOption.includes("White")) return "white";
  if (materialOption.includes("Rose")) return "rose";
  return "yellow";
}

/**
 * Three photo slots × three material framings — Tailwind classes for `next/image` (object-cover + zoom).
 * Each row is visually distinct; switching material reframes the same asset (honest “preview” behavior).
 */
const PHOTO_CROP_BY_MATERIAL: Record<GalleryMaterialKey, [string, string, string]> = {
  yellow: [
    "object-cover object-[center_42%]",
    "object-cover object-[68%_34%] scale-[1.28] origin-[68%_34%]",
    "object-cover object-[30%_58%] scale-[1.24] origin-[30%_58%]"
  ],
  white: [
    "object-cover object-[52%_44%]",
    "object-cover object-[72%_36%] scale-[1.28] origin-[72%_36%]",
    "object-cover object-[34%_56%] scale-[1.24] origin-[34%_56%]"
  ],
  rose: [
    "object-cover object-[48%_40%]",
    "object-cover object-[64%_30%] scale-[1.28] origin-[64%_30%]",
    "object-cover object-[26%_60%] scale-[1.24] origin-[26%_60%]"
  ]
};

/** Photo slot index 0..2 maps to full/detail/texture. */
export function getGalleryPhotoCropClass(photoSlotIndex: 0 | 1 | 2, materialOption: string): string {
  const key = galleryMaterialKeyFromOption(materialOption);
  return PHOTO_CROP_BY_MATERIAL[key][photoSlotIndex];
}

export function galleryPhotoSlotIndex(slotIndex: number): 0 | 1 | 2 | null {
  if (slotIndex >= 0 && slotIndex <= 2) return slotIndex as 0 | 1 | 2;
  return null;
}
