import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { contentBlockCreateSchema } from "@/lib/validation/admin";

export async function GET() {
  const items = await prisma.contentBlock.findMany({
    orderBy: { updatedAt: "desc" }
  });
  return success(items);
}

export async function POST(request: Request) {
  try {
    const payload = await parseBody(request, contentBlockCreateSchema);
    const item = await prisma.contentBlock.create({
      data: payload as Prisma.ContentBlockUncheckedCreateInput
    });
    return success(item, 201);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid content block payload.", 400, getValidationDetails(error));
  }
}
