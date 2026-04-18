import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { campaignCreateSchema } from "@/lib/validation/admin";

export async function GET() {
  const items = await prisma.campaign.findMany({
    include: {
      owner: true,
      assets: true,
      emailCampaigns: true,
      abTests: true
    },
    orderBy: { updatedAt: "desc" }
  });
  return success(items);
}

export async function POST(request: Request) {
  try {
    const payload = await parseBody(request, campaignCreateSchema);
    const item = await prisma.campaign.create({ data: payload });
    return success(item, 201);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid campaign payload.", 400, getValidationDetails(error));
  }
}
