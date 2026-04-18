import { parseBody, getValidationDetails } from "@/lib/api/parse-body";
import { failure, success } from "@/lib/api/responses";
import { aiCopyRequestSchema } from "@/lib/validation/admin";
import { generateCopySuggestions } from "@/modules/ai-assistant/generate-copy";

export async function POST(request: Request) {
  try {
    const payload = await parseBody(request, aiCopyRequestSchema);
    const suggestions = generateCopySuggestions(payload);
    return success(suggestions);
  } catch (error) {
    return failure("VALIDATION_ERROR", "Invalid AI copy request payload.", 400, getValidationDetails(error));
  }
}
