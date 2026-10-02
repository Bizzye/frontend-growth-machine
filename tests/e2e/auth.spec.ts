import { expect, test } from "@playwright/test";

import { DEMO_USER } from "../fixtures/users";
import { signIn, signInAsDemoUser, uniqueEmail } from "./support/auth";

test.describe("Authentication", () => {
  test("redirects anonymous visitors to the login page", async ({ page }) => {
    await page.goto("/home");

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });

  test("validates the login form on the client", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Please enter a valid e-mail")).toBeVisible();
    await expect(page.getByText("Please enter your password")).toBeVisible();
  });

  test("shows a generic error for wrong credentials", async ({ page }) => {
    await signIn(page, DEMO_USER.email, "Wr0ng!Password");

    await expect(page.getByText("Invalid credentials", { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test("signs in, keeps authenticated users away from /login and signs out", async ({ page }) => {
    await signInAsDemoUser(page);
    await expect(page.getByText(`${DEMO_USER.firstName} ${DEMO_USER.lastName}`).first()).toBeVisible();

    await page.goto("/login");
    await expect(page).toHaveURL(/\/home$/);

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
  });

  test("registers a new account and lands on the users page", async ({ page }) => {
    const email = uniqueEmail("register");

    await page.goto("/login");
    await page.getByRole("link", { name: "Sign up" }).click();
    await expect(page).toHaveURL(/\/register$/);

    await page.getByLabel("First name").fill("Robert");
    await page.getByLabel("Last name").fill("Fox");
    await page.getByLabel("Birth date").fill("1993-06-15");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Password").fill(DEMO_USER.password);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(page.getByRole("cell", { name: email })).toBeVisible();
  });

  test("does not allow registering an existing e-mail", async ({ page }) => {
    await page.goto("/register");

    await page.getByLabel("First name").fill("Jane");
    await page.getByLabel("Last name").fill("Cooper");
    await page.getByLabel("E-mail").fill(DEMO_USER.email);
    await page.getByLabel("Password").fill(DEMO_USER.password);
    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("User already registered", { exact: true })).toBeVisible();
    await expect(page).toHaveURL(/\/register$/);
  });
});
