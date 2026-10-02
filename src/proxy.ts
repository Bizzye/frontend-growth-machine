import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import { hasValidApiToken } from "@/lib/session";

const AUTH_ROUTES = ["/login", "/register"];
const HOME_ROUTE = "/home";
const LOGIN_ROUTE = "/login";

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Route guard (Next.js 16 "proxy", formerly middleware):
 * - anonymous users trying to reach private pages are sent to /login;
 * - authenticated users visiting /login or /register are sent to /home.
 * A session whose API token has expired counts as anonymous.
 *
 * `next-auth/middleware` (withAuth) is not used because it skips the sign-in page entirely,
 * which makes the second rule impossible.
 */
export default async function proxy(request: NextRequest) {
  const isAuthenticated = hasValidApiToken(await getToken({ req: request }));
  const target = isAuthRoute(request.nextUrl.pathname)
    ? isAuthenticated && HOME_ROUTE
    : !isAuthenticated && LOGIN_ROUTE;

  return target ? NextResponse.redirect(new URL(target, request.url)) : NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*", "/login", "/register"],
};
