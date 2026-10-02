import { http, HttpResponse } from "msw";

import { AppError } from "@/lib/errors";
import { usersService } from "@/services/users.service";

import { usersFixture } from "../../fixtures/users";
import { bffUrl } from "../../mocks/handlers";
import { server } from "../../mocks/server";

describe("usersService.list", () => {
  it("returns the users from the API", async () => {
    const users = await usersService.list();

    expect(users).toHaveLength(usersFixture.length);
    expect(users[0]).toMatchObject({ email: usersFixture[0]!.email });
    expect(users[0]).not.toHaveProperty("password");
  });

  it("throws an AppError when the request fails", async () => {
    server.use(http.get(bffUrl("/users"), () => HttpResponse.json({ message: "boom" }, { status: 500 })));

    await expect(usersService.list()).rejects.toBeInstanceOf(AppError);
    await expect(usersService.list()).rejects.toMatchObject({ title: "Unexpected error" });
  });
});
