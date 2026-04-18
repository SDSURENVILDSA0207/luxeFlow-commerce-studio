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
import { cn } from "@/lib/utils/cn";

type OpenMenu = "none" | "shop" | "campaigns";
type MobileAccordion = "none" | "shop" | "campaigns";

const DROPDOWN_LEAVE_MS = 200;

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

function dropdownItemClass() {
  return "block min-h-[2.75rem] rounded-md px-2 py-2.5 text-body-sm leading-snug text-foreground transition-colors hover:bg-surface-2 hover:text-foreground";
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

export function StorefrontNav() {
  const pathname = usePathname();
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
    closeMenus();
    setMobileOpen(false);
    setMobileAccordion("none");
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

        <form
          action="/products"
          method="get"
          role="search"
          className="mx-1 hidden min-w-0 max-w-md flex-1 sm:mx-3 md:flex"
        >
          <input
            type="search"
            name="q"
            placeholder="Search pieces, materials…"
            aria-label="Search products"
            className="premium-ring h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-body-sm text-foreground placeholder:text-muted/75"
          />
        </form>

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
            <div
              id="nav-shop-panel"
              role="region"
              aria-labelledby="nav-shop-trigger"
              hidden={openMenu !== "shop"}
              className={cn(
                "absolute left-0 top-full z-[60] max-w-[calc(100vw-1.5rem)] pt-0 transition-opacity duration-200",
                openMenu === "shop" ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
              )}
            >
              <div className="h-2 w-full shrink-0" aria-hidden onMouseEnter={hoverMenus ? clearLeaveTimer : undefined} />
              <div
                className="grid max-h-[min(70vh,32rem)] w-[min(36rem,calc(100vw-1.5rem))] grid-cols-1 overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-5 shadow-premium sm:p-7 md:grid-cols-3 md:gap-6"
                onMouseEnter={hoverMenus ? clearLeaveTimer : undefined}
                onMouseLeave={hoverMenus ? scheduleCloseMenus : undefined}
              >
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">By category</p>
                  <ul className="mt-3 space-y-0.5">
                    {shopMegaMenuCategories.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href as Route} className={dropdownItemClass()} onClick={closeMenus}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">Discover</p>
                  <ul className="mt-3 space-y-0.5">
                    {storefrontNavShopDiscover.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className={dropdownItemClass()} onClick={closeMenus}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-border/80 bg-surface-2/80 p-4 md:min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">Featured</p>
                  <Link
                    href={storefrontNavShopFeatured.href}
                    className="mt-2 block text-heading-md text-foreground transition-colors hover:text-accent-soft"
                    onClick={closeMenus}
                  >
                    {storefrontNavShopFeatured.label}
                  </Link>
                  <p className="mt-1 text-body-sm text-muted">{storefrontNavShopFeatured.description}</p>
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
                "absolute right-0 top-full z-[60] pt-0 transition-opacity duration-200",
                openMenu === "campaigns" ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
              )}
            >
              <div className="h-2 w-full shrink-0" aria-hidden onMouseEnter={hoverMenus ? clearLeaveTimer : undefined} />
              <div
                className="max-h-[min(70vh,24rem)] w-[min(18rem,calc(100vw-1.5rem))] overflow-y-auto overscroll-contain rounded-xl border border-border bg-surface p-2 shadow-premium"
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
                            "block min-h-[2.75rem] rounded-lg px-3 py-2.5 text-body-sm transition-colors",
                            active ? "bg-surface-2 font-medium text-foreground" : "text-foreground/90 hover:bg-surface-2"
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
          <Link
            href={"/admin" as Route}
            className="hidden text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground sm:inline"
          >
            Studio
          </Link>
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
              <form action="/products" method="get" role="search" className="mb-6">
                <input
                  type="search"
                  name="q"
                  placeholder="Search pieces…"
                  aria-label="Search products"
                  className="premium-ring h-12 w-full rounded-lg border border-border bg-surface-2 px-3 text-body-sm text-foreground placeholder:text-muted/75"
                />
              </form>

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
                  <p className="mt-2 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">By category</p>
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
                  <p className="mt-5 px-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-muted">Discover</p>
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
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">Featured</p>
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

              <Link
                href={"/admin" as Route}
                className="mt-6 inline-flex min-h-12 items-center text-[0.8125rem] font-medium uppercase tracking-[0.12em] text-muted"
                onClick={() => setMobileOpen(false)}
              >
                Studio
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </header>
  );
}
