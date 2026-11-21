import { createNeonAuth } from "@neon/auth/next/server";

let authInstance: ReturnType<typeof createNeonAuth> | undefined;

export function getAuth() {
  if (authInstance) return authInstance;

  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.BETTER_AUTH_SECRET;
  if (!baseUrl || !cookieSecret || cookieSecret.length < 32) {
    throw new Error("Neon Auth requires NEON_AUTH_BASE_URL and a 32-character BETTER_AUTH_SECRET.");
  }

  authInstance = createNeonAuth({ baseUrl, cookies: { secret: cookieSecret } });
  return authInstance;
}
