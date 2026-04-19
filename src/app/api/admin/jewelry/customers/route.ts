import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { badRequest, unauthorized } from "@/lib/api/jewelry-admin-response";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  businessName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  accountStatus: z.enum(["ACTIVE", "ON_HOLD", "INACTIVE"]).optional(),
  notes: z.string().nullable().optional()
});

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const customers = await prisma.b2BCustomer.findMany({
    orderBy: { businessName: "asc" },
    include: {
      _count: { select: { quotes: true, orders: true } }
    }
  });
  return NextResponse.json({ customers });
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
  const customer = await prisma.b2BCustomer.create({
    data: {
      businessName: d.businessName.trim(),
      contactName: d.contactName.trim(),
      email: d.email.trim().toLowerCase(),
      phone: d.phone?.trim() || null,
      accountStatus: d.accountStatus ?? "ACTIVE",
      notes: d.notes?.trim() || null
    }
  });

  return NextResponse.json({ customer });
}
