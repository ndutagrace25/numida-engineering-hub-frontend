import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
// Must be "localhost", not "127.0.0.1": the backend's session cookie is set
// for the "localhost" host the frontend calls it through, and Chrome treats
// "localhost"/"127.0.0.1" as different sites for SameSite=Lax cookie
// purposes — a page served from 127.0.0.1 would silently never receive or
// send that cookie at all, breaking every authenticated request.
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    // auth.setup.ts logs in once against the real backend and saves the
    // session cookie to tests/e2e/.auth/user.json.
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    // auth.spec.ts exercises the unauthenticated experience itself (login,
    // invalid credentials, redirects) — it must NOT start pre-authenticated.
    {
      name: "chromium-unauthenticated",
      testMatch: /auth\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    // Every other spec assumes an authenticated session already exists.
    {
      name: "chromium",
      testIgnore: /auth\.(spec|setup)\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "tests/e2e/.auth/user.json",
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
