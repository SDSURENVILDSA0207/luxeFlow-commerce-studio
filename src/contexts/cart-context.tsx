"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { CartLine } from "@/lib/storefront/cart";
import {
  cartStoreAddItem,
  cartStoreRemoveLine,
  cartStoreSetLineQuantity,
  getCartServerSnapshot,
  getCartSnapshot,
  subscribeCart
} from "@/lib/storefront/cart-store";
import { parsePriceUsd } from "@/lib/storefront/products-catalog-data";

type CartContextValue = {
  items: CartLine[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (input: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  removeLine: (key: string) => void;
  setLineQuantity: (key: string, quantity: number) => void;
  totalItemCount: number;
  subtotalUsd: number;
  subtotalLabel: string;
};

const CartContext = createContext<CartContextValue | null>(null);

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribeCart, getCartSnapshot, getCartServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback((input: Omit<CartLine, "quantity"> & { quantity?: number }) => {
    cartStoreAddItem(input);
  }, []);

  const removeLine = useCallback((key: string) => {
    cartStoreRemoveLine(key);
  }, []);

  const setLineQuantity = useCallback((key: string, quantity: number) => {
    cartStoreSetLineQuantity(key, quantity);
  }, []);

  const totalItemCount = useMemo(() => items.reduce((sum, l) => sum + l.quantity, 0), [items]);

  const subtotalUsd = useMemo(
    () => items.reduce((sum, l) => sum + parsePriceUsd(l.price) * l.quantity, 0),
    [items]
  );

  const subtotalLabel = useMemo(() => formatUsd(subtotalUsd), [subtotalUsd]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeLine,
      setLineQuantity,
      totalItemCount,
      subtotalUsd,
      subtotalLabel
    }),
    [
      items,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeLine,
      setLineQuantity,
      totalItemCount,
      subtotalUsd,
      subtotalLabel
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
