"use client";

import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { dropdownPanelClassName } from "@/components/ui/dropdown-panel";
import { cn } from "@/lib/utils/cn";
import {
  flattenSearchResults,
  parseStudioSearchQuery,
  regroupHits,
  searchGlobal,
  searchStudio,
  SEARCH_GROUP_LABEL,
  SEARCH_GROUP_ORDER
} from "@/lib/search/search-global";
import { STUDIO_PAGE_SEARCH_UPDATE } from "@/lib/search/studio-page-search-events";
import type { GroupedSearchResults, ScoredSearchHit, SearchGroup } from "@/lib/search/types";

const RECENT_KEY = "luxeflow-global-search-recent";
const RECENT_MAX = 8;

const EMPTY_STATE_CHIPS = [
  { label: "Luna", q: "luna" },
  { label: "Bridal", q: "bridal" },
  { label: "Diamond", q: "diamond" },
  { label: "Studio", q: "studio" },
  { label: "Campaign", q: "campaign" }
] as const;

const STUDIO_PAGE_EMPTY_CHIPS = [
  { label: "Metrics", q: "revenue" },
  { label: "Momentum", q: "campaign" },
  { label: "Priorities", q: "today" },
  { label: "Sections", q: "page" }
] as const;

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string").slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  const t = q.trim();
  if (t.length < 2) return;
  if (typeof window === "undefined") return;
  const prev = loadRecent().filter((x) => x.toLowerCase() !== t.toLowerCase());
  prev.unshift(t);
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(prev.slice(0, RECENT_MAX)));
}

type GlobalSearchPaletteProps = {
  variant: "storefront" | "studio";
  className?: string;
  mobileBreakpointPx?: number;
};

