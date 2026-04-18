import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { collectionCreateSchema } from "@/lib/validation/admin";

export async function GET() {
  const items = await prisma.collection.findMany({
    include: { products: true },
    orderBy: { updatedAt: "desc" }
  });
  return success(items);
}

export async function POST(request: Request) {
  try {
    const payload = await parseBody(request, collectionCreateSchema);
    const item = await prisma.collection.create({ data: payload });
    return success(item, 201);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid collection payload.", 400, getValidationDetails(error));
  }
}
