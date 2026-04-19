import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { unauthorized } from "@/lib/api/jewelry-admin-response";
import { NextResponse } from "next/server";

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const [
    skuCount,
    lowStockCount,
    outOfStockCount,
    supplierCount,
    activeSupplierCount,
    customerCount,
    quoteCount,
    orderCount,
    pendingFulfillment
  ] = await Promise.all([
    prisma.jewelryInventoryItem.count(),
    prisma.jewelryInventoryItem.count({ where: { lowStockStatus: "LOW" } }),
    prisma.jewelryInventoryItem.count({ where: { lowStockStatus: "OUT" } }),
    prisma.jewelrySupplier.count(),
    prisma.jewelrySupplier.count({ where: { status: "ACTIVE" } }),
    prisma.b2BCustomer.count(),
    prisma.tradeQuote.count(),
    prisma.tradeOrder.count(),
    prisma.tradeOrder.count({
      where: {
        status: { in: ["CONFIRMED", "IN_PRODUCTION"] },
        fulfillmentStatus: { not: "FULFILLED" }
      }
    })
  ]);

  const [quoteStatuses, orderStatuses] = await Promise.all([
    prisma.tradeQuote.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.tradeOrder.groupBy({ by: ["status"], _count: { _all: true } })
  ]);

  return NextResponse.json({
    inventory: {
      skuCount,
      lowStockCount,
      outOfStockCount
    },
    suppliers: { total: supplierCount, active: activeSupplierCount },
    customers: customerCount,
    quotes: { total: quoteCount, byStatus: quoteStatuses },
    orders: { total: orderCount, pendingFulfillment, byStatus: orderStatuses }
  });
}
