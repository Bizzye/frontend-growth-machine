import { isAxiosError } from "axios";
import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { getApiErrorCode } from "@/lib/errors";
import { hasValidApiToken } from "@/lib/session";
import { getServerApiClient } from "@/services/http-client";
import type { User } from "@/types/user";

/**
 * Backend-for-frontend endpoint: reads the API token from the encrypted NextAuth cookie and
 * forwards the request to the backend, so the token is never exposed to browser JavaScript.
 */
export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!hasValidApiToken(token)) {
    return NextResponse.json({ code: "UNAUTHORIZED", message: "Authentication required" }, { status: 401 });
  }

  try {
    const { data } = await getServerApiClient().get<User[]>("/users", {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    });

    return NextResponse.json(data);
  } catch (error) {
    const status = isAxiosError(error) ? (error.response?.status ?? 502) : 500;
    const code = getApiErrorCode(error) ?? "BAD_GATEWAY";
    return NextResponse.json({ code, message: "Could not fetch users" }, { status });
  }
}
