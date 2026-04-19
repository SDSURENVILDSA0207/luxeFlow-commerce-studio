import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { badRequest, notFound, unauthorized } from "@/lib/api/jewelry-admin-response";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().nullable().optional().or(z.literal("")),
  phone: z.string().nullable().optional(),
  categories: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  leadTimeDays: z.number().int().positive().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  notes: z.string().nullable().optional()
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const supplier = await prisma.jewelrySupplier.findUnique({
    where: { id },
    include: { items: { take: 50, orderBy: { sku: "asc" } } }
  });
  if (!supplier) return notFound();
  return NextResponse.json({ supplier });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const existing = await prisma.jewelrySupplier.findUnique({ where: { id } });
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
  const supplier = await prisma.jewelrySupplier.update({
    where: { id },
    data: {
      ...(d.name !== undefined ? { name: d.name.trim() } : {}),
      ...(d.email !== undefined ? { email: d.email?.trim() || null } : {}),
      ...(d.phone !== undefined ? { phone: d.phone?.trim() || null } : {}),
      ...(d.categories !== undefined ? { categories: d.categories } : {}),
      ...(d.materials !== undefined ? { materials: d.materials } : {}),
      ...(d.leadTimeDays !== undefined ? { leadTimeDays: d.leadTimeDays } : {}),
      ...(d.status !== undefined ? { status: d.status } : {}),
      ...(d.notes !== undefined ? { notes: d.notes?.trim() || null } : {})
    }
  });

  return NextResponse.json({ supplier });
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const existing = await prisma.jewelrySupplier.findUnique({ where: { id } });
  if (!existing) return notFound();

  await prisma.$transaction([
    prisma.jewelryInventoryItem.updateMany({ where: { supplierId: id }, data: { supplierId: null } }),
    prisma.jewelrySupplier.delete({ where: { id } })
  ]);

  return NextResponse.json({ ok: true });
}
