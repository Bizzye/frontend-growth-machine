import { getServerApiUrl } from "@/config/env";

describe("getServerApiUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers the internal API_URL on the server", () => {
    vi.stubEnv("API_URL", "http://backend:3333/api");
    expect(getServerApiUrl()).toBe("http://backend:3333/api");
  });

  it("falls back to the public API URL", () => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "https://api.example.com/api");
    expect(getServerApiUrl()).toBe("https://api.example.com/api");
  });

  it("falls back to the local backend when nothing is configured", () => {
    vi.stubEnv("API_URL", "");
    vi.stubEnv("NEXT_PUBLIC_API_URL", "");
    expect(getServerApiUrl()).toBe("http://localhost:3333/api");
  });

  it("rejects invalid URLs", () => {
    vi.stubEnv("API_URL", "not a url");
    expect(() => getServerApiUrl()).toThrow();
  });
});
