import { http, HttpResponse } from "msw";

import { toPublicUser, usersFixture } from "../fixtures/users";

/** Backend API (public endpoints called from the browser). */
export const API_URL = "http://localhost:3333/api";
export const apiUrl = (path: string) => `${API_URL}${path}`;

/** Next.js route handlers (BFF), called with relative URLs from the browser. */
export const bffUrl = (path: string) => `/api${path}`;

export const handlers = [
  http.get(bffUrl("/users"), () => HttpResponse.json(usersFixture.map(toPublicUser))),

  http.post(apiUrl("/users"), async ({ request }) => {
    const body = (await request.json()) as { email: string };

    if (usersFixture.some((user) => user.email === body.email)) {
      return HttpResponse.json(
        { code: "USER_ALREADY_EXISTS", message: "User already exists" },
        { status: 409 },
      );
    }

    return HttpResponse.json({ id: "new-user-id", ...body }, { status: 201 });
  }),
];
