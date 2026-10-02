import { z } from "zod";

const DEFAULT_API_URL = "http://localhost:3333/api";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default(DEFAULT_API_URL),
});

const serverEnvSchema = publicEnvSchema.extend({
  API_URL: z.url().optional(),
});

/**
 * Public variables are inlined by Next.js at build time, so each one must be
 * referenced explicitly (`process.env.NEXT_PUBLIC_*`) instead of spreading `process.env`.
 */
export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
});

/**
 * Base URL used by server-side code (NextAuth `authorize`). Falls back to the public URL,
 * but can point to an internal address (e.g. a Docker network hostname).
 */
export function getServerApiUrl(): string {
  const env = serverEnvSchema.parse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || undefined,
    API_URL: process.env.API_URL || undefined,
  });

  return env.API_URL ?? env.NEXT_PUBLIC_API_URL;
}
