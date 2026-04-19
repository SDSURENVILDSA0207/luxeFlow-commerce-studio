"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  campaignNavLinks,
  shopMegaMenuCategories,
  storefrontNavShopDiscover,
  storefrontNavShopFeatured
} from "@/lib/storefront/storefront-routes";
import {
  dropdownListLinkActiveClassName,
  dropdownListLinkClassName,
  dropdownMenuLinkClassName,
  dropdownPanelClassName,
  dropdownSectionLabelAccentClassName,
  dropdownSectionLabelClassName
} from "@/components/ui/dropdown-panel";
import { StudioBrandMark, JewelryAdminBrandMark } from "@/components/brand/brand-marks";
import { GlobalSearchPalette } from "@/components/search";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils/cn";

type OpenMenu = "none" | "shop" | "campaigns";
type MobileAccordion = "none" | "shop" | "campaigns";

const DROPDOWN_LEAVE_MS = 200;

/** Shop mega-menu only — solid surface, strong elevation (avoids hero bleed-through) */
const shopMegaMenuPanelClassName = cn(
  "overflow-hidden rounded-[0.875rem] border border-border-strong",
  "bg-surface text-foreground shadow-[0_24px_80px_-16px_rgba(0,0,0,0.62)]",
  "ring-1 ring-white/[0.07]"
);

const shopMegaMenuLinkClassName = cn(
  dropdownMenuLinkClassName,
  "rounded-lg px-3 py-3 text-[0.9375rem] leading-snug",
  "hover:bg-surface-2/95 active:bg-surface-3/80"
);

const shopMegaMenuSectionLabelClassName = cn(
  dropdownSectionLabelClassName,
  "mb-4 text-[0.68rem] tracking-[0.18em] text-muted"
);

function useDesktopHoverMenus() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return enabled;
}

function navLinkClass(active: boolean) {
  return cn(
    "rounded-lg px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-200",
    active ? "text-foreground" : "text-muted hover:text-foreground"
  );
}

