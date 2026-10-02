import axios from "axios";

import { publicEnv } from "@/config/env";

export function createHttpClient(baseURL: string) {
  return axios.create({
    baseURL,
    // Same transport in the browser, on the Node.js server (NextAuth) and in tests (MSW).
    adapter: "fetch",
    timeout: 10_000,
    headers: { "Content-Type": "application/json" },
  });
}

/** Browser → backend API, for public endpoints (e.g. sign up). */
export const apiClient = createHttpClient(publicEnv.NEXT_PUBLIC_API_URL);

/**
 * Browser → Next.js route handlers (BFF), for endpoints that need the user's API token.
 * Absolute URL because the fetch adapter builds a `Request`, which rejects relative URLs outside browsers.
 */
export const bffClient = createHttpClient(
  typeof window === "undefined" ? "/api" : new URL("/api", window.location.origin).toString(),
);
