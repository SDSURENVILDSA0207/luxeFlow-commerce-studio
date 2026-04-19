import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { computeLowStockStatus } from "@/lib/jewelry-inventory/stock-status";
import { badRequest, notFound, unauthorized } from "@/lib/api/jewelry-admin-response";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  sku: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  material: z.string().min(1).optional(),
  gemstone: z.string().nullable().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  reservedQuantity: z.number().int().min(0).optional(),
  reorderThreshold: z.number().int().min(0).optional(),
  supplierId: z.string().nullable().optional(),
  notes: z.string().nullable().optional()
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const item = await prisma.jewelryInventoryItem.findUnique({
    where: { id },
    include: { supplier: true }
  });
  if (!item) return notFound();
  return NextResponse.json({ item });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const existing = await prisma.jewelryInventoryItem.findUnique({ where: { id } });
  if (!existing) return notFound();

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
  const stockQuantity = d.stockQuantity ?? existing.stockQuantity;
  const reservedQuantity = d.reservedQuantity ?? existing.reservedQuantity;
  const reorderThreshold = d.reorderThreshold ?? existing.reorderThreshold;
  const lowStockStatus = computeLowStockStatus(stockQuantity, reservedQuantity, reorderThreshold);

  const item = await prisma.jewelryInventoryItem.update({
    where: { id },
    data: {
      ...(d.sku !== undefined ? { sku: d.sku.trim() } : {}),
      ...(d.name !== undefined ? { name: d.name.trim() } : {}),
      ...(d.category !== undefined ? { category: d.category.trim() } : {}),
      ...(d.material !== undefined ? { material: d.material.trim() } : {}),
      ...(d.gemstone !== undefined ? { gemstone: d.gemstone?.trim() || null } : {}),
      ...(d.stockQuantity !== undefined ? { stockQuantity: d.stockQuantity } : {}),
      ...(d.reservedQuantity !== undefined ? { reservedQuantity: d.reservedQuantity } : {}),
      ...(d.reorderThreshold !== undefined ? { reorderThreshold: d.reorderThreshold } : {}),
      lowStockStatus,
      ...(d.supplierId !== undefined ? { supplierId: d.supplierId || null } : {}),
      ...(d.notes !== undefined ? { notes: d.notes?.trim() || null } : {})
    },
    include: { supplier: true }
  });

  return NextResponse.json({ item });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  try {
    await prisma.jewelryInventoryItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return notFound();
  }
}
