export type CatalogProduct = {
  name: string;
  collection: string;
  material: string;
  price: string;
  tag?: string;
  slug: string;
  /** lower = newer in demo ordering */
  sortIndex: number;
};

export const catalogProducts: CatalogProduct[] = [
  {
    name: "Luna Halo Ring",
    collection: "Bridal Icons",
    material: "18K Gold, VS Diamond",
    price: "$2,300",
    tag: "Best Seller",
    slug: "luna-halo-ring",
    sortIndex: 0
  },
  {
    name: "Noir Sapphire Pendant",
    collection: "Midnight Sapphire",
    material: "18K Gold, Blue Sapphire",
    price: "$1,780",
    tag: "Trending",
    slug: "noir-sapphire-pendant",
    sortIndex: 1
  },
  {
    name: "Aurelia Link Bracelet",
    collection: "Celestial Gold",
    material: "18K Gold, Hand-finished Links",
    price: "$1,460",
    slug: "aurelia-link-bracelet",
    sortIndex: 2
  },
  {
    name: "Etoile Diamond Studs",
    collection: "Bridal Icons",
    material: "18K White Gold, Diamond",
    price: "$1,190",
    tag: "Gift Edit",
    slug: "etoile-diamond-studs",
    sortIndex: 3
  },
  {
    name: "Pearl Sculpt Drop Earrings",
    collection: "Pearl Atelier",
    material: "Freshwater Pearl, Gold Vermeil",
    price: "$980",
    slug: "pearl-sculpt-drop-earrings",
    sortIndex: 4
  },
  {
    name: "Vesper Tennis Bracelet",
    collection: "Midnight Sapphire",
    material: "Platinum, Diamond Line",
    price: "$3,350",
    tag: "Limited",
    slug: "vesper-tennis-bracelet",
    sortIndex: 5
  },
  {
    name: "Solstice Charm Necklace",
    collection: "Celestial Gold",
    material: "18K Gold, Mini Diamond Accent",
    price: "$1,120",
    slug: "solstice-charm-necklace",
    sortIndex: 6
  },
  {
    name: "Atelier Pearl Collar",
    collection: "Pearl Atelier",
    material: "Layered Pearl, Sculpted Clasp",
    price: "$2,640",
    tag: "New Arrival",
    slug: "atelier-pearl-collar",
    sortIndex: 7
  },
  {
    name: "Orion Signet Ring",
    collection: "Signature Classics",
    material: "18K Rose Gold",
    price: "$1,250",
    slug: "orion-signet-ring",
    sortIndex: 8
  }
];

export function parsePriceUsd(price: string): number {
  const n = Number.parseInt(price.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}
