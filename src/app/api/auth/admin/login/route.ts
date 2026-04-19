import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken
} from "@/lib/auth/admin-session";

const bodySchema = z.object({
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || configured.length < 4) {
    return NextResponse.json(
      { ok: false, error: "Server is not configured for admin login (set ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Password is required." }, { status: 400 });
  }

  if (parsed.data.password !== configured) {
    return NextResponse.json({ ok: false, error: "Invalid credentials." }, { status: 401 });
  }

  try {
    const token = await createAdminSessionToken();
    const store = await cookies();
    store.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: "Could not create session. Check ADMIN_JWT_SECRET." },
      { status: 500 }
    );
  }
}
