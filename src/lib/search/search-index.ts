import { studioNavItems } from "@/components/layouts/studio-navigation";
import { catalogProducts } from "@/lib/storefront/products-catalog-data";
import { categoryAnchors } from "@/lib/storefront/collections-data";
import {
  campaignNavLinks,
  homeFeaturedCategories,
  homeFeaturedCollections,
  homeTrustPoints,
  shopMegaMenuCategories,
  storefrontNavShopDiscover,
  storefrontNavShopFeatured
} from "@/lib/storefront/storefront-routes";
import { seedCampaigns } from "@/modules/campaigns/seed-campaigns";
import { seedContentBlocks } from "@/modules/cms/seed-content-blocks";
import { seedEmailCampaigns } from "@/modules/email/seed-campaigns";
import { emailTemplates } from "@/modules/email/templates";
import { seedAbTests } from "@/modules/experiments/seed-tests";
import type { SearchIndexEntry } from "@/lib/search/types";

function blob(parts: (string | undefined)[]): string {
  return parts
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function push(entries: SearchIndexEntry[], e: SearchIndexEntry) {
  entries.push(e);
}

/** Curated material / stone shortcuts → catalog search */
const MATERIAL_QUERIES: { q: string; label: string; terms: string }[] = [
  { q: "diamond", label: "Diamond jewelry", terms: "diamond diamonds vs etoile" },
  { q: "sapphire", label: "Sapphire pieces", terms: "sapphire blue midnight noir" },
  { q: "pearl", label: "Pearl jewelry", terms: "pearl freshwater atelier" },
  { q: "gold", label: "Gold jewelry", terms: "gold 18k yellow rose white vermeil" },
  { q: "platinum", label: "Platinum pieces", terms: "platinum vesper" },
  { q: "ring", label: "Rings", terms: "ring rings signet halo bridal" },
  { q: "necklace", label: "Necklaces", terms: "necklace necklaces pendant solstice charm" },
  { q: "bracelet", label: "Bracelets", terms: "bracelet bracelets tennis link aurelia" },
  { q: "earring", label: "Earrings", terms: "earring earrings studs drops pearl sculpt" }
];

function buildSearchIndex(): SearchIndexEntry[] {
  const out: SearchIndexEntry[] = [];

  // —— Pages & navigation ——
  push(out, {
    id: "page-home",
    group: "pages",
    title: "Home",
    subtitle: "Editorial storefront · Spring Signature 2026",
    href: "/",
    searchBlob: blob(["home", "landing", "editorial", "luxeflow", "spring signature"]),
    boost: 12
  });

  push(out, {
    id: "page-collections",
    group: "pages",
    title: "Collections",
    subtitle: "Browse curated collection stories",
    href: "/collections",
    searchBlob: blob(["collections", "browse", "categories", "jewelry"]),
    boost: 14
  });

  push(out, {
    id: "page-products",
    group: "pages",
    title: "Pieces",
    subtitle: "Full product catalog",
    href: "/products",
    searchBlob: blob(["pieces", "products", "catalog", "shop", "all pieces", "jewelry"]),
    boost: 14
  });

  push(out, {
    id: "page-studio",
    group: "admin",
    title: "LuxeFlow Studio",
    subtitle: "Admin dashboard & commerce controls",
    href: "/studio",
    searchBlob: blob(["studio", "admin", "dashboard", "cms", "backend", "merchant"]),
    boost: 10
  });

  for (const item of shopMegaMenuCategories) {
    push(out, {
      id: `page-shop-cat-${item.label}`,
      group: "pages",
      title: `Shop · ${item.label}`,
      subtitle: "Category spotlight",
      href: item.href,
      searchBlob: blob(["shop", item.label, "category", "browse"])
    });
  }

  for (const item of storefrontNavShopDiscover) {
    push(out, {
      id: `page-discover-${String(item.href)}`,
      group: "pages",
      title: item.label,
      subtitle: "Navigation",
      href: item.href,
      searchBlob: blob([item.label, "discover", String(item.href)])
    });
  }

  push(out, {
    id: "page-featured-shop",
    group: "campaigns",
    title: storefrontNavShopFeatured.label,
    subtitle: storefrontNavShopFeatured.description,
    href: storefrontNavShopFeatured.href,
    searchBlob: blob([
      storefrontNavShopFeatured.label,
      storefrontNavShopFeatured.description,
      "featured",
      "shop",
      "bridal"
    ]),
    boost: 6
  });

  for (const cat of homeFeaturedCategories) {
    push(out, {
      id: `page-home-cat-${cat.title}`,
      group: "pages",
      title: `${cat.title} · homepage`,
      subtitle: cat.description,
      href: cat.href,
      searchBlob: blob([cat.title, cat.description, cat.highlight, "homepage", "featured"])
    });
  }

  for (const tile of homeTrustPoints) {
    push(out, {
      id: `page-trust-${tile.title}`,
      group: "pages",
      title: tile.title,
      subtitle: tile.cta,
      href: tile.href,
      searchBlob: blob([tile.title, tile.description, tile.cta])
    });
  }

  push(out, {
    id: "page-newsletter",
    group: "pages",
    title: "Newsletter signup",
    subtitle: "Early access & styling notes",
    href: "/#newsletter",
    searchBlob: blob(["newsletter", "subscribe", "email", "inner circle"])
  });

  // —— Products ——
  for (const p of catalogProducts) {
    push(out, {
      id: `product-${p.slug}`,
      group: "products",
      title: p.name,
      subtitle: [p.collection, p.material, p.price].filter(Boolean).join(" · "),
      href: `/product/${p.slug}`,
      searchBlob: blob([p.name, p.collection, p.material, p.tag, p.slug, "product", "piece"]),
      boost: p.tag === "Best Seller" ? 4 : p.tag === "New Arrival" ? 3 : 0
    });
  }

  for (const m of MATERIAL_QUERIES) {
    push(out, {
      id: `shortcut-material-${m.q}`,
      group: "products",
      title: m.label,
      subtitle: `Search catalog · “${m.q}”`,
      href: `/products?q=${encodeURIComponent(m.q)}`,
      searchBlob: blob([m.label, m.terms, "material", "filter", "search"])
    });
  }

  // —— Collections (named lines + homepage cards) ——
  const collectionNames = new Set<string>();
  for (const p of catalogProducts) collectionNames.add(p.collection);
  for (const row of homeFeaturedCollections) collectionNames.add(row.name);

  for (const name of collectionNames) {
    push(out, {
      id: `collection-${name.replace(/\s+/g, "-").toLowerCase()}`,
      group: "collections",
      title: name,
      subtitle: "Collection · search matching pieces",
      href: `/products?q=${encodeURIComponent(name)}`,
      searchBlob: blob([name, "collection", "capsule", "edit", "line"])
    });
  }

  for (const row of homeFeaturedCollections) {
    push(out, {
      id: `collection-card-${row.name}`,
      group: "collections",
      title: `${row.name} · ${row.season}`,
      subtitle: row.description,
      href: row.href,
      searchBlob: blob([row.name, row.season, row.description, "collection", "featured"]),
      boost: 5
    });
  }

  for (const a of categoryAnchors) {
    push(out, {
      id: `collection-anchor-${a.id}`,
      group: "collections",
      title: `${a.label} (category)`,
      subtitle: "Collections page · anchored section",
      href: `/collections#${a.id}`,
      searchBlob: blob([a.label, a.id, "category", "rings", "necklaces", "bracelets", "earrings"])
    });
  }

  // —— Campaigns (storefront) ——
  for (const c of campaignNavLinks) {
    push(out, {
      id: `campaign-nav-${c.href}`,
      group: "campaigns",
      title: c.label,
      subtitle: "Campaign landing",
      href: c.href,
      searchBlob: blob([c.label, "campaign", "landing", "promotion"]),
      boost: 8
    });
  }

  for (const c of seedCampaigns) {
    push(out, {
      id: `campaign-seed-${c.id}`,
      group: "campaigns",
      title: c.name,
      subtitle: c.summary,
      href: c.landingPage,
      searchBlob: blob([c.name, c.summary, c.status, "campaign", c.landingPage]),
      boost: c.status === "active" ? 6 : 2
    });
  }

  // —— Admin / studio ——
  for (const item of studioNavItems) {
    push(out, {
      id: `admin-nav-${item.href}`,
      group: "admin",
      title: item.label,
      subtitle: item.description,
      href: item.href,
      searchBlob: blob([item.label, item.description, "admin", "studio", item.href]),
      boost: item.href === "/studio" ? 8 : 4
    });
  }

  push(out, {
    id: "admin-design-system",
    group: "admin",
    title: "Design System",
    subtitle: "UI tokens, components, and patterns",
    href: "/studio/design-system",
    searchBlob: blob(["design system", "components", "tokens", "ui", "admin"])
  });

  for (const b of seedContentBlocks) {
    push(out, {
      id: `admin-block-${b.id}`,
      group: "admin",
      title: b.name,
      subtitle: `${b.type.replace(/-/g, " ")} · ${b.status} · Content blocks`,
      href: "/studio/content",
      searchBlob: blob([b.name, b.type, b.status, b.headline, b.body, b.page, "content block", "cms"])
    });
  }

  for (const t of emailTemplates) {
    push(out, {
      id: `admin-email-tpl-${t.id}`,
      group: "admin",
      title: `Email template · ${t.name}`,
      subtitle: t.description,
      href: "/studio/email-templates",
      searchBlob: blob([t.name, t.subject, t.description, "email", "template", t.id])
    });
  }

  for (const e of seedEmailCampaigns) {
    push(out, {
      id: `admin-email-camp-${e.id}`,
      group: "admin",
      title: e.name,
      subtitle: `${e.status} · ${e.subject}`,
      href: "/studio/email-templates",
      searchBlob: blob([e.name, e.subject, e.audienceSegment, "email", "campaign", "send"])
    });
  }

  for (const t of seedAbTests) {
    push(out, {
      id: `admin-ab-${t.id}`,
      group: "admin",
      title: `A/B test · ${t.name}`,
      subtitle: `${t.type} · ${t.status} · ${t.targetPage}`,
      href: "/studio/experiments",
      searchBlob: blob([
        t.name,
        t.type,
        t.status,
        t.targetPage,
        t.variantACopy,
        t.variantBCopy,
        "experiment",
        "ab test",
        "conversion"
      ])
    });
  }

  // Admin-side campaign records (studio list)
  for (const c of seedCampaigns) {
    push(out, {
      id: `admin-campaign-record-${c.id}`,
      group: "admin",
      title: `Campaign studio · ${c.name}`,
      subtitle: `Manage · ${c.status}`,
      href: "/studio/campaigns",
      searchBlob: blob([c.name, c.summary, "campaign studio", "marketing", c.status])
    });
  }

  return out;
}

let _cached: SearchIndexEntry[] | null = null;

export function getGlobalSearchIndex(): SearchIndexEntry[] {
  if (!_cached) _cached = buildSearchIndex();
  return _cached;
}

/** Default suggestions when the query is empty (ids must exist in index). */
export const POPULAR_SEARCH_ENTRY_IDS: string[] = [
  "page-home",
  "page-products",
  "page-collections",
  "campaign-nav-/c/spring-bridal-event",
  "product-luna-halo-ring",
  "page-studio",
  "admin-nav-/studio/content",
  "admin-nav-/studio/campaigns"
];
