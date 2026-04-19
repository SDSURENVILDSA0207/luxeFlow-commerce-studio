import { cartLineKey, isCartLine, type CartLine } from "@/lib/storefront/cart";

const STORAGE_KEY = "luxeflow-storefront-cart-v1";

/** Stable snapshot for SSR / no-window — must not allocate a new [] per call (React useSyncExternalStore). */
const EMPTY_CART_SNAPSHOT: CartLine[] = [];

let cache: CartLine[] = [];
let listeners: Array<() => void> = [];
let clientCacheReady = false;

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

function persist(next: CartLine[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* quota / private mode */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function ensureClientCache() {
  if (typeof window === "undefined") return;
  if (!clientCacheReady) {
    cache = readStorage();
    clientCacheReady = true;
  }
}

export function getCartServerSnapshot(): CartLine[] {
  return EMPTY_CART_SNAPSHOT;
}

export function getCartSnapshot(): CartLine[] {
  if (typeof window === "undefined") return EMPTY_CART_SNAPSHOT;
  ensureClientCache();
  return cache;
}

export function subscribeCart(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  ensureClientCache();
  listeners.push(onStoreChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = readStorage();
    emit();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners = listeners.filter((fn) => fn !== onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function setCart(next: CartLine[]) {
  cache = next;
  persist(cache);
  emit();
}

export function cartStoreAddItem(input: Omit<CartLine, "quantity"> & { quantity?: number }) {
  ensureClientCache();
  const qty = input.quantity ?? 1;
  const base = { ...input, quantity: Math.max(1, Math.floor(qty)) };
  const key = cartLineKey(base);
  const idx = cache.findIndex((l) => cartLineKey(l) === key);
  if (idx >= 0) {
    const copy = [...cache];
    copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + base.quantity };
    setCart(copy);
    return;
  }
  setCart([...cache, base]);
}

export function cartStoreRemoveLine(key: string) {
  ensureClientCache();
  setCart(cache.filter((l) => cartLineKey(l) !== key));
}

export function cartStoreSetLineQuantity(key: string, quantity: number) {
  ensureClientCache();
  const q = Math.floor(quantity);
  if (q < 1) {
    setCart(cache.filter((l) => cartLineKey(l) !== key));
    return;
  }
  setCart(cache.map((l) => (cartLineKey(l) === key ? { ...l, quantity: q } : l)));
}
