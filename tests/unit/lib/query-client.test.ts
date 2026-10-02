import { signOut } from "next-auth/react";

import { AppError } from "@/lib/errors";
import { createQueryClient, isUnauthorizedError } from "@/lib/query-client";

describe("createQueryClient", () => {
  it("signs the user out when a query fails with UNAUTHORIZED", async () => {
    const client = createQueryClient();

    await expect(
      client.fetchQuery({
        queryKey: ["protected"],
        queryFn: () => Promise.reject(AppError.fromCode("UNAUTHORIZED")),
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });

  it("keeps the session for other errors", async () => {
    const client = createQueryClient();

    await expect(
      client.fetchQuery({ queryKey: ["other"], queryFn: () => Promise.reject(new Error("boom")) }),
    ).rejects.toThrow("boom");

    expect(signOut).not.toHaveBeenCalled();
  });

  it("retries once, but never authentication errors", () => {
    const retry = createQueryClient().getDefaultOptions().queries?.retry as (
      failureCount: number,
      error: unknown,
    ) => boolean;

    expect(retry(0, new Error("network"))).toBe(true);
    expect(retry(1, new Error("network"))).toBe(false);
    expect(retry(0, AppError.fromCode("UNAUTHORIZED"))).toBe(false);
  });

  it("identifies unauthorized errors", () => {
    expect(isUnauthorizedError(AppError.fromCode("UNAUTHORIZED"))).toBe(true);
    expect(isUnauthorizedError(AppError.fromCode("INVALID_CREDENTIALS"))).toBe(false);
    expect(isUnauthorizedError(new Error("UNAUTHORIZED"))).toBe(false);
  });
});
