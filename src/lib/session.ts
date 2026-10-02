import type { JWT } from "next-auth/jwt";

/**
 * Reads the `exp` claim of the API token (in ms). The signature is not verified here: the token
 * was just received from our own API over a server-to-server call.
 */
export function getTokenExpiry(token: string): number | undefined {
  const payload = token.split(".")[1];
  if (!payload) return undefined;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: unknown };
    return typeof exp === "number" ? exp * 1000 : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The NextAuth session is rolling (renewed while the user is active) but the API token has a fixed
 * lifetime, so a session is only usable while the API token inside it has not expired.
 */
export function hasValidApiToken(
  token: JWT | null,
  now: number = Date.now(),
): token is JWT & { accessToken: string } {
  if (!token?.accessToken) return false;
  return token.accessTokenExpires === undefined || token.accessTokenExpires > now;
}
