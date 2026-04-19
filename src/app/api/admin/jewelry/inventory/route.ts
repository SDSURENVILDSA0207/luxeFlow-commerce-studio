import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { computeLowStockStatus } from "@/lib/jewelry-inventory/stock-status";
import { badRequest, unauthorized } from "@/lib/api/jewelry-admin-response";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  material: z.string().min(1),
  gemstone: z.string().nullable().optional(),
  stockQuantity: z.number().int().min(0),
  reservedQuantity: z.number().int().min(0),
  reorderThreshold: z.number().int().min(0),
  supplierId: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const items = await prisma.jewelryInventoryItem.findMany({
    orderBy: { sku: "asc" },
    include: { supplier: { select: { id: true, name: true } } }
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return badRequest(parsed.error.issues.map((i) => i.message).join(", "));
  }

  const d = parsed.data;
  const lowStockStatus = computeLowStockStatus(d.stockQuantity, d.reservedQuantity, d.reorderThreshold);

  const item = await prisma.jewelryInventoryItem.create({
    data: {
      sku: d.sku.trim(),
      name: d.name.trim(),
      category: d.category.trim(),
      material: d.material.trim(),
      gemstone: d.gemstone?.trim() || null,
      stockQuantity: d.stockQuantity,
      reservedQuantity: d.reservedQuantity,
      reorderThreshold: d.reorderThreshold,
      lowStockStatus,
      supplierId: d.supplierId || null,
      notes: d.notes?.trim() || null
    },
    include: { supplier: true }
  });

  return NextResponse.json({ item });
}
