import { expect, test } from "@playwright/test";

import { usersFixture } from "../fixtures/users";
import { signInAsDemoUser } from "./support/auth";

test.describe("Users listing", () => {
  test.beforeEach(async ({ page }) => {
    await signInAsDemoUser(page);
  });

  test("lists registered users with formatted dates", async ({ page }) => {
    const table = page.getByRole("table");

    await expect(table.getByRole("columnheader")).toHaveText([
      "Name",
      "E-mail",
      "Birth date",
      "Member since",
    ]);

    for (const user of usersFixture) {
      await expect(table.getByRole("cell", { name: user.email })).toBeVisible();
    }

    const janeRow = table.getByRole("row", { name: /Jane Cooper/ });
    await expect(janeRow).toContainText("Mar 12, 1994");
  });

  test("has a descriptive page title", async ({ page }) => {
    await expect(page).toHaveTitle("Users | Userz Growth");
  });

  test("sends security headers", async ({ page }) => {
    const response = await page.request.get("/login");

    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["x-content-type-options"]).toBe("nosniff");
    expect(response.headers()["x-powered-by"]).toBeUndefined();
  });
});
