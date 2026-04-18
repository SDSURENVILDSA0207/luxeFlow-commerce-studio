import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { abTestUpdateSchema } from "@/lib/validation/admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const item = await prisma.aBTest.findUnique({
    where: { id },
    include: { variants: true, campaign: true }
  });
  if (!item) return failure("NOT_FOUND", "A/B test not found.", 404);
  return success(item);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const payload = await parseBody(request, abTestUpdateSchema);
    const { variants, ...testData } = payload;

    const item = await prisma.$transaction(async (tx) => {
      const updatedTest = await tx.aBTest.update({
        where: { id },
        data: testData
      });

      if (variants) {
        await tx.aBVariant.deleteMany({ where: { testId: id } });
        await tx.aBVariant.createMany({
          data: variants.map((variant) => ({ ...variant, testId: id }))
        });
      }

      return tx.aBTest.findUnique({
        where: { id: updatedTest.id },
        include: { variants: true, campaign: true }
      });
    });

    return success(item);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid A/B test update payload.", 400, getValidationDetails(error));
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.aBTest.delete({ where: { id } });
    return success({ id, deleted: true });
  } catch {
    return failure("NOT_FOUND", "A/B test not found.", 404);
  }
}
