import { getTokenExpiry, hasValidApiToken } from "@/lib/session";

function fakeJwt(payload: object) {
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.signature`;
}

describe("getTokenExpiry", () => {
  it("returns the exp claim in milliseconds", () => {
    expect(getTokenExpiry(fakeJwt({ sub: "1", exp: 1_700_000_000 }))).toBe(1_700_000_000_000);
  });

  it.each([
    ["no exp claim", fakeJwt({ sub: "1" })],
    ["a malformed token", "not-a-jwt"],
    ["an invalid payload", "header.%%%.signature"],
  ])("returns undefined for %s", (_case, token) => {
    expect(getTokenExpiry(token)).toBeUndefined();
  });
});

describe("hasValidApiToken", () => {
  const now = 1_700_000_000_000;

  it("requires an API token", () => {
    expect(hasValidApiToken(null, now)).toBe(false);
    expect(hasValidApiToken({}, now)).toBe(false);
  });

  it("accepts tokens that have not expired (or have no known expiry)", () => {
    expect(hasValidApiToken({ accessToken: "t", accessTokenExpires: now + 1 }, now)).toBe(true);
    expect(hasValidApiToken({ accessToken: "t" }, now)).toBe(true);
  });

  it("rejects expired tokens", () => {
    expect(hasValidApiToken({ accessToken: "t", accessTokenExpires: now }, now)).toBe(false);
  });
});