export function GlobalSearchPalette({
  variant,
  className,
  mobileBreakpointPx = 768
}: GlobalSearchPaletteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const mobileShellRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFlat, setActiveFlat] = useState(-1);
  const [pointerArmed, setPointerArmed] = useState(false);
  const recent = useMemo(() => (open ? loadRecent() : []), [open]);
  const [isDesktop, setIsDesktop] = useState(true);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0, width: 400 });
  /** Bumps when Studio pages refresh local search index (runtime data). */
  const [studioPageSearchEpoch, setStudioPageSearchEpoch] = useState(0);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;

  const queryTrim = query.trim();

  useEffect(() => {
    if (variant !== "studio") return;
    const onUpdate = () => setStudioPageSearchEpoch((n) => n + 1);
    window.addEventListener(STUDIO_PAGE_SEARCH_UPDATE, onUpdate);
    return () => window.removeEventListener(STUDIO_PAGE_SEARCH_UPDATE, onUpdate);
  }, [variant]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${mobileBreakpointPx}px)`);
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [mobileBreakpointPx]);

  const grouped = useMemo(() => {
    if (variant === "studio") {
      return searchStudio(pathname ?? "/studio", query, 64);
    }
    return searchGlobal(query, 64);
  }, [variant, pathname, query, studioPageSearchEpoch]);

  const studioSearchScope = useMemo(
    () => (variant === "studio" ? parseStudioSearchQuery(queryTrim).mode : "global"),
    [variant, queryTrim]
  );
  const flat = useMemo(() => flattenSearchResults(grouped), [grouped]);

  const { displayRows, recentHits, groupedSuggested, hasQuery } = useMemo(() => {
    if (queryTrim.length > 0) {
      return {
        displayRows: flat,
        recentHits: [] as ScoredSearchHit[],
        groupedSuggested: null as GroupedSearchResults | null,
        hasQuery: true
      };
    }
    const recentList: ScoredSearchHit[] = [];
    for (const r of recent) {
      const found = flat.find(
        (h) => h.title.toLowerCase().includes(r.toLowerCase()) || h.searchBlob.includes(r.toLowerCase())
      );
      if (found && !recentList.some((x) => x.id === found.id)) recentList.push(found);
    }
    const rest = flat.filter((f) => !recentList.some((r) => r.id === f.id));
    const suggested = regroupHits(rest);
    const rows = [...recentList, ...flattenSearchResults(suggested)];
    return {
      displayRows: rows,
      recentHits: recentList,
      groupedSuggested: suggested,
      hasQuery: false
    };
  }, [queryTrim, flat, recent]);

  const activeIndex = useMemo(() => {
    if (displayRows.length === 0) return 0;
    if (activeFlat < 0) return 0;
    return Math.min(Math.max(0, activeFlat), displayRows.length - 1);
  }, [activeFlat, displayRows.length]);

  useLayoutEffect(() => {
    if (!open || displayRows.length === 0) return;
    const id = displayRows[activeIndex]?.id;
    if (!id) return;
    const el = document.getElementById(`global-search-opt-${id}`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex, open, displayRows]);

  const updatePanelPos = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 12;
    const width = Math.max(r.width, 320);
    let left = r.left;
    if (left + width > window.innerWidth - pad) left = Math.max(pad, window.innerWidth - width - pad);
    setPanelPos({ top: r.bottom + 8, left, width: Math.min(width, window.innerWidth - 2 * pad) });
  }, []);

  useLayoutEffect(() => {
    if (!open || !isDesktop) return;
    updatePanelPos();
    const onScroll = () => updatePanelPos();
    const onResize = () => updatePanelPos();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open, isDesktop, updatePanelPos]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      if (mobileShellRef.current?.contains(t)) return;
      setOpen(false);
    };
    const id = window.setTimeout(() => document.addEventListener("click", onDoc, true), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", onDoc, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const onPalette = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPointerArmed(false);
        setOpen(true);
        setActiveFlat(-1);
        window.setTimeout(() => inputRef.current?.focus(), 0);
      }
    };
    window.addEventListener("keydown", onPalette);
    return () => window.removeEventListener("keydown", onPalette);
  }, []);

  useEffect(() => {
    if (open && !isDesktop) {
      const tid = window.setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(tid);
    }
  }, [open, isDesktop]);

  const navigateTo = useCallback(
    (href: string, qForRecent: string) => {
      saveRecent(qForRecent);
      setOpen(false);
      setQuery("");
      if (href.startsWith("http") || href.startsWith("mailto:")) {
        window.location.href = href;
        return;
      }
      router.push(href as Route);
    },
    [router]
  );

  const onKeyDownInput = (e: React.KeyboardEvent) => {
    const len = displayRows.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!len) return;
      setActiveFlat((i) => (i < 0 ? 0 : Math.min(i + 1, len - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!len) return;
      setActiveFlat((i) => (i < 0 ? len - 1 : Math.max(i - 1, 0)));
    } else if (e.key === "Home") {
      e.preventDefault();
      if (len) setActiveFlat(0);
    } else if (e.key === "End") {
      e.preventDefault();
      if (len) setActiveFlat(len - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeFlat < 0) return;
      const hit = displayRows[activeIndex];
      if (hit) navigateTo(hit.href, query || hit.title);
    }
  };

  const studioChrome = variant === "studio";

  const inputClass = cn(
    "premium-ring min-w-0 w-full rounded-xl border px-3.5 text-body-sm outline-none transition-[border-color,box-shadow,background-color] duration-200",
    studioChrome
      ? "h-10 border-[#dfd3c4] bg-white text-[#2a2219] placeholder:text-[#857765]"
      : "h-10 border-border/90 bg-surface-2 text-foreground placeholder:text-muted/75",
    open && !studioChrome && "border-accent/50 shadow-[0_0_0_3px_rgba(196,165,116,0.15)]",
    open && studioChrome && "border-[#c9a66b] shadow-[0_0_0_3px_rgba(201,166,107,0.18)]"
  );

  const activeOptionId =
    activeFlat >= 0 && displayRows[activeIndex] != null ? `global-search-opt-${displayRows[activeIndex].id}` : undefined;

  const panelShellClass = cn(
    "flex max-h-[min(72vh,30rem)] flex-col overflow-hidden rounded-xl border shadow-[0_24px_80px_-16px_rgba(0,0,0,0.55)] motion-safe:animate-menu-pop",
    studioChrome
      ? "border-[#e0d3c3] bg-white text-[#2a2219] ring-1 ring-black/[0.04]"
      : cn(
          dropdownPanelClassName,
          "border-border-strong ring-1 ring-white/[0.06]",
          "shadow-[0_24px_80px_-16px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)]"
        )
  );

  const resultsScrollClass = cn(
    "max-h-[min(72vh,30rem)] min-h-[10rem] overflow-y-auto overscroll-contain px-1.5 py-2",
    studioChrome ? "bg-white" : "bg-surface/[0.99]"
  );

  const panelInner = (
    <div
      ref={listRef}
      id={listboxId}
      role="listbox"
      aria-label="Search results"
      className={panelShellClass}
    >
      <div
        className={resultsScrollClass}
        onMouseMove={() => setPointerArmed(true)}
        onTouchStart={() => setPointerArmed(true)}
      >
        {studioChrome && studioSearchScope === "global" ? (
          <div
            className={cn(
              "mb-2 rounded-lg border px-3 py-2 text-[0.7rem] leading-snug",
              "border-[#efe6dc] bg-[#fbf7f1] text-[#6f6151]"
            )}
          >
            Searching the full catalog and site. Remove <kbd className="rounded border border-[#dfd3c4] bg-white px-1 font-mono">&gt;</kbd>{" "}
            or the <span className="font-medium">storefront</span> prefix to search this screen only.
          </div>
        ) : null}
        {displayRows.length === 0 && queryTrim.length > 0 ? (
          <EmptyState
            studio={studioChrome}
            searchScope={studioSearchScope}
            query={queryTrim}
            onChip={(q) => {
              setQuery(q);
              setActiveFlat(0);
            }}
          />
        ) : (
          <SearchResultTree
            hasQuery={hasQuery}
            grouped={grouped}
            groupedSuggested={groupedSuggested}
            recentHits={recentHits}
            displayRows={displayRows}
            activeFlat={activeIndex}
            studio={studioChrome}
            enableHover={pointerArmed}
            onPick={(href) => navigateTo(href, query || "")}
          />
        )}
      </div>
      <KeyboardHints studio={studioChrome} showPageScopeHint={variant === "studio"} />
    </div>
  );

  const panelDesktop =
    open && isDesktop && typeof document !== "undefined"
      ? createPortal(
          <div
            style={{
              position: "fixed",
              top: panelPos.top,
              left: panelPos.left,
              width: panelPos.width,
              zIndex: 110
            }}
            className="pointer-events-auto"
          >
            {panelInner}
          </div>,
          document.body
        )
      : null;

  const panelMobile =
    open && !isDesktop && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={mobileShellRef}
            className={cn(
              "fixed inset-0 z-[110] flex flex-col backdrop-blur-xl",
              studioChrome ? "bg-[#f9f5ee]/[0.98]" : "bg-[#0e0c11]/90"
            )}
            style={{
              paddingTop: "max(0.75rem, env(safe-area-inset-top))",
              paddingBottom: "env(safe-area-inset-bottom)"
            }}
          >
            <div
              className={cn(
                "flex shrink-0 items-center gap-2 border-b px-4 pb-3 pt-1",
                studioChrome ? "border-[#e7dfd3] bg-[#fbf7f1]/95" : "border-border/80 bg-background/90"
              )}
            >
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[0.65rem] font-semibold uppercase tracking-[0.16em]",
                    studioChrome ? "text-[#9b7b4b]" : "text-accent-soft"
                  )}
                >
                  Search
                </p>
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveFlat(0);
                  }}
                  onKeyDown={onKeyDownInput}
                  placeholder={variant === "studio" ? "This page…" : "Pieces, campaigns, studio…"}
                  className={cn(inputClass, "mt-1.5 w-full")}
                  role="combobox"
                  aria-controls={listboxId}
                  aria-expanded={open}
                  aria-autocomplete="list"
                  aria-activedescendant={open ? activeOptionId : undefined}
                  autoComplete="off"
                  autoCorrect="off"
                  enterKeyHint="search"
                />
              </div>
              <button
                type="button"
                className={cn(
                  "premium-ring mt-5 shrink-0 rounded-xl border px-3.5 py-2 text-body-sm font-medium transition-colors",
                  studioChrome
                    ? "border-[#dfd3c4] bg-white text-[#6f6151] hover:bg-[#f5efe6]"
                    : "border-border bg-surface-2 text-muted hover:border-accent/35 hover:text-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3">{panelInner}</div>
          </div>,
          document.body
        )
      : null;

  const openMobileSearch = () => {
    setPointerArmed(false);
    setOpen(true);
    setActiveFlat(-1);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const triggerClass = cn(
    "premium-ring inline-flex h-10 min-w-10 items-center justify-center rounded-xl border text-body-sm transition-all duration-200",
    studioChrome
      ? "border-[#dfd3c4] bg-white text-[#6f6151] shadow-sm hover:border-[#c9a66b] hover:shadow-md active:scale-[0.98]"
      : "border-border/90 bg-surface-2 text-muted shadow-sm hover:border-accent/45 hover:text-foreground hover:shadow-md active:scale-[0.98]"
  );

  return (
    <div ref={rootRef} className={cn("relative min-w-0", className)}>
      {isDesktop ? (
        <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveFlat(-1);
            }}
            onKeyDown={onKeyDownInput}
            onFocus={() => {
              setPointerArmed(false);
              setOpen(true);
              setActiveFlat(-1);
            }}
            placeholder={studioChrome ? "Search this page…" : "Search pieces, campaigns, studio…"}
            title={
              studioChrome
                ? "This page only. Prefix with > or storefront for catalog & site search."
                : undefined
            }
            aria-label={studioChrome ? "Search sections on this admin page" : "Global search"}
            aria-controls={listboxId}
            aria-expanded={open}
            aria-autocomplete="list"
            aria-activedescendant={open ? activeOptionId : undefined}
            role="combobox"
            autoComplete="off"
            autoCorrect="off"
            className={cn(inputClass, "min-w-0")}
          />
          <span
            className={cn(
              "pointer-events-none hidden rounded-md border px-1.5 py-0.5 font-mono text-[0.65rem] lg:inline",
              studioChrome
                ? "border-[#dfd3c4] bg-white text-[#857765]"
                : "border-border/60 bg-surface-2/80 text-muted/90"
            )}
            aria-hidden
          >
            ⌘K
          </span>
        </div>
      ) : (
        <button type="button" className={triggerClass} aria-label="Open search" onClick={openMobileSearch}>
          <span className="text-lg" aria-hidden>
            ⌕
          </span>
          <span className="sr-only">Search</span>
        </button>
      )}
      {panelDesktop}
      {panelMobile}
    </div>
  );
}

function KeyboardHints({ studio, showPageScopeHint }: { studio: boolean; showPageScopeHint?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-2 border-t px-3 py-2.5 text-[0.68rem] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between",
        studio ? "border-[#efe6dc] bg-[#fbf7f1] text-[#857765]" : "border-border/80 bg-surface-2/95 text-muted"
      )}
    >
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Kbd studio={studio}>↑</Kbd>
        <Kbd studio={studio}>↓</Kbd>
        <span className="opacity-90">move</span>
        <span className="opacity-40" aria-hidden>
          ·
        </span>
        <Kbd studio={studio}>↵</Kbd>
        <span className="opacity-90">open</span>
        <span className="opacity-40" aria-hidden>
          ·
        </span>
        <Kbd studio={studio}>esc</Kbd>
        <span className="opacity-90">close</span>
      </span>
      <span className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:justify-end">
        {showPageScopeHint ? (
          <>
            <Kbd studio={studio}>&gt;</Kbd>
            <span className="opacity-90">storefront</span>
            <span className="opacity-40" aria-hidden>
              ·
            </span>
          </>
        ) : null}
        <span className="hidden items-center gap-0.5 sm:inline-flex">
          <Kbd studio={studio}>⌘</Kbd>
          <Kbd studio={studio}>K</Kbd>
          <span className="opacity-90">palette</span>
        </span>
      </span>
    </div>
  );
}

function Kbd({ children, studio }: { children: React.ReactNode; studio: boolean }) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-[1.35rem] items-center justify-center rounded border px-1 py-px font-mono text-[0.65rem]",
        studio ? "border-[#dfd3c4] bg-white text-[#5c4f42]" : "border-border/70 bg-surface-3/80 text-foreground/85"
      )}
    >
      {children}
    </kbd>
  );
}

function EmptyState({
  studio,
  searchScope,
  query,
  onChip
}: {
  studio: boolean;
  searchScope: "page" | "global";
  query: string;
  onChip: (q: string) => void;
}) {
  const chips = studio && searchScope === "page" ? STUDIO_PAGE_EMPTY_CHIPS : EMPTY_STATE_CHIPS;
  const hint =
    studio && searchScope === "page"
      ? "Try a section title, metric, or task on this screen. Prefix with > or storefront to search products and the live site."
      : "Try a product name, collection, material, campaign, or a studio tool like Content or Campaigns.";

  return (
    <div className="flex flex-col items-center px-4 py-12 text-center">
      <div
        className={cn(
          "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl",
          studio ? "border-[#efe6dc] bg-[#fbf7f1] text-[#9b7b4b]" : "border-border/80 bg-surface-2/90 text-accent-soft"
        )}
        aria-hidden
      >
        ⌕
      </div>
      <p className={cn("text-heading-md font-display", studio ? "text-[#281f17]" : "text-foreground")}>
        No results for “{query}”
      </p>
      <p className={cn("mt-2 max-w-sm text-body-sm", studio ? "text-[#857765]" : "text-muted")}>{hint}</p>
      <p
        className={cn(
          "mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.16em]",
          studio ? "text-[#9b7b4b]" : "text-accent-soft"
        )}
      >
        Try searching
      </p>
      <div className="mt-3 flex max-w-md flex-wrap justify-center gap-2">
        {chips.map((c) => (
          <button
            key={c.q}
            type="button"
            onClick={() => onChip(c.q)}
            className={cn(
              "premium-ring rounded-full border px-3.5 py-1.5 text-body-sm transition-colors duration-150",
              studio
                ? "border-[#dfd3c4] bg-white text-[#4c3f30] hover:border-[#c9a66b]"
                : "border-border/80 bg-surface-2/90 text-foreground/90 hover:border-accent/40 hover:bg-surface-3/80"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SearchResultTree({
  hasQuery,
  grouped,
  groupedSuggested,
  recentHits,
  displayRows,
  activeFlat,
  studio,
  enableHover,
  onPick
}: {
  hasQuery: boolean;
  grouped: GroupedSearchResults;
  groupedSuggested: GroupedSearchResults | null;
  recentHits: ScoredSearchHit[];
  displayRows: ScoredSearchHit[];
  activeFlat: number;
  studio: boolean;
  enableHover: boolean;
  onPick: (href: string) => void;
}) {
  if (hasQuery) {
    return (
      <GroupedSections
        grouped={grouped}
        activeFlat={activeFlat}
        displayRows={displayRows}
        studio={studio}
        enableHover={enableHover}
        onPick={onPick}
      />
    );
  }

  const blocks: ReactNode[] = [];

  if (recentHits.length > 0) {
    blocks.push(
      <section key="recent" className="mb-4">
        <GroupHeader studio={studio} icon="↻" label="Recent" />
        <ul className="space-y-1">
          {recentHits.map((hit, i) => (
            <ResultRow
              key={hit.id}
              hit={hit}
              active={activeFlat === i}
              studio={studio}
              enableHover={enableHover}
              onPick={() => onPick(hit.href)}
            />
          ))}
        </ul>
      </section>
    );
  }

  if (groupedSuggested) {
    blocks.push(
      <GroupedSections
        key="suggested"
        grouped={groupedSuggested}
        activeFlat={activeFlat}
        displayRows={displayRows}
        studio={studio}
        enableHover={enableHover}
        onPick={onPick}
      />
    );
  }

  return <div className="space-y-1">{blocks}</div>;
}

function GroupedSections({
  grouped,
  activeFlat,
  displayRows,
  studio,
  enableHover,
  onPick
}: {
  grouped: GroupedSearchResults;
  activeFlat: number;
  displayRows: ScoredSearchHit[];
  studio: boolean;
  enableHover: boolean;
  onPick: (href: string) => void;
}) {
  return (
    <div className="space-y-5">
      {SEARCH_GROUP_ORDER.map((group) => {
        const rows = grouped[group];
        if (!rows?.length) return null;
        return (
          <section key={group} className="scroll-mt-2">
            <GroupHeader studio={studio} icon={groupIcon(group)} label={SEARCH_GROUP_LABEL[group]} />
            <ul className="space-y-1">
              {rows.map((hit) => (
                <ResultRow
                  key={hit.id}
                  hit={hit}
                  active={displayRows[activeFlat]?.id === hit.id}
                  studio={studio}
                  enableHover={enableHover}
                  onPick={() => onPick(hit.href)}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function GroupHeader({ label, icon, studio }: { label: string; icon: string; studio: boolean }) {
  return (
    <div
      className={cn(
        "mb-2 flex items-center gap-2 px-2 pt-1",
        studio ? "text-[#9b7b4b]" : "text-accent-soft"
      )}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.7rem] opacity-95" aria-hidden>
        {icon}
      </span>
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em]">{label}</span>
      <span className={cn("h-px min-w-[1rem] flex-1", studio ? "bg-[#efe6dc]" : "bg-border/70")} aria-hidden />
    </div>
  );
}

function ResultRow({
  hit,
  active,
  studio,
  enableHover,
  onPick
}: {
  hit: ScoredSearchHit;
  active: boolean;
  studio: boolean;
  enableHover: boolean;
  onPick: () => void;
}) {
  return (
    <li role="option" aria-selected={active} id={`global-search-opt-${hit.id}`}>
      <button
        type="button"
        className={cn(
          "group relative flex w-full min-w-0 items-stretch gap-0 overflow-hidden rounded-xl text-left transition-[background-color,box-shadow,transform] duration-150 ease-out",
          studio
            ? active
              ? "bg-[#efe6dc] shadow-[inset_3px_0_0_0_#c9a66b]"
              : cn(
                  enableHover && "hover:bg-[#f8f2ea] hover:shadow-[inset_2px_0_0_0_rgba(201,166,107,0.65)]",
                  "active:scale-[0.995]"
                )
            : active
              ? "bg-surface-2 shadow-[inset_3px_0_0_0_rgba(196,165,116,0.85)]"
              : cn(
                  enableHover && "hover:bg-surface-2 hover:shadow-[inset_3px_0_0_0_rgba(196,165,116,0.85)]",
                  "active:scale-[0.995] motion-reduce:transform-none"
                )
        )}
        onMouseDown={(e) => e.preventDefault()}
        onClick={onPick}
      >
        <span
          className={cn(
            "w-[3px] shrink-0 self-stretch transition-colors duration-150",
            studio
              ? active
                ? "bg-[#c9a66b]"
                : cn("bg-transparent", enableHover && "group-hover:bg-[#dfc7a2]/55")
              : active
                ? "bg-accent"
                : cn("bg-transparent", enableHover && "group-hover:bg-accent/35")
          )}
          aria-hidden
        />
        <span className="flex min-w-0 flex-1 items-start gap-3 px-3 py-2.5">
          <span
            className={cn(
              "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-[0.8rem] transition-colors duration-150",
              studio
                ? active
                  ? "border-[#dfd3c4] bg-white text-[#9b7b4b]"
                  : cn(
                      "border-[#efe6dc] bg-[#fbf7f1] text-[#b39a72]",
                      enableHover && "group-hover:border-[#d7c5ab] group-hover:bg-white group-hover:text-[#9b7b4b]"
                    )
                : active
                  ? "border-border-strong bg-surface-3 text-accent-soft"
                  : cn(
                      "border-border/70 bg-surface-2/80 text-muted",
                      enableHover && "group-hover:border-border-strong group-hover:bg-surface-3 group-hover:text-accent-soft"
                    )
            )}
            aria-hidden
          >
            {groupIcon(hit.group)}
          </span>
          <span className="min-w-0 flex-1 pb-0.5 pt-0.5">
            <span
              className={cn(
                "block text-[0.9375rem] font-medium leading-snug tracking-tight transition-colors duration-150",
                studio
                  ? cn("text-[#281f17]", enableHover && "group-hover:text-[#2f241a]")
                  : "text-foreground"
              )}
            >
              {hit.title}
            </span>
            {hit.subtitle ? (
              <span
                className={cn(
                  "mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed transition-colors duration-150",
                  studio
                    ? cn("text-[#6f6151]", enableHover && "group-hover:text-[#5a4d3e]")
                    : "text-muted"
                )}
              >
                {hit.subtitle}
              </span>
            ) : null}
            <span
              className={cn(
                "mt-2 inline-flex rounded-md border px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-150",
                studio
                  ? cn(
                      "border-[#efe6dc] text-[#9b7b4b]",
                      enableHover && "group-hover:border-[#d7c5ab] group-hover:bg-white/80"
                    )
                  : cn(
                      "border-border/60 text-accent-soft/95",
                      enableHover && "group-hover:border-border-strong group-hover:bg-surface-3/90 group-hover:text-accent-soft"
                    )
              )}
            >
              {SEARCH_GROUP_LABEL[hit.group]}
            </span>
          </span>
        </span>
      </button>
    </li>
  );
}

function groupIcon(group: SearchGroup): string {
  switch (group) {
    case "page":
      return "⌖";
    case "products":
      return "◆";
    case "collections":
      return "◇";
    case "campaigns":
      return "✦";
    case "pages":
      return "⌁";
    case "admin":
      return "⚙";
    default:
      return "·";
  }
}
