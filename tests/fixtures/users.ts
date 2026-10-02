/**
 * Shared test data used by both the MSW handlers (unit tests) and the mock API server (E2E).
 * Keep this file dependency-free: it is executed directly by Node (type stripping).
 */
export interface UserFixture {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  createdAt: string;
  password: string;
}

export const DEMO_USER = {
  email: "jane.cooper@example.com",
  password: "Str0ng!Pass",
  firstName: "Jane",
  lastName: "Cooper",
} as const;

export const usersFixture: UserFixture[] = [
  {
    id: "65d1f0a2c3b4a5e6f7a8b901",
    ...DEMO_USER,
    birthDate: "1994-03-12T00:00:00.000Z",
    createdAt: "2024-02-18T14:32:00.000Z",
  },
  {
    id: "65d1f0a2c3b4a5e6f7a8b902",
    email: "wade.warren@example.com",
    password: "Str0ng!Pass",
    firstName: "Wade",
    lastName: "Warren",
    birthDate: "1988-11-02T00:00:00.000Z",
    createdAt: "2024-02-19T09:10:00.000Z",
  },
  {
    id: "65d1f0a2c3b4a5e6f7a8b903",
    email: "esther.howard@example.com",
    password: "Str0ng!Pass",
    firstName: "Esther",
    lastName: "Howard",
    birthDate: null,
    createdAt: "2024-03-01T18:45:00.000Z",
  },
  {
    id: "65d1f0a2c3b4a5e6f7a8b904",
    email: "cameron.williamson@example.com",
    password: "Str0ng!Pass",
    firstName: "Cameron",
    lastName: "Williamson",
    birthDate: "2000-07-23T00:00:00.000Z",
    createdAt: "2024-03-05T11:20:00.000Z",
  },
  {
    id: "65d1f0a2c3b4a5e6f7a8b905",
    email: "brooklyn.simmons@example.com",
    password: "Str0ng!Pass",
    firstName: "Brooklyn",
    lastName: "Simmons",
    birthDate: "1997-01-30T00:00:00.000Z",
    createdAt: "2024-03-12T16:05:00.000Z",
  },
  {
    id: "65d1f0a2c3b4a5e6f7a8b906",
    email: "leslie.alexander@example.com",
    password: "Str0ng!Pass",
    firstName: "Leslie",
    lastName: "Alexander",
    birthDate: "1991-09-14T00:00:00.000Z",
    createdAt: "2024-04-02T08:55:00.000Z",
  },
];

/** Strips the password, mirroring the backend `GET /users` response. */
export function toPublicUser({ password: _password, ...user }: UserFixture) {
  return user;
}