function navMenuTriggerClass(open: boolean, extra?: string) {
  return cn(
    "premium-ring flex min-h-[2.75rem] items-center gap-1 rounded-lg px-2.5 py-2 text-[0.875rem] font-medium transition-[color,background-color,box-shadow] duration-200 sm:px-3 sm:text-[0.9375rem]",
    open
      ? "bg-surface-2 text-foreground shadow-sm ring-1 ring-border"
      : "text-muted hover:bg-surface-2/60 hover:text-foreground",
    extra
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 7V6a6 6 0 1 1 12 0v1h1.5a.75.75 0 0 1 .75.75v12.5a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2V7.75A.75.75 0 0 1 4.5 7H6Zm1.5 0h9V6a4.5 4.5 0 1 0-9 0v1Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function StorefrontNav() {
  const pathname = usePathname();
  const { totalItemCount, openCart } = useCart();
  const hoverMenus = useDesktopHoverMenus();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<OpenMenu>("none");
  const [mobileAccordion, setMobileAccordion] = useState<MobileAccordion>("none");
  const shopRef = useRef<HTMLDivElement>(null);
  const campaignsRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const closeMenus = useCallback(() => {
    clearLeaveTimer();
    setOpenMenu("none");
  }, [clearLeaveTimer]);

  const scheduleCloseMenus = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => setOpenMenu("none"), DROPDOWN_LEAVE_MS);
  }, [clearLeaveTimer]);

  const openShopMenu = useCallback(() => {
    clearLeaveTimer();
    setOpenMenu("shop");
  }, [clearLeaveTimer]);

  const openCampaignsMenu = useCallback(() => {
    clearLeaveTimer();
    setOpenMenu("campaigns");
  }, [clearLeaveTimer]);

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (openMenu === "none") return;

    const onDocClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (shopRef.current?.contains(target) || campaignsRef.current?.contains(target)) {
        return;
      }
      setOpenMenu("none");
    };

    const timeoutId = window.setTimeout(() => {
      document.addEventListener("click", onDocClick);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", onDocClick);
    };
  }, [openMenu]);

  useEffect(() => {
    if (openMenu === "none" && !mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu("none");
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openMenu, mobileOpen]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      closeMenus();
      setMobileOpen(false);
      setMobileAccordion("none");
    }, 0);
    return () => clearTimeout(id);
  }, [pathname, closeMenus]);

  const toggleDesktopMenu = (menu: Exclude<OpenMenu, "none">) => {
    clearLeaveTimer();
    setOpenMenu((m) => (m === menu ? "none" : menu));
  };

  const isCollectionsActive = pathname === "/collections";
  const isProductsActive = pathname === "/products";
  const isCampaignPath = pathname.startsWith("/c/");

  const toggleMobileAccordion = (key: MobileAccordion) => {
    setMobileAccordion((current) => (current === key ? "none" : key));
  };

  const shopHoverHandlers = hoverMenus
    ? {
        onMouseEnter: openShopMenu,
        onMouseLeave: scheduleCloseMenus
      }
    : {};

  const campaignsHoverHandlers = hoverMenus
    ? {
        onMouseEnter: openCampaignsMenu,
        onMouseLeave: scheduleCloseMenus
      }
    : {};

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.25rem] max-w-[1400px] items-center justify-between gap-2 px-4 sm:gap-4 sm:px-8">
        <Link href={"/" as Route} className="shrink-0 font-display tracking-wide text-[1.05rem] text-foreground sm:text-[1.15rem] md:text-xl">
          LuxeFlow
        </Link>

        <div className="mx-1 flex min-w-0 max-w-md flex-1 sm:mx-3">
          <GlobalSearchPalette variant="storefront" className="w-full min-w-0" />
        </div>

        <nav className="hidden shrink-0 items-center gap-0.5 lg:flex lg:gap-0 xl:gap-1" aria-label="Primary">
          <div ref={shopRef} className="relative" {...shopHoverHandlers}>
            <button
              type="button"
              className={navMenuTriggerClass(openMenu === "shop")}
              aria-expanded={openMenu === "shop"}
              aria-haspopup="true"
              aria-controls="nav-shop-panel"
              id="nav-shop-trigger"
              onClick={() => toggleDesktopMenu("shop")}
            >
              Shop
              <span
                className={cn("text-xs opacity-70 transition-transform duration-200", openMenu === "shop" && "rotate-180")}
                aria-hidden
              >
                ⌄
              </span>
            </button>
            {/* Right-align to Shop control so the panel grows left and stays inside the viewport (left-0 + wide width was clipping off-screen right). */}
            <div
              id="nav-shop-panel"
              role="region"
              aria-labelledby="nav-shop-trigger"
              hidden={openMenu !== "shop"}
              className={cn(
                "absolute right-0 left-auto top-full z-[200] flex max-w-[calc(100vw-1rem)] flex-col items-end pt-2 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                openMenu === "shop"
                  ? "visible translate-y-0 opacity-100"
                  : "invisible pointer-events-none -translate-y-0.5 opacity-0"
              )}
            >
              {/* Hover bridge: keeps pointer path continuous between trigger and panel */}
              <div className="h-2 w-full shrink-0" aria-hidden onMouseEnter={hoverMenus ? clearLeaveTimer : undefined} />
              <div
                className={cn(
                  "w-[min(40rem,calc(100vw-1rem))] max-w-full max-h-[min(78vh,34rem)] min-w-0",
                  shopMegaMenuPanelClassName
                )}
                onMouseEnter={hoverMenus ? clearLeaveTimer : undefined}
                onMouseLeave={hoverMenus ? scheduleCloseMenus : undefined}
              >
                <div className="grid max-h-[min(78vh,34rem)] grid-cols-1 overflow-y-auto overscroll-contain lg:max-h-none lg:grid-cols-[1fr_1fr_minmax(15.5rem,1.15fr)] lg:overflow-visible">
                  {/* Column 1 */}
                  <div className="min-w-0 border-border/50 px-6 py-7 lg:border-r lg:px-7 lg:py-8 xl:px-8">
                    <p className={shopMegaMenuSectionLabelClassName}>By category</p>
                    <ul className="flex flex-col gap-0.5">
                      {shopMegaMenuCategories.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href as Route} className={shopMegaMenuLinkClassName} onClick={closeMenus}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Column 2 */}
                  <div className="min-w-0 border-border/50 px-6 py-7 lg:border-r lg:px-7 lg:py-8 xl:px-8">
                    <p className={shopMegaMenuSectionLabelClassName}>Discover</p>
                    <ul className="flex flex-col gap-0.5">
                      {storefrontNavShopDiscover.map((item) => (
                        <li key={item.href}>
                          <Link href={item.href} className={shopMegaMenuLinkClassName} onClick={closeMenus}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Featured — full promo card */}
                  <div className="min-w-0 border-t border-border/40 bg-gradient-to-br from-surface-2 via-surface-2 to-surface px-6 py-7 lg:border-t-0 lg:px-7 lg:py-8 xl:px-8">
                    <div className="flex h-full min-h-[15rem] flex-col rounded-xl border border-border/60 bg-surface/95 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] lg:min-h-[17.5rem] lg:p-6">
                      <p className={cn(dropdownSectionLabelAccentClassName, "mb-3")}>Featured</p>
                      <Link
                        href={storefrontNavShopFeatured.href}
                        className="font-display text-[1.25rem] font-medium leading-snug tracking-tight text-foreground transition-colors duration-200 hover:text-accent-soft lg:text-[1.35rem]"
                        onClick={closeMenus}
                      >
                        {storefrontNavShopFeatured.label}
                      </Link>
                      <p className="mt-3 flex-1 text-body-sm leading-relaxed text-muted">{storefrontNavShopFeatured.description}</p>
                      <Link
                        href={storefrontNavShopFeatured.href}
                        className="mt-5 inline-flex items-center gap-1.5 self-start border-b border-accent-soft/35 pb-0.5 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-accent-soft transition-colors duration-200 hover:border-accent-soft hover:text-accent"
                        onClick={closeMenus}
                      >
                        View campaign
                        <span aria-hidden className="text-base leading-none">
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link href={"/collections" as Route} className={navLinkClass(isCollectionsActive)} onClick={closeMenus}>
            Collections
          </Link>
          <Link href={"/products" as Route} className={navLinkClass(isProductsActive)} onClick={closeMenus}>
            Pieces
          </Link>

          <div ref={campaignsRef} className="relative" {...campaignsHoverHandlers}>
            <button
              type="button"
              className={cn(
                navMenuTriggerClass(openMenu === "campaigns"),
                isCampaignPath && openMenu !== "campaigns" && "font-medium text-foreground"
              )}
              aria-expanded={openMenu === "campaigns"}
              aria-haspopup="true"
              aria-controls="nav-campaigns-panel"
              id="nav-campaigns-trigger"
              onClick={() => toggleDesktopMenu("campaigns")}
            >
              Campaigns
              <span
                className={cn("text-xs opacity-70 transition-transform duration-200", openMenu === "campaigns" && "rotate-180")}
                aria-hidden
              >
                ⌄
              </span>
            </button>
            <div
              id="nav-campaigns-panel"
              role="region"
              aria-labelledby="nav-campaigns-trigger"
              hidden={openMenu !== "campaigns"}
              className={cn(
                "absolute right-0 top-full z-[60] pt-0 transition-opacity duration-200 ease-out",
                openMenu === "campaigns" ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
              )}
            >
              <div className="h-2 w-full shrink-0" aria-hidden onMouseEnter={hoverMenus ? clearLeaveTimer : undefined} />
              <div
                className={cn(
                  "max-h-[min(70vh,24rem)] w-[min(18rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain p-1.5",
                  dropdownPanelClassName
                )}
                onMouseEnter={hoverMenus ? clearLeaveTimer : undefined}
                onMouseLeave={hoverMenus ? scheduleCloseMenus : undefined}
              >
                <ul className="space-y-0.5">
                  {campaignNavLinks.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href as Route}
                          className={cn(
                            dropdownListLinkClassName,
                            active && dropdownListLinkActiveClassName
                          )}
                          onClick={closeMenus}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="premium-ring relative flex h-11 min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-foreground"
            aria-label={totalItemCount > 0 ? `Open bag, ${totalItemCount} items` : "Open bag"}
            onClick={openCart}
          >
            <BagIcon />
            {totalItemCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex min-h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold tabular-nums leading-none text-foreground shadow-sm">
                {totalItemCount > 99 ? "99+" : totalItemCount}
              </span>
            ) : null}
          </button>
          <div className="hidden items-center gap-5 sm:flex">
            <Link
              href={"/studio" as Route}
              className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
              title="LuxeFlow Studio"
            >
              <StudioBrandMark className="h-[18px] w-[18px]" />
              <span>Studio</span>
            </Link>
            <Link
              href={"/admin/login" as Route}
              className="inline-flex max-w-[11rem] items-center gap-1.5 text-[0.75rem] font-medium uppercase tracking-[0.1em] text-muted transition-colors hover:text-foreground sm:max-w-none sm:text-[0.8125rem] sm:tracking-[0.12em]"
              title="Jewelry Admin — sign in required"
            >
              <JewelryAdminBrandMark className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
              <span className="leading-tight">Jewelry Admin</span>
            </Link>
          </div>
          <button
            type="button"
            className="premium-ring flex h-11 min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-lg border border-border text-muted lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="storefront-mobile-nav"
            aria-haspopup="dialog"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[65] bg-foreground/25 backdrop-blur-[2px] lg:hidden"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="storefront-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-y-0 right-0 z-[70] flex w-[min(100%,22.5rem)] flex-col border-l border-border bg-background shadow-xl motion-safe:animate-nav-sheet-in lg:hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="font-display text-lg text-foreground">Menu</p>
              <button
                type="button"
                className="premium-ring flex h-11 min-w-11 items-center justify-center rounded-lg text-muted hover:text-foreground"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <p className="mb-6 text-body-sm text-muted">
                Use the search control in the header (⌕ or <kbd className="rounded border border-border px-1 text-[0.7rem]">⌘</kbd>
                <kbd className="rounded border border-border px-1 text-[0.7rem]">K</kbd>) to search products, campaigns, and studio tools.
              </p>

              <div className="border-b border-border/80 pb-2">
                <button
                  type="button"
                  className="flex w-full min-h-[3rem] items-center justify-between gap-3 rounded-lg px-2 py-3 text-left text-[0.9375rem] font-semibold text-foreground"
                  aria-expanded={mobileAccordion === "shop"}
                  aria-controls="mobile-nav-shop-panel"
                  id="mobile-nav-shop-trigger"
                  onClick={() => toggleMobileAccordion("shop")}
                >
                  Shop
                  <span className="text-muted" aria-hidden>
                    {mobileAccordion === "shop" ? "⌃" : "⌄"}
                  </span>
                </button>
                <div
                  id="mobile-nav-shop-panel"
                  role="region"
                  aria-labelledby="mobile-nav-shop-trigger"
                  hidden={mobileAccordion !== "shop"}
                  className="pb-3 pl-1"
                >
                  <p className={cn("mt-2 px-2", dropdownSectionLabelClassName)}>By category</p>
                  <ul className="mt-2 space-y-1">
                    {shopMegaMenuCategories.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href as Route}
                          className="flex min-h-12 items-center rounded-lg px-3 text-body-sm font-medium text-foreground"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className={cn("mt-5 px-2", dropdownSectionLabelClassName)}>Discover</p>
                  <ul className="mt-2 space-y-1">
                    {storefrontNavShopDiscover.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex min-h-12 items-center rounded-lg px-3 text-body-sm font-medium text-foreground"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-lg border border-border/80 bg-surface-2/80 p-4">
                    <p className={dropdownSectionLabelAccentClassName}>Featured</p>
                    <Link
                      href={storefrontNavShopFeatured.href}
                      className="mt-2 block min-h-11 text-body font-medium text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {storefrontNavShopFeatured.label}
                    </Link>
                    <p className="mt-1 text-body-sm text-muted">{storefrontNavShopFeatured.description}</p>
                  </div>
                </div>
              </div>

              <div className="border-b border-border/80 py-2">
                <Link
                  href={"/collections" as Route}
                  className={cn(
                    "flex min-h-12 items-center rounded-lg px-2 text-[0.9375rem] font-semibold",
                    isCollectionsActive && "text-accent-soft"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  Collections
                </Link>
                <Link
                  href={"/products" as Route}
                  className={cn(
                    "flex min-h-12 items-center rounded-lg px-2 text-[0.9375rem] font-semibold",
                    isProductsActive && "text-accent-soft"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  Pieces
                </Link>
              </div>

              <div className="border-b border-border/80 pb-2 pt-2">
                <button
                  type="button"
                  className="flex w-full min-h-[3rem] items-center justify-between gap-3 rounded-lg px-2 py-3 text-left text-[0.9375rem] font-semibold text-foreground"
                  aria-expanded={mobileAccordion === "campaigns"}
                  aria-controls="mobile-nav-campaigns-panel"
                  id="mobile-nav-campaigns-trigger"
                  onClick={() => toggleMobileAccordion("campaigns")}
                >
                  Campaigns
                  <span className="text-muted" aria-hidden>
                    {mobileAccordion === "campaigns" ? "⌃" : "⌄"}
                  </span>
                </button>
                <div
                  id="mobile-nav-campaigns-panel"
                  role="region"
                  aria-labelledby="mobile-nav-campaigns-trigger"
                  hidden={mobileAccordion !== "campaigns"}
                  className="pb-3 pl-1"
                >
                  <ul className="mt-1 space-y-1">
                    {campaignNavLinks.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href as Route}
                            className={cn(
                              "flex min-h-12 items-center rounded-lg px-3 text-body-sm font-medium",
                              active ? "bg-surface-2 text-foreground" : "text-foreground"
                            )}
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-border/80 pt-6">
                <Link
                  href={"/studio" as Route}
                  className="inline-flex min-h-12 items-center gap-2 text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-muted"
                  title="LuxeFlow Studio"
                  onClick={() => setMobileOpen(false)}
                >
                  <StudioBrandMark className="h-5 w-5 shrink-0" />
                  Studio
                </Link>
                <Link
                  href={"/admin/login" as Route}
                  className="inline-flex min-h-12 items-center gap-2 text-[0.8125rem] font-medium uppercase tracking-[0.1em] text-muted"
                  title="Jewelry Admin — sign in required"
                  onClick={() => setMobileOpen(false)}
                >
                  <JewelryAdminBrandMark className="h-5 w-5 shrink-0" />
                  Jewelry Admin
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
