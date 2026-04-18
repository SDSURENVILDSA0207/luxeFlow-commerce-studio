import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { abTestCreateSchema } from "@/lib/validation/admin";

export async function GET() {
  const items = await prisma.aBTest.findMany({
    include: { variants: true, campaign: true },
    orderBy: { updatedAt: "desc" }
  });
  return success(items);
}

export async function POST(request: Request) {
  try {
    const payload = await parseBody(request, abTestCreateSchema);
    const { variants, ...testData } = payload;

    const item = await prisma.aBTest.create({
      data: {
        ...testData,
        variants: { create: variants }
      },
      include: { variants: true }
    });

    return success(item, 201);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid A/B test payload.", 400, getValidationDetails(error));
  }
}
