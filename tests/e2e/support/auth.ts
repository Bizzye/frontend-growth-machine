import { expect, type Page } from "@playwright/test";

import { DEMO_USER } from "../../fixtures/users";

export async function signIn(
  page: Page,
  email: string = DEMO_USER.email,
  password: string = DEMO_USER.password,
) {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
}

export async function signInAsDemoUser(page: Page) {
  await signIn(page);
  await expect(page).toHaveURL(/\/home$/);
}

/** Unique e-mail so parallel tests never collide in the shared mock API. */
export function uniqueEmail(prefix = "e2e") {
  return `${prefix}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@example.com`;
}
