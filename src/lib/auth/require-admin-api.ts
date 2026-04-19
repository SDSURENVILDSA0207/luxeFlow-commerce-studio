import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth/admin-session";

export async function requireAdminApi(): Promise<{ ok: true } | { ok: false; status: number; message: string }> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }
  const valid = await verifyAdminSessionToken(token);
  if (!valid) {
    return { ok: false, status: 401, message: "Session expired" };
  }
  return { ok: true };
}
