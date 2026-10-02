// @vitest-environment node
import { http, HttpResponse } from "msw";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { GET } from "@/app/api/users/route";

import { toPublicUser, usersFixture } from "../../fixtures/users";
import { apiUrl } from "../../mocks/handlers";
import { server } from "../../mocks/server";

vi.mock("next-auth/jwt", () => ({ getToken: vi.fn() }));

const getTokenMock = vi.mocked(getToken);
const request = () => new NextRequest("http://localhost:3000/api/users");

describe("GET /api/users (BFF)", () => {
  it("returns 401 without a session token", async () => {
    getTokenMock.mockResolvedValue(null);

    const response = await GET(request());

    expect(response.status).toBe(401);
  });

  it("returns 401 when the API token inside the session has expired", async () => {
    getTokenMock.mockResolvedValue({ accessToken: "api-token", accessTokenExpires: Date.now() - 1000 });

    const response = await GET(request());

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("forwards the request to the backend with the user's API token", async () => {
    getTokenMock.mockResolvedValue({ accessToken: "api-token" });
    let authorization: string | null = null;
    server.use(
      http.get(apiUrl("/users"), ({ request }) => {
        authorization = request.headers.get("authorization");
        return HttpResponse.json(usersFixture.map(toPublicUser));
      }),
    );

    const response = await GET(request());

    expect(response.status).toBe(200);
    expect(authorization).toBe("Bearer api-token");
    expect(await response.json()).toHaveLength(usersFixture.length);
  });

  it("propagates backend errors", async () => {
    getTokenMock.mockResolvedValue({ accessToken: "expired" });
    server.use(
      http.get(apiUrl("/users"), () =>
        HttpResponse.json({ code: "UNAUTHORIZED", message: "Token expired" }, { status: 401 }),
      ),
    );

    const response = await GET(request());

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns 502 when the backend is unreachable", async () => {
    getTokenMock.mockResolvedValue({ accessToken: "api-token" });
    server.use(http.get(apiUrl("/users"), () => HttpResponse.error()));

    const response = await GET(request());

    expect(response.status).toBe(502);
    expect(await response.json()).toMatchObject({ code: "BAD_GATEWAY" });
  });
});
