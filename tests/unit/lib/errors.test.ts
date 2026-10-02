import { AxiosError, AxiosHeaders } from "axios";

import { API_ERROR_CODES, AppError, getApiErrorCode, toAppError } from "@/lib/errors";

function axiosErrorWith(data: unknown, status = 400) {
  const config = { headers: new AxiosHeaders() };
  return new AxiosError("Request failed", "ERR_BAD_REQUEST", config, undefined, {
    data,
    status,
    statusText: "",
    headers: {},
    config,
  });
}

describe("AppError.fromCode", () => {
  it.each([API_ERROR_CODES.INVALID_CREDENTIALS, "CredentialsSignin"])(
    "maps %s to the generic invalid credentials message",
    (code) => {
      const error = AppError.fromCode(code);

      expect(error.title).toBe("Invalid credentials");
      expect(error.code).toBe(code);
    },
  );

  it.each([
    [API_ERROR_CODES.USER_ALREADY_EXISTS, "User already registered"],
    [API_ERROR_CODES.VALIDATION_ERROR, "Invalid data"],
    [API_ERROR_CODES.UNAUTHORIZED, "Session expired"],
    [API_ERROR_CODES.TOO_MANY_REQUESTS, "Too many attempts"],
  ])("maps %s to a user-facing message", (code, title) => {
    expect(AppError.fromCode(code).title).toBe(title);
  });

  it.each([undefined, null, "", "SOMETHING_WEIRD"])("falls back to an unexpected error for %s", (code) => {
    const error = AppError.fromCode(code);

    expect(error).toBeInstanceOf(Error);
    expect(error.title).toBe("Unexpected error");
    expect(error.message).toBe(error.description);
  });
});

describe("getApiErrorCode", () => {
  it("extracts the code from an Axios error response", () => {
    const error = axiosErrorWith({ code: "INVALID_CREDENTIALS", message: "Invalid credentials" }, 401);
    expect(getApiErrorCode(error)).toBe("INVALID_CREDENTIALS");
  });

  it("ignores non-string codes and non-Axios errors", () => {
    expect(getApiErrorCode(axiosErrorWith({ code: 42 }))).toBeUndefined();
    expect(getApiErrorCode(axiosErrorWith(undefined))).toBeUndefined();
    expect(getApiErrorCode(new Error("boom"))).toBeUndefined();
    expect(getApiErrorCode("boom")).toBeUndefined();
  });
});

describe("toAppError", () => {
  it("returns AppError instances untouched", () => {
    const error = AppError.fromCode(API_ERROR_CODES.USER_ALREADY_EXISTS);
    expect(toAppError(error)).toBe(error);
  });

  it("converts Axios errors using the backend code", () => {
    const error = toAppError(axiosErrorWith({ code: API_ERROR_CODES.USER_ALREADY_EXISTS }, 409));
    expect(error.title).toBe("User already registered");
  });
});
