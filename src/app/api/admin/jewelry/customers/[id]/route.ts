import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { badRequest, notFound, unauthorized } from "@/lib/api/jewelry-admin-response";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  businessName: z.string().min(1).optional(),
  contactName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().nullable().optional(),
  accountStatus: z.enum(["ACTIVE", "ON_HOLD", "INACTIVE"]).optional(),
  notes: z.string().nullable().optional()
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const customer = await prisma.b2BCustomer.findUnique({
    where: { id },
    include: {
      quotes: { orderBy: { createdAt: "desc" }, take: 20 },
      orders: { orderBy: { createdAt: "desc" }, take: 20 }
    }
  });
  if (!customer) return notFound();
  return NextResponse.json({ customer });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const existing = await prisma.b2BCustomer.findUnique({ where: { id } });
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
  const customer = await prisma.b2BCustomer.update({
    where: { id },
    data: {
      ...(d.businessName !== undefined ? { businessName: d.businessName.trim() } : {}),
      ...(d.contactName !== undefined ? { contactName: d.contactName.trim() } : {}),
      ...(d.email !== undefined ? { email: d.email.trim().toLowerCase() } : {}),
      ...(d.phone !== undefined ? { phone: d.phone?.trim() || null } : {}),
      ...(d.accountStatus !== undefined ? { accountStatus: d.accountStatus } : {}),
      ...(d.notes !== undefined ? { notes: d.notes?.trim() || null } : {})
    }
  });

  return NextResponse.json({ customer });
}
