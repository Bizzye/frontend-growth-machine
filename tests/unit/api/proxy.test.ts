// @vitest-environment node
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import proxy from "@/proxy";

vi.mock("next-auth/jwt", () => ({ getToken: vi.fn() }));

const getTokenMock = vi.mocked(getToken);

async function navigate(path: string, authenticated: boolean) {
  getTokenMock.mockResolvedValue(authenticated ? { sub: "user-1", accessToken: "api-token" } : null);
  return proxy(new NextRequest(`http://localhost:3000${path}`));
}

const redirectTarget = (response: Response) => response.headers.get("location");

describe("proxy (route guard)", () => {
  it.each(["/home", "/home/settings"])("sends anonymous users from %s to /login", async (path) => {
    const response = await navigate(path, false);

    expect(response.status).toBe(307);
    expect(redirectTarget(response)).toBe("http://localhost:3000/login");
  });

  it.each(["/login", "/register"])("sends authenticated users from %s to /home", async (path) => {
    const response = await navigate(path, true);

    expect(redirectTarget(response)).toBe("http://localhost:3000/home");
  });

  it("treats a session with an expired API token as anonymous", async () => {
    getTokenMock.mockResolvedValue({ accessToken: "api-token", accessTokenExpires: Date.now() - 1000 });

    const fromHome = await proxy(new NextRequest("http://localhost:3000/home"));
    expect(redirectTarget(fromHome)).toBe("http://localhost:3000/login");

    // …and can reach the login page instead of bouncing back to /home.
    const fromLogin = await proxy(new NextRequest("http://localhost:3000/login"));
    expect(redirectTarget(fromLogin)).toBeNull();
  });

  it.each([
    ["/home", true],
    ["/login", false],
    ["/register", false],
  ])("lets %s through (authenticated: %s)", async (path, authenticated) => {
    const response = await navigate(path, authenticated);

    expect(redirectTarget(response)).toBeNull();
    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
