import { ZodError, ZodType } from "zod";

export async function parseBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const json = await request.json();
  return schema.parse(json);
}

export function getValidationDetails(error: unknown) {
  if (error instanceof ZodError) {
    return error.flatten();
  }
  return undefined;
}
