import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { bannerUpdateSchema } from "@/lib/validation/admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const item = await prisma.banner.findUnique({ where: { id } });
  if (!item) return failure("NOT_FOUND", "Banner not found.", 404);
  return success(item);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const payload = await parseBody(request, bannerUpdateSchema);
    const item = await prisma.banner.update({ where: { id }, data: payload });
    return success(item);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid banner update payload.", 400, getValidationDetails(error));
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.banner.delete({ where: { id } });
    return success({ id, deleted: true });
  } catch {
    return failure("NOT_FOUND", "Banner not found.", 404);
  }
}
