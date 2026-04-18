/**
 * Normalizes user-entered destinations (CMS CTA URL, etc.) for safe navigation.
 * - Empty → catalog
 * - Already absolute (http(s), mailto, tel) → unchanged
 * - Hash-only (e.g. #newsletter) → `/#…` so it resolves on the storefront origin
 * - Relative path without leading slash → prefixed with /
 */
export function resolveUserFacingHref(raw?: string | null): string {
  const t = (raw ?? "").trim();
  if (!t) return "/products";
  if (/^(https?:|mailto:|tel:)/i.test(t)) return t;
  if (t.startsWith("/")) return t;
  if (t.startsWith("#")) return `/${t}`;
  return `/${t.replace(/^\/+/, "")}`;
}
