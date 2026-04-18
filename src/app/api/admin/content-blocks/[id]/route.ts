import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { contentBlockUpdateSchema } from "@/lib/validation/admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const item = await prisma.contentBlock.findUnique({ where: { id } });
  if (!item) return failure("NOT_FOUND", "Content block not found.", 404);
  return success(item);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;

  try {
    const payload = await parseBody(request, contentBlockUpdateSchema);
    const item = await prisma.contentBlock.update({
      where: { id },
      data: payload as Prisma.ContentBlockUpdateInput
    });
    return success(item);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid content block update payload.", 400, getValidationDetails(error));
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.contentBlock.delete({ where: { id } });
    return success({ id, deleted: true });
  } catch {
    return failure("NOT_FOUND", "Content block not found.", 404);
  }
}
