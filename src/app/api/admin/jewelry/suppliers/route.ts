import { prisma } from "@/lib/db/prisma";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { badRequest, unauthorized } from "@/lib/api/jewelry-admin-response";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  categories: z.array(z.string()).optional(),
  materials: z.array(z.string()).optional(),
  leadTimeDays: z.number().int().positive().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  notes: z.string().nullable().optional()
});

export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return unauthorized();

  const suppliers = await prisma.jewelrySupplier.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { items: true } } }
  });
  return NextResponse.json({ suppliers });
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
  const supplier = await prisma.jewelrySupplier.create({
    data: {
      name: d.name.trim(),
      email: d.email?.trim() || null,
      phone: d.phone?.trim() || null,
      categories: d.categories ?? [],
      materials: d.materials ?? [],
      leadTimeDays: d.leadTimeDays ?? null,
      status: d.status ?? "ACTIVE",
      notes: d.notes?.trim() || null
    }
  });

  return NextResponse.json({ supplier });
}
