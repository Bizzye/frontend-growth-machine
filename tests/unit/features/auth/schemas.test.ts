import { loginSchema, passwordSchema, registerSchema } from "@/features/auth/schemas";

const validRegister = {
  firstName: "Jane",
  lastName: "Cooper",
  birthDate: "1994-03-12",
  email: "jane@example.com",
  password: "Str0ng!Pass",
};

function firstIssue(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return result.error?.issues[0]?.message;
}

describe("passwordSchema", () => {
  it("accepts a strong password", () => {
    expect(passwordSchema.safeParse("Str0ng!Pass").success).toBe(true);
  });

  it.each([
    ["Sh0rt!", "at least 8 characters"],
    ["str0ng!pass", "uppercase"],
    ["STR0NG!PASS", "lowercase"],
    ["Strong!Pass", "number"],
    ["Str0ngPass1", "special character"],
  ])("rejects %s (%s)", (password, expected) => {
    expect(firstIssue(passwordSchema.safeParse(password))).toContain(expected);
  });
});

describe("loginSchema", () => {
  it("normalizes the e-mail", () => {
    const result = loginSchema.parse({ email: "  Jane@Example.COM ", password: "x" });
    expect(result.email).toBe("jane@example.com");
  });

  it("requires a valid e-mail and a password", () => {
    const result = loginSchema.safeParse({ email: "invalid", password: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(["email", "password"]);
  });
});

describe("registerSchema", () => {
  it("accepts valid data, with or without birth date", () => {
    expect(registerSchema.safeParse(validRegister).success).toBe(true);
    expect(registerSchema.safeParse({ ...validRegister, birthDate: "" }).success).toBe(true);
  });

  it("rejects short names", () => {
    const result = registerSchema.safeParse({ ...validRegister, firstName: "Jo", lastName: " " });
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(["firstName", "lastName"]);
  });

  it("rejects birth dates in the future", () => {
    const nextYear = new Date().getFullYear() + 1;
    const result = registerSchema.safeParse({ ...validRegister, birthDate: `${nextYear}-01-01` });
    expect(firstIssue(result)).toBe("Birth date cannot be in the future");
  });
});
