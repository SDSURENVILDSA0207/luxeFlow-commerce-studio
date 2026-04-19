/**
 * Global command search — shared types for the storefront + studio index.
 */

export type SearchGroup = "page" | "products" | "collections" | "campaigns" | "pages" | "admin";

export type SearchIndexEntry = {
  /** Stable id for deduping / popular picks */
  id: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  /** Absolute app path or external URL */
  href: string;
  /** Normalized bag used for matching (lowercase tokens). Built at index time. */
  searchBlob: string;
  /** Optional relevance boost when query is empty or ties */
  boost?: number;
};

export type ScoredSearchHit = SearchIndexEntry & { score: number };

export type GroupedSearchResults = Partial<Record<SearchGroup, ScoredSearchHit[]>>;

export const SEARCH_GROUP_ORDER: SearchGroup[] = [
  "page",
  "products",
  "collections",
  "campaigns",
  "pages",
  "admin"
];

export const SEARCH_GROUP_LABEL: Record<SearchGroup, string> = {
  page: "This page",
  products: "Products",
  collections: "Collections",
  campaigns: "Campaigns",
  pages: "Pages & navigation",
  admin: "Studio & admin"
};
