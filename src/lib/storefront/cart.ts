export type CartLine = {
  /** Stable catalog id — storefront uses product slug. */
  productId: string;
  name: string;
  price: string;
  imageUrl: string;
  material: string;
  size: string;
  quantity: number;
};

export function cartLineKey(line: Pick<CartLine, "productId" | "material" | "size">): string {
  return `${line.productId}::${line.material}::${line.size}`;
}

export function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.productId === "string" &&
    typeof o.name === "string" &&
    typeof o.price === "string" &&
    typeof o.imageUrl === "string" &&
    typeof o.material === "string" &&
    typeof o.size === "string" &&
    typeof o.quantity === "number" &&
    Number.isFinite(o.quantity) &&
    o.quantity >= 1 &&
    Number.isInteger(o.quantity)
  );
}
