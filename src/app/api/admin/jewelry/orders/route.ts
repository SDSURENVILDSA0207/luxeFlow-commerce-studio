import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { badRequest, unauthorized } from "@/lib/api/jewelry-admin-response";
import { generateOrderNumber } from "@/lib/jewelry-inventory/quote-order-numbers";
import { NextResponse } from "next/server";
import { z } from "zod";

const lineSchema = z.object({
  inventoryItemId: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPriceCents: z.number().int().min(0)
});

const createSchema = z.object({
  customerId: z.string().min(1),
  quoteId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  lines: z.array(lineSchema).min(1)
});

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const orders = await prisma.tradeOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      customer: { select: { id: true, businessName: true, email: true } },
      quote: { select: { id: true, quoteNumber: true, status: true } },
      lines: { include: { inventoryItem: { select: { id: true, sku: true, name: true } } } }
    }
  });
  return NextResponse.json({ orders });
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

  if (d.quoteId) {
    const quote = await prisma.tradeQuote.findUnique({ where: { id: d.quoteId } });
    if (!quote || quote.customerId !== d.customerId) {
      return badRequest("Invalid quote for this customer.");
    }
  }

  const orderNumber = await generateOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const linesData = await Promise.all(
      d.lines.map(async (line) => {
        const item = await tx.jewelryInventoryItem.findUnique({ where: { id: line.inventoryItemId } });
        if (!item) throw new Error(`SKU not found: ${line.inventoryItemId}`);
        const lineTotalCents = line.quantity * line.unitPriceCents;
        return {
          inventoryItemId: line.inventoryItemId,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
          lineTotalCents,
          quantityFulfilled: 0
        };
      })
    );

    const subtotal = linesData.reduce((s, l) => s + l.lineTotalCents, 0);

    return tx.tradeOrder.create({
      data: {
        orderNumber,
        customerId: d.customerId,
        quoteId: d.quoteId ?? null,
        status: "DRAFT",
        fulfillmentStatus: "UNFULFILLED",
        subtotalCents: subtotal,
        totalCents: subtotal,
        notes: d.notes?.trim() || null,
        lines: { create: linesData }
      },
      include: {
        customer: true,
        quote: true,
        lines: { include: { inventoryItem: true } }
      }
    });
  });

  return NextResponse.json({ order });
}
