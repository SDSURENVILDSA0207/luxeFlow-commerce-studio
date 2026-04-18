import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { bannerCreateSchema } from "@/lib/validation/admin";

export async function GET() {
  const items = await prisma.banner.findMany({
    orderBy: { updatedAt: "desc" }
  });
  return success(items);
}

export async function POST(request: Request) {
  try {
    const payload = await parseBody(request, bannerCreateSchema);
    const item = await prisma.banner.create({ data: payload });
    return success(item, 201);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid banner payload.", 400, getValidationDetails(error));
  }
}
