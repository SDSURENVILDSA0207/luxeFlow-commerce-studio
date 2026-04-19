import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { badRequest, notFound, unauthorized } from "@/lib/api/jewelry-admin-response";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "ACCEPTED", "DECLINED", "EXPIRED"]).optional(),
  validUntil: z.string().datetime().nullable().optional(),
  notes: z.string().nullable().optional()
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const quote = await prisma.tradeQuote.findUnique({
    where: { id },
    include: {
      customer: true,
      lines: { include: { inventoryItem: true } },
      orders: { select: { id: true, orderNumber: true, status: true } }
    }
  });
  if (!quote) return notFound();
  return NextResponse.json({ quote });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const { id } = await params;
  const existing = await prisma.tradeQuote.findUnique({ where: { id } });
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
  const quote = await prisma.tradeQuote.update({
    where: { id },
    data: {
      ...(d.status !== undefined ? { status: d.status } : {}),
      ...(d.validUntil !== undefined ? { validUntil: d.validUntil ? new Date(d.validUntil) : null } : {}),
      ...(d.notes !== undefined ? { notes: d.notes?.trim() || null } : {})
    },
    include: {
      customer: true,
      lines: { include: { inventoryItem: true } }
    }
  });

  return NextResponse.json({ quote });
}
