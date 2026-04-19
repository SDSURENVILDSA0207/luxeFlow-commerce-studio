import { SignJWT, jwtVerify } from "jose";

const COOKIE = "admin_session";

export function getAdminJwtSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_JWT_SECRET must be set (min 16 characters).");
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(): Promise<string> {
  const key = getAdminJwtSecretKey();
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  try {
    const key = getAdminJwtSecretKey();
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = COOKIE;

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  };
}
