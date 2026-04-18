import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { collectionUpdateSchema } from "@/lib/validation/admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const item = await prisma.collection.findUnique({
    where: { id },
    include: { products: true }
  });
  if (!item) return failure("NOT_FOUND", "Collection not found.", 404);
  return success(item);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const payload = await parseBody(request, collectionUpdateSchema);
    const item = await prisma.collection.update({ where: { id }, data: payload });
    return success(item);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid collection update payload.", 400, getValidationDetails(error));
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.collection.delete({ where: { id } });
    return success({ id, deleted: true });
  } catch {
    return failure("NOT_FOUND", "Collection not found.", 404);
  }
}
