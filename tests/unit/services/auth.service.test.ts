import { signIn, signOut } from "next-auth/react";

import { authService } from "@/services/auth.service";

import { DEMO_USER } from "../../fixtures/users";

const signInMock = vi.mocked(signIn);

describe("authService.login", () => {
  it("signs in through the NextAuth credentials provider without redirecting", async () => {
    signInMock.mockResolvedValue({ ok: true, error: null, status: 200, url: null });

    await authService.login({ email: DEMO_USER.email, password: DEMO_USER.password });

    expect(signInMock).toHaveBeenCalledWith("credentials", {
      redirect: false,
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    });
  });

  it("throws a user-facing error when credentials are rejected", async () => {
    signInMock.mockResolvedValue({ ok: false, error: "INVALID_CREDENTIALS", status: 401, url: null });

    await expect(authService.login({ email: "a@b.com", password: "x" })).rejects.toMatchObject({
      title: "Invalid credentials",
    });
  });

  it("handles an undefined signIn result", async () => {
    signInMock.mockResolvedValue(undefined);

    await expect(authService.login({ email: "a@b.com", password: "x" })).rejects.toMatchObject({
      title: "Unexpected error",
    });
  });
});

describe("authService.register", () => {
  const payload = { ...DEMO_USER, email: "new.user@example.com", birthDate: undefined };

  it("creates the user", async () => {
    await expect(authService.register(payload)).resolves.toBeUndefined();
  });

  it("maps a duplicated e-mail to a friendly error", async () => {
    await expect(authService.register({ ...payload, email: DEMO_USER.email })).rejects.toMatchObject({
      title: "User already registered",
    });
  });
});

describe("authService.logout", () => {
  it("signs out and sends the user to the login page", async () => {
    await authService.logout();
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
