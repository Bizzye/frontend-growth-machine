import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getApiErrorCode } from "@/lib/errors";
import { getTokenExpiry } from "@/lib/session";
import { getServerApiClient } from "@/services/http-client";
import type { LoginResponse } from "@/types/user";

const UNEXPECTED_ERROR_CODE = "UnexpectedError";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          const { data } = await getServerApiClient().post<LoginResponse>("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, token } = data;

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            accessToken: token,
            accessTokenExpires: getTokenExpiry(token),
          };
        } catch (error) {
          // The message is forwarded to the client as `signIn().error` and mapped to a
          // user-facing message by `AppError.fromCode`.
          throw new Error(getApiErrorCode(error) ?? UNEXPECTED_ERROR_CODE);
        }
      },
    }),
  ],
  // Same as the backend default (JWT_EXPIRES_IN=1d). The session is rolling, so the API token
  // expiry is also checked by `hasValidApiToken` in the proxy and the BFF.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Kept inside the encrypted session cookie only; never exposed to the browser.
        token.accessToken = user.accessToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};
