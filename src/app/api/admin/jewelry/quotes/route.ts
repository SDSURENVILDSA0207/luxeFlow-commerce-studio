import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { badRequest, unauthorized } from "@/lib/api/jewelry-admin-response";
import { generateQuoteNumber } from "@/lib/jewelry-inventory/quote-order-numbers";
import { NextResponse } from "next/server";
import { z } from "zod";

const lineSchema = z.object({
  inventoryItemId: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPriceCents: z.number().int().min(0)
});

const createSchema = z.object({
  customerId: z.string().min(1),
  validUntil: z.string().datetime().optional().nullable(),
  notes: z.string().nullable().optional(),
  lines: z.array(lineSchema).min(1)
});

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const quotes = await prisma.tradeQuote.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      customer: { select: { id: true, businessName: true, email: true } },
      lines: { include: { inventoryItem: { select: { id: true, sku: true, name: true } } } }
    }
  });
  return NextResponse.json({ quotes });
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
  const customer = await prisma.b2BCustomer.findUnique({ where: { id: d.customerId } });
  if (!customer) return badRequest("Customer not found.");

  const quoteNumber = await generateQuoteNumber();
  const validUntil = d.validUntil ? new Date(d.validUntil) : null;

  const quote = await prisma.$transaction(async (tx) => {
    const linesData = await Promise.all(
      d.lines.map(async (line) => {
        const item = await tx.jewelryInventoryItem.findUnique({ where: { id: line.inventoryItemId } });
        if (!item) throw new Error(`SKU not found: ${line.inventoryItemId}`);
        const lineTotalCents = line.quantity * line.unitPriceCents;
        return {
          inventoryItemId: line.inventoryItemId,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
          lineTotalCents
        };
      })
    );

    const subtotal = linesData.reduce((s, l) => s + l.lineTotalCents, 0);

    const q = await tx.tradeQuote.create({
      data: {
        quoteNumber,
        customerId: d.customerId,
        status: "DRAFT",
        validUntil,
        subtotalCents: subtotal,
        totalCents: subtotal,
        notes: d.notes?.trim() || null,
        lines: { create: linesData }
      },
      include: {
        customer: true,
        lines: { include: { inventoryItem: true } }
      }
    });
    return q;
  });

  return NextResponse.json({ quote });
}
