import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { badRequest, notFound, unauthorized } from "@/lib/api/jewelry-admin-response";
import { computeLowStockStatus } from "@/lib/jewelry-inventory/stock-status";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { TradeOrderStatus } from "@prisma/client";

const patchSchema = z.object({
  status: z.enum(["DRAFT", "CONFIRMED", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
  fulfillmentStatus: z.enum(["UNFULFILLED", "PARTIAL", "FULFILLED"]).optional(),
  notes: z.string().nullable().optional()
});

type Params = { params: Promise<{ id: string }> };

function hadReservation(status: TradeOrderStatus) {
  return status === "CONFIRMED" || status === "IN_PRODUCTION" || status === "SHIPPED" || status === "DELIVERED";
}

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const order = await prisma.tradeOrder.findUnique({
    where: { id },
    include: {
      customer: true,
      quote: true,
      lines: { include: { inventoryItem: true } }
    }
  });
  if (!order) return notFound();
  return NextResponse.json({ order });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const d = parsed.data;

  const updated = await prisma.$transaction(async (tx) => {
    const prev = await tx.tradeOrder.findUnique({
      where: { id },
      include: { lines: true }
    });
    if (!prev) return null;

    const nextStatus = d.status ?? prev.status;
    const prevStatus = prev.status;

    if (d.status !== undefined && d.status !== prevStatus) {
      const movingToConfirmed = prevStatus === "DRAFT" && nextStatus === "CONFIRMED";
      const movingToShipped =
        (nextStatus === "SHIPPED" || nextStatus === "DELIVERED") &&
        prevStatus !== "SHIPPED" &&
        prevStatus !== "DELIVERED";

      if (movingToConfirmed) {
        for (const line of prev.lines) {
          const item = await tx.jewelryInventoryItem.findUnique({ where: { id: line.inventoryItemId } });
          if (!item) continue;
          const reserved = item.reservedQuantity + line.quantity;
          const low = computeLowStockStatus(item.stockQuantity, reserved, item.reorderThreshold);
          await tx.jewelryInventoryItem.update({
            where: { id: item.id },
            data: { reservedQuantity: reserved, lowStockStatus: low }
          });
        }
      }

      if (movingToShipped) {
        const fromReserved = hadReservation(prevStatus);
        for (const line of prev.lines) {
          const item = await tx.jewelryInventoryItem.findUnique({ where: { id: line.inventoryItemId } });
          if (!item) continue;
          const qty = line.quantity;
          let newStock = item.stockQuantity;
          let newReserved = item.reservedQuantity;

          if (fromReserved) {
            newStock = Math.max(0, item.stockQuantity - qty);
            newReserved = Math.max(0, item.reservedQuantity - qty);
          } else {
            newStock = Math.max(0, item.stockQuantity - qty);
          }

          const low = computeLowStockStatus(newStock, newReserved, item.reorderThreshold);
          await tx.jewelryInventoryItem.update({
            where: { id: item.id },
            data: {
              stockQuantity: newStock,
              reservedQuantity: newReserved,
              lowStockStatus: low
            }
          });
          await tx.tradeOrderLine.update({
            where: { id: line.id },
            data: { quantityFulfilled: qty }
          });
        }
      }
    }

    let fulfillment = prev.fulfillmentStatus;
    if (d.fulfillmentStatus !== undefined) {
      fulfillment = d.fulfillmentStatus;
    } else if (d.status !== undefined) {
      if (d.status === "SHIPPED" || d.status === "DELIVERED") {
        fulfillment = "FULFILLED";
      }
    }

    return tx.tradeOrder.update({
      where: { id },
      data: {
        ...(d.status !== undefined ? { status: d.status } : {}),
        ...(d.fulfillmentStatus !== undefined || d.status !== undefined ? { fulfillmentStatus: fulfillment } : {}),
        ...(d.notes !== undefined ? { notes: d.notes?.trim() || null } : {})
      },
      include: {
        customer: true,
        quote: true,
        lines: { include: { inventoryItem: true } }
      }
    });
  });

  if (!updated) return notFound();
  return NextResponse.json({ order: updated });
}
