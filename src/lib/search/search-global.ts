import { getAdminPageLocalEntries, normalizeAdminPathname } from "@/lib/search/admin-page-local-index";
import { getGlobalSearchIndex, POPULAR_SEARCH_ENTRY_IDS } from "@/lib/search/search-index";
import {
  SEARCH_GROUP_LABEL,
  SEARCH_GROUP_ORDER,
  type GroupedSearchResults,
  type ScoredSearchHit,
  type SearchIndexEntry
} from "@/lib/search/types";

export type { GroupedSearchResults, ScoredSearchHit } from "@/lib/search/types";
export { SEARCH_GROUP_LABEL, SEARCH_GROUP_ORDER };

type Entry = SearchIndexEntry;

/** Tie-break when scores are equal — page sections, then commerce, then narrative, then studio */
const GROUP_SORT_RANK: Record<Entry["group"], number> = {
  page: 6,
  products: 5,
  collections: 4,
  campaigns: 3,
  pages: 2,
  admin: 1
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Last path segment words for PDP / campaign slug matching */
function slugTextFromHref(href: string): string {
  try {
    const path = href.split("?")[0]?.split("#")[0] ?? "";
    const seg = path.split("/").filter(Boolean).pop() ?? "";
    return seg.replace(/-/g, " ");
  } catch {
    return "";
  }
}

function scoreMatch(query: string, entry: Entry): number {
  const q = normalize(query);
  if (!q.length) return (entry.boost ?? 0) + 1;

  const blob = entry.searchBlob;
  const title = normalize(entry.title);
  const sub = entry.subtitle ? normalize(entry.subtitle) : "";
  const slugText = normalize(slugTextFromHref(entry.href));
  const boost = entry.boost ?? 0;

  if (title === q) return 1000 + boost;
  if (blob === q) return 980 + boost;
  if (slugText && slugText.includes(q)) return 920 + boost;
  if (q.length >= 3 && slugText && slugText.startsWith(q)) return 900 + boost;

  if (title.startsWith(q)) return 860 + boost;
  if (title.includes(q)) return 780 + boost;

  try {
    const wordBoundary = new RegExp(`\\b${escapeRegExp(q)}`, "i");
    if (wordBoundary.test(entry.title)) return 820 + boost;
    if (sub && wordBoundary.test(entry.subtitle ?? "")) return 700 + boost;
  } catch {
    /* ignore */
  }

  const tokens = q.split(/\s+/).filter((t) => t.length > 0);
  if (tokens.length === 0) return 0;

  let matched = 0;
  let titleTokenHits = 0;
  let subTokenHits = 0;
  let allTokensInTitle = true;

  for (const t of tokens) {
    if (!blob.includes(t)) return 0;
    matched += 1;
    const inTitle = title.includes(t);
    const inSub = sub.includes(t);
    if (inTitle) titleTokenHits += 1;
    if (inSub) subTokenHits += 1;
    if (!inTitle) allTokensInTitle = false;
  }

  let base = 420 + matched * 25 + titleTokenHits * 45 + subTokenHits * 18;
  if (allTokensInTitle && tokens.length > 1) base += 80;
  if (sub && tokens.some((t) => sub.includes(t))) base += 35;

  const specificity = Math.max(0, 48 - Math.min(title.length * 0.08, 24));
  base += specificity;

  return base + boost;
}

function groupHitsFromScored(hits: ScoredSearchHit[]): GroupedSearchResults {
  const grouped: GroupedSearchResults = {};
  for (const h of hits) {
    const g = h.group;
    if (!grouped[g]) grouped[g] = [];
    grouped[g]!.push(h);
  }
  for (const g of SEARCH_GROUP_ORDER) {
    const arr = grouped[g];
    if (!arr) continue;
    arr.sort(
      (a, b) =>
        b.score - a.score ||
        GROUP_SORT_RANK[b.group] - GROUP_SORT_RANK[a.group] ||
        a.title.localeCompare(b.title)
    );
  }
  return grouped;
}

/** Re-group arbitrary hits (e.g. suggested / empty state) preserving per-group score order */
export function regroupHits(hits: ScoredSearchHit[]): GroupedSearchResults {
  return groupHitsFromScored(hits);
}

const popularSet = new Set(POPULAR_SEARCH_ENTRY_IDS);

function emptyQueryResults(limit: number): ScoredSearchHit[] {
  const index = getGlobalSearchIndex();
  const picks: ScoredSearchHit[] = [];
  for (const id of POPULAR_SEARCH_ENTRY_IDS) {
    const e = index.find((x) => x.id === id);
    if (e) picks.push({ ...e, score: 50 + (e.boost ?? 0) + (popularSet.has(e.id) ? 5 : 0) });
  }
  for (const e of index) {
    if (picks.length >= limit) break;
    if (picks.some((p) => p.id === e.id)) continue;
    if ((e.boost ?? 0) >= 8) picks.push({ ...e, score: 40 + (e.boost ?? 0) });
  }
  return picks.slice(0, limit);
}

function emptyPageLocalResults(index: SearchIndexEntry[], limit: number): ScoredSearchHit[] {
  return index.slice(0, limit).map((e) => ({ ...e, score: 52 + (e.boost ?? 0) }));
}

/**
 * Studio palette: default searches the current admin screen only.
 * Prefix with `>` or `storefront:` / `sf:`, or start with `storefront ` to search the full storefront + site index.
 */
export function parseStudioSearchQuery(raw: string): { mode: "page" | "global"; query: string } {
  const s = raw.trim();
  if (!s) return { mode: "page", query: "" };
  if (s.startsWith(">")) {
    return { mode: "global", query: s.slice(1).trim() };
  }
  const lower = s.toLowerCase();
  if (lower.startsWith("storefront:")) {
    return { mode: "global", query: s.slice("storefront:".length).trim() };
  }
  if (lower.startsWith("sf:")) {
    return { mode: "global", query: s.slice(3).trim() };
  }
  const firstSpace = s.indexOf(" ");
  if (firstSpace > 0) {
    const first = s.slice(0, firstSpace).toLowerCase();
    if (first === "storefront") {
      return { mode: "global", query: s.slice(firstSpace + 1).trim() };
    }
  }
  return { mode: "page", query: s };
}

export function searchStudio(pathname: string, rawQuery: string, limit = 48): GroupedSearchResults {
  const { mode, query } = parseStudioSearchQuery(rawQuery);
  if (mode === "global") {
    return searchGlobal(query, limit);
  }
  const index = getAdminPageLocalEntries(normalizeAdminPathname(pathname));
  const q = query.trim();
  let hits: ScoredSearchHit[];
  if (!q) {
    hits = emptyPageLocalResults(index, limit);
  } else {
    hits = index
      .map((e) => {
        const score = scoreMatch(q, e);
        return score > 0 ? ({ ...e, score } satisfies ScoredSearchHit) : null;
      })
      .filter((x): x is ScoredSearchHit => x !== null)
      .sort(
        (a, b) =>
          b.score - a.score ||
          (b.boost ?? 0) - (a.boost ?? 0) ||
          GROUP_SORT_RANK[b.group] - GROUP_SORT_RANK[a.group] ||
          a.title.length - b.title.length ||
          a.title.localeCompare(b.title)
      )
      .slice(0, limit);
  }
  return groupHitsFromScored(hits);
}

export function searchGlobal(query: string, limit = 48): GroupedSearchResults {
  const q = query.trim();
  const index = getGlobalSearchIndex();

  let hits: ScoredSearchHit[];

  if (!q) {
    hits = emptyQueryResults(limit);
  } else {
    hits = index
      .map((e) => {
        const score = scoreMatch(q, e);
        return score > 0 ? ({ ...e, score } satisfies ScoredSearchHit) : null;
      })
      .filter((x): x is ScoredSearchHit => x !== null)
      .sort(
        (a, b) =>
          b.score - a.score ||
          (b.boost ?? 0) - (a.boost ?? 0) ||
          GROUP_SORT_RANK[b.group] - GROUP_SORT_RANK[a.group] ||
          a.title.length - b.title.length ||
          a.title.localeCompare(b.title)
      )
      .slice(0, limit);
  }

  return groupHitsFromScored(hits);
}

export function flattenSearchResults(grouped: GroupedSearchResults): ScoredSearchHit[] {
  const out: ScoredSearchHit[] = [];
  for (const g of SEARCH_GROUP_ORDER) {
    const arr = grouped[g];
    if (arr) out.push(...arr);
  }
  return out;
}
