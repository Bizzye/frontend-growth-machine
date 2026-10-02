import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  /** Returned by `authorize` and only read by the `jwt` callback (server-side). */
  interface User {
    accessToken?: string;
    accessTokenExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    /** Expiry of the API token (ms since epoch). */
    accessTokenExpires?: number;
  }
}
