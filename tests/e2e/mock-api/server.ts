/**
 * Minimal in-memory implementation of the backend contract (backend-growth-machine),
 * used by the E2E tests and the README screenshots so they run without MongoDB.
 *
 * Run with: `npm run mock:api` (Node >= 22.18 runs TypeScript natively).
 */
import { randomUUID } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

import { toPublicUser, type UserFixture, usersFixture } from "../../fixtures/users.ts";

const PORT = Number(process.env.MOCK_API_PORT ?? 4010);
const PREFIX = "/api";
const TOKEN_PREFIX = "mock-token-";

let users: UserFixture[] = structuredClone(usersFixture);

function send(res: ServerResponse, status: number, body?: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  });
  res.end(body === undefined ? undefined : JSON.stringify(body));
}

function sendError(res: ServerResponse, status: number, code: string, message: string) {
  send(res, status, { code, message });
}

async function readJson(req: IncomingMessage): Promise<Record<string, string | undefined>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function isAuthenticated(req: IncomingMessage): boolean {
  const token = req.headers.authorization?.replace(/^Bearer /, "") ?? "";
  return token.startsWith(TOKEN_PREFIX) && users.some((user) => `${TOKEN_PREFIX}${user.id}` === token);
}

const routes: Record<string, (req: IncomingMessage, res: ServerResponse) => Promise<void> | void> = {
  "GET /health": (_req, res) => send(res, 200, { status: "ok" }),

  "GET /users": (req, res) => {
    if (!isAuthenticated(req)) return sendError(res, 401, "UNAUTHORIZED", "Authentication required");
    send(res, 200, users.map(toPublicUser));
  },

  "POST /users": async (req, res) => {
    const { email, password, firstName, lastName, birthDate } = await readJson(req);

    if (!email || !password || !firstName || !lastName) {
      return sendError(res, 400, "VALIDATION_ERROR", "Invalid request data");
    }
    if (users.some((user) => user.email === email)) {
      return sendError(res, 409, "USER_ALREADY_EXISTS", "User already exists");
    }

    const user: UserFixture = {
      id: randomUUID().replaceAll("-", "").slice(0, 24),
      email,
      password,
      firstName,
      lastName,
      birthDate: birthDate ?? null,
      createdAt: new Date().toISOString(),
    };
    users.push(user);

    return send(res, 201, toPublicUser(user));
  },

  "POST /auth/login": async (req, res) => {
    const { email, password } = await readJson(req);
    const user = users.find((candidate) => candidate.email === email);

    if (!user || user.password !== password) {
      return sendError(res, 401, "INVALID_CREDENTIALS", "Invalid credentials");
    }

    const { id, firstName, lastName } = user;
    return send(res, 200, { token: `${TOKEN_PREFIX}${id}`, user: { id, email, firstName, lastName } });
  },

  /** Test helper: restores the initial dataset. */
  "POST /__reset": (_req, res) => {
    users = structuredClone(usersFixture);
    send(res, 204);
  },
};

const server = createServer(async (req, res) => {
  if (req.method === "OPTIONS") return send(res, 204);

  const path = (req.url ?? "").split("?")[0]!.replace(PREFIX, "");
  const handler = routes[`${req.method} ${path}`];

  try {
    if (handler) return await handler(req, res);
    sendError(res, 404, "NOT_FOUND", "Route not found");
  } catch (error) {
    console.error(error);
    sendError(res, 500, "INTERNAL_ERROR", "Internal server error");
  }
});

server.listen(PORT, () => console.log(`Mock API listening on http://localhost:${PORT}${PREFIX}`));
