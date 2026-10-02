/**
 * Not a regular test: captures the screenshots embedded in the README.
 * Run with `npm run screenshots` (output: docs/screenshots).
 */
import { expect, type Page, test } from "@playwright/test";

import { signInAsDemoUser } from "./support/auth";

const OUTPUT_DIR = "docs/screenshots";

test.describe.configure({ mode: "serial" });

async function capture(page: Page, name: string) {
  // Let fonts/animations settle so images are deterministic.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUTPUT_DIR}/${name}.png` });
}

test("login", async ({ page }) => {
  await page.goto("/login");
  await capture(page, "login");
});

test("login - validation", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("not-an-email");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Please enter a valid e-mail")).toBeVisible();
  await capture(page, "login-validation");
});

test("login - invalid credentials", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("ghost@example.com");
  await page.getByLabel("Password").fill("Wr0ng!Password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByText("Invalid credentials", { exact: true })).toBeVisible();
  await capture(page, "login-error");
});

test("register", async ({ page }) => {
  await page.goto("/register");
  await page.getByLabel("First name").fill("Robert");
  await page.getByLabel("Last name").fill("Fox");
  await page.getByLabel("Birth date").fill("1993-06-15");
  await page.getByLabel("E-mail").fill("robert.fox@example.com");
  await page.getByLabel("Password").fill("weak");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText(/Password must be at least/)).toBeVisible();
  await capture(page, "register");
});

test("users", async ({ page }) => {
  await signInAsDemoUser(page);
  await expect(page.getByRole("table")).toBeVisible();
  await capture(page, "users");
});

test("users - mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await signInAsDemoUser(page);
  await expect(page.getByRole("table")).toBeVisible();
  await capture(page, "users-mobile");
});
