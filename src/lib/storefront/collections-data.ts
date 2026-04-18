export const filterGroups = [
  { label: "Category", options: ["All", "Rings", "Necklaces", "Bracelets", "Earrings"] },
  { label: "Metal", options: ["All", "18K Gold", "White Gold", "Rose Gold", "Platinum"] },
  { label: "Stone", options: ["All", "Diamond", "Sapphire", "Pearl", "Emerald"] },
  { label: "Price", options: ["All", "$500 - $1,500", "$1,500 - $3,000", "$3,000+"] }
] as const;

export const categoryAnchors = [
  { id: "rings", label: "Rings" },
  { id: "necklaces", label: "Necklaces" },
  { id: "bracelets", label: "Bracelets" },
  { id: "earrings", label: "Earrings" }
] as const;

export type CollectionProduct = {
  name: string;
  collection: string;
  material: string;
  price: string;
  tag?: string;
  slug?: string;
  category: "Rings" | "Necklaces" | "Bracelets" | "Earrings";
};

export const collectionProducts: CollectionProduct[] = [
  {
    name: "Luna Halo Ring",
    collection: "Celestial Gold",
    material: "18K Gold, VS Diamond",
    price: "$2,300",
    tag: "Best Seller",
    slug: "luna-halo-ring",
    category: "Rings"
  },
  {
    name: "Noir Sapphire Pendant",
    collection: "Midnight Sapphire",
    material: "18K Gold, Blue Sapphire",
    price: "$1,780",
    tag: "Trending",
    slug: "noir-sapphire-pendant",
    category: "Necklaces"
  },
  {
    name: "Aurelia Link Bracelet",
    collection: "Celestial Gold",
    material: "18K Gold, Hand-finished Links",
    price: "$1,460",
    slug: "aurelia-link-bracelet",
    category: "Bracelets"
  },
  {
    name: "Etoile Diamond Studs",
    collection: "Bridal Icons",
    material: "18K White Gold, Diamond",
    price: "$1,190",
    tag: "Gift Edit",
    slug: "etoile-diamond-studs",
    category: "Earrings"
  },
  {
    name: "Pearl Sculpt Drop",
    collection: "Pearl Atelier",
    material: "Freshwater Pearl, Gold Vermeil",
    price: "$980",
    slug: "pearl-sculpt-drop-earrings",
    category: "Earrings"
  },
  {
    name: "Orion Signet Ring",
    collection: "Signature Classics",
    material: "18K Rose Gold",
    price: "$1,250",
    slug: "orion-signet-ring",
    category: "Rings"
  },
  {
    name: "Vesper Tennis Bracelet",
    collection: "Evening Light",
    material: "Platinum, Diamond Line",
    price: "$3,350",
    tag: "Limited",
    slug: "vesper-tennis-bracelet",
    category: "Bracelets"
  },
  {
    name: "Solstice Charm Necklace",
    collection: "Celestial Gold",
    material: "18K Gold, Mini Diamond Accent",
    price: "$1,120",
    slug: "solstice-charm-necklace",
    category: "Necklaces"
  }
];

export const categoryOrder: CollectionProduct["category"][] = ["Rings", "Necklaces", "Bracelets", "Earrings"];

export type FilterGroupLabel = (typeof filterGroups)[number]["label"];

export function parsePriceUsd(price: string): number {
  const n = Number.parseInt(price.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

export function productMatchesFilters(
  p: CollectionProduct,
  selected: Record<FilterGroupLabel, string>
): boolean {
  if (selected.Category !== "All" && p.category !== selected.Category) return false;

  if (selected.Metal !== "All") {
    const m = p.material.toLowerCase();
    if (selected.Metal === "18K Gold" && !m.includes("18k")) return false;
    if (selected.Metal === "White Gold" && !m.includes("white")) return false;
    if (selected.Metal === "Rose Gold" && !m.includes("rose")) return false;
    if (selected.Metal === "Platinum" && !m.includes("platinum")) return false;
  }

  if (selected.Stone !== "All") {
    const m = p.material.toLowerCase();
    const stone = selected.Stone.toLowerCase();
    if (!m.includes(stone)) return false;
  }

  if (selected.Price !== "All") {
    const n = parsePriceUsd(p.price);
    if (selected.Price === "$500 - $1,500" && (n < 500 || n > 1500)) return false;
    if (selected.Price === "$1,500 - $3,000" && (n < 1500 || n > 3000)) return false;
    if (selected.Price === "$3,000+" && n <= 3000) return false;
  }

  return true;
}
