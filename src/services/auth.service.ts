import { signIn, signOut } from "next-auth/react";

import { AppError, toAppError } from "@/lib/errors";
import type { LoginCredentials, RegisterUserPayload } from "@/types/user";

import { apiClient } from "./http-client";

export const authService = {
  /** Authenticates through the NextAuth credentials provider (see `src/lib/auth.ts`). */
  async login({ email, password }: LoginCredentials): Promise<void> {
    const result = await signIn("credentials", { redirect: false, email, password });

    if (!result?.ok) {
      throw AppError.fromCode(result?.error);
    }
  },

  async register(payload: RegisterUserPayload): Promise<void> {
    try {
      await apiClient.post("/users", payload);
    } catch (error) {
      throw toAppError(error);
    }
  },

  async logout(): Promise<void> {
    await signOut({ callbackUrl: "/login" });
  },
};
