import type { InventoryLowStockStatus } from "@prisma/client";

export function computeAvailableQuantity(stockQuantity: number, reservedQuantity: number): number {
  return Math.max(0, stockQuantity - reservedQuantity);
}

export function computeLowStockStatus(
  stockQuantity: number,
  reservedQuantity: number,
  reorderThreshold: number
): InventoryLowStockStatus {
  const available = computeAvailableQuantity(stockQuantity, reservedQuantity);
  if (stockQuantity <= 0 || available <= 0) return "OUT";
  if (available <= reorderThreshold) return "LOW";
  return "OK";
}
