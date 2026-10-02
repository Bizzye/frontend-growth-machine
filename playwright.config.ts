import { defineConfig, devices } from "@playwright/test";

const APP_PORT = 3100;
const MOCK_API_PORT = 4010;
const BASE_URL = `http://localhost:${APP_PORT}`;
const MOCK_API_URL = `http://localhost:${MOCK_API_PORT}/api`;

/**
 * Optional: run the suite against an already running environment instead of the local build +
 * mock API, e.g. the Docker full stack: `E2E_BASE_URL=http://localhost:3000 npm run test:e2e`
 * (requires the demo users from the backend seed).
 */
const EXTERNAL_BASE_URL = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  expect: { timeout: 10_000 },
  use: {
    baseURL: EXTERNAL_BASE_URL ?? BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /screenshots\.spec\.ts/,
    },
    {
      // Generates the images used in the README: `npm run screenshots`
      name: "screenshots",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
      testMatch: /screenshots\.spec\.ts/,
    },
  ],
  webServer: EXTERNAL_BASE_URL
    ? undefined
    : [
        {
          command: "npm run mock:api",
          url: `${MOCK_API_URL}/health`,
          env: { MOCK_API_PORT: String(MOCK_API_PORT) },
          reuseExistingServer: !process.env.CI,
        },
        {
          // Production build: closer to what users get and much less flaky than `next dev`.
          command: `npm run build && npm run start -- --port ${APP_PORT}`,
          url: `${BASE_URL}/login`,
          timeout: 240_000,
          reuseExistingServer: !process.env.CI,
          env: {
            NEXT_PUBLIC_API_URL: MOCK_API_URL,
            NEXTAUTH_URL: BASE_URL,
            NEXTAUTH_SECRET: "e2e-only-secret-do-not-use-in-production",
          },
        },
      ],
});
