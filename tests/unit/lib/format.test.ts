import { formatDate, toIsoDate } from "@/lib/format";

describe("formatDate", () => {
  it("formats ISO dates in UTC so birth dates never shift a day", () => {
    expect(formatDate("1994-03-12T00:00:00.000Z")).toBe("Mar 12, 1994");
  });

  it.each([undefined, null, "", "not-a-date"])("returns a dash for %s", (value) => {
    expect(formatDate(value)).toBe("—");
  });
});

describe("toIsoDate", () => {
  it("converts a date input value into an ISO string at midnight UTC", () => {
    expect(toIsoDate("2000-07-23")).toBe("2000-07-23T00:00:00.000Z");
  });

  it.each([undefined, "", "2000-13-45"])("returns undefined for %s", (value) => {
    expect(toIsoDate(value)).toBeUndefined();
  });
});
