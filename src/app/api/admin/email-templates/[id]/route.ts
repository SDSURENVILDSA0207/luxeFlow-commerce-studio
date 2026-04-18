import { prisma } from "@/lib/db/prisma";
import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { emailTemplateUpdateSchema } from "@/lib/validation/admin";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Params) {
  const { id } = await params;
  const item = await prisma.emailTemplate.findUnique({
    where: { id },
    include: { createdBy: true, emailCampaigns: true }
  });
  if (!item) return failure("NOT_FOUND", "Email template not found.", 404);
  return success(item);
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const payload = await parseBody(request, emailTemplateUpdateSchema);
    const item = await prisma.emailTemplate.update({ where: { id }, data: payload });
    return success(item);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid email template update payload.", 400, getValidationDetails(error));
  }
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.emailTemplate.delete({ where: { id } });
    return success({ id, deleted: true });
  } catch {
    return failure("NOT_FOUND", "Email template not found.", 404);
  }
}
