import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { campaignUpdateSchema } from "@/lib/validation/admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const item = await prisma.campaign.findUnique({
    where: { id },
    include: {
      owner: true,
      assets: {
        include: {
          banner: true,
          contentBlock: true,
          collection: true,
          product: true,
          emailTemplate: true
        }
      },
      emailCampaigns: true,
      abTests: { include: { variants: true } }
    }
  });
  if (!item) return failure("NOT_FOUND", "Campaign not found.", 404);
  return success(item);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const payload = await parseBody(request, campaignUpdateSchema);
    const item = await prisma.campaign.update({ where: { id }, data: payload });
    return success(item);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid campaign update payload.", 400, getValidationDetails(error));
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.campaign.delete({ where: { id } });
    return success({ id, deleted: true });
  } catch {
    return failure("NOT_FOUND", "Campaign not found.", 404);
  }
}
