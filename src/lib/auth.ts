import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getServerApiUrl } from "@/config/env";
import { getApiErrorCode } from "@/lib/errors";
import { createHttpClient } from "@/services/http-client";
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
          const api = createHttpClient(getServerApiUrl());
          const { data } = await api.post<LoginResponse>("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, token } = data;

          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`.trim(),
            accessToken: token,
          };
        } catch (error) {
          // The message is forwarded to the client as `signIn().error` and mapped to a
          // user-facing message by `AppError.fromCode`.
          throw new Error(getApiErrorCode(error) ?? UNEXPECTED_ERROR_CODE);
        }
      },
    }),
  ],
  // Matches the backend JWT lifetime (JWT_EXPIRES_IN=1d) so both expire together.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Kept inside the encrypted session cookie only; never exposed to the browser.
        token.accessToken = (user as { accessToken?: string }).accessToken;
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
