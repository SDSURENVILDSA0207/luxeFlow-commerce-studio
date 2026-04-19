"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/contexts/cart-context";
import { cartLineKey, type CartLine } from "@/lib/storefront/cart";
import { cn } from "@/lib/utils/cn";

function CartLineRow({
  line,
  onRemove,
  onDec,
  onInc
}: {
  line: CartLine;
  onRemove: () => void;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <li className="flex gap-4 border-b border-border/80 py-5 first:pt-0 last:border-b-0">
      <Link
        href={`/product/${line.productId}` as Route}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-[#141016]"
      >
        <Image src={line.imageUrl} alt={line.name} fill sizes="80px" className="object-cover object-center" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          href={`/product/${line.productId}` as Route}
          className="font-medium text-foreground transition-colors hover:text-accent-soft"
        >
          {line.name}
        </Link>
        <p className="mt-1 text-body-sm text-muted">
          {line.material} · size {line.size}
        </p>
        <p className="mt-2 font-display text-body font-semibold text-foreground">{line.price}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-lg border border-border bg-surface-2">
            <button
              type="button"
              className="premium-ring flex h-9 min-w-9 items-center justify-center text-body-sm text-muted hover:text-foreground"
              aria-label="Decrease quantity"
              onClick={onDec}
            >
              −
            </button>
            <span className="min-w-[2rem] text-center text-body-sm tabular-nums text-foreground">{line.quantity}</span>
            <button
              type="button"
              className="premium-ring flex h-9 min-w-9 items-center justify-center text-body-sm text-muted hover:text-foreground"
              aria-label="Increase quantity"
              onClick={onInc}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="text-body-sm text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const pathname = usePathname();
  const { items, isOpen, closeCart, removeLine, setLineQuantity, subtotalLabel, totalItemCount } = useCart();

  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[90] bg-foreground/30 backdrop-blur-[2px]"
        aria-label="Close bag"
        onClick={closeCart}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={cn(
          "fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl",
          "motion-safe:animate-nav-sheet-in"
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="font-display text-lg text-foreground">Your bag</p>
            <p className="text-body-sm text-muted">
              {totalItemCount === 0 ? "Empty" : `${totalItemCount} ${totalItemCount === 1 ? "item" : "items"}`}
            </p>
          </div>
          <button
            type="button"
            className="premium-ring flex h-11 min-w-11 items-center justify-center rounded-lg text-muted hover:text-foreground"
            aria-label="Close bag"
            onClick={closeCart}
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-display text-xl text-foreground">Your bag is empty</p>
              <p className="mt-2 max-w-[18rem] text-body-sm text-muted">
                Explore the collection and add pieces you love — selections stay here until you are ready.
              </p>
              <Link
                href={"/products" as Route}
                className="premium-ring mt-8 inline-flex min-h-11 items-center justify-center rounded-lg border border-accent/50 bg-accent/15 px-6 text-body-sm font-semibold text-accent-soft transition-colors hover:bg-accent/25"
                onClick={closeCart}
              >
                Browse pieces
              </Link>
            </div>
          ) : (
            <ul className="pb-4">
              {items.map((line) => {
                const key = cartLineKey(line);
                return (
                  <CartLineRow
                    key={key}
                    line={line}
                    onRemove={() => removeLine(key)}
                    onDec={() => setLineQuantity(key, line.quantity - 1)}
                    onInc={() => setLineQuantity(key, line.quantity + 1)}
                  />
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-border bg-surface-2/40 px-5 py-5">
            <div className="flex items-center justify-between text-body">
              <span className="text-muted">Subtotal</span>
              <span className="font-display text-lg font-semibold text-foreground">{subtotalLabel}</span>
            </div>
            <p className="mt-2 text-body-sm text-muted">Shipping and taxes calculated at checkout.</p>
            <button
              type="button"
              className="premium-ring mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-accent/90 text-body font-semibold text-foreground shadow-premium-soft transition-[color,background-color,transform] hover:bg-accent active:translate-y-px"
              onClick={() => {
                /* demo storefront — no checkout route */
              }}
            >
              Checkout
            </button>
            <Link
              href={"/products" as Route}
              className="premium-ring mt-3 flex h-11 w-full items-center justify-center rounded-lg border border-border text-body-sm font-medium text-muted hover:text-foreground"
              onClick={closeCart}
            >
              Continue shopping
            </Link>
          </div>
        ) : null}
      </div>
    </>
  );
}
