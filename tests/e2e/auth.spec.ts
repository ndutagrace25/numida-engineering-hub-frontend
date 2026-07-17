import { expect, test } from "@playwright/test";

// These tests run against a real Django backend (see README's
// "Authentication" section for how to start it and seed the test account
// below). E2E_TEST_EMAIL / E2E_TEST_PASSWORD let CI or another developer
// point at a different seeded account without editing this file.
const EMAIL = process.env.E2E_TEST_EMAIL ?? "qa.tester@numida.com";
const PASSWORD = process.env.E2E_TEST_PASSWORD ?? "TestPass123!";

async function login(page: import("@playwright/test").Page) {
  await page.getByLabel("Work email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(/\/dashboard/);
}

test("an unauthenticated visitor is redirected to login and back after signing in", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/auth\/login\?next=%2Fdashboard/);
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();

  await login(page);

  await expect(page).toHaveURL("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
});

test("redirects back to the originally requested protected page after login", async ({
  page,
}) => {
  await page.goto("/pto");

  await expect(page).toHaveURL(/\/auth\/login\?next=%2Fpto/);

  await page.getByLabel("Work email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page).toHaveURL("/pto");
});

test("invalid credentials show an error and keep the visitor on the login page", async ({
  page,
}) => {
  await page.goto("/auth/login");

  await page.getByLabel("Work email").fill(EMAIL);
  await page.getByLabel("Password").fill("definitely-the-wrong-password");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(
    page.getByText("Unable to log in with the provided credentials."),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/login/);
});

test("session persists across a full page reload", async ({ page }) => {
  await page.goto("/auth/login");
  await login(page);

  await page.reload();

  await expect(page).toHaveURL("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
});

test("an authenticated visitor is bounced away from the login page", async ({
  page,
}) => {
  await page.goto("/auth/login");
  await login(page);

  await page.goto("/auth/login");

  await expect(page).toHaveURL("/dashboard");
});

test("logging out clears the session and protects routes again", async ({
  page,
}) => {
  await page.goto("/auth/login");
  await login(page);

  await page.getByRole("button", { name: /account menu/i }).click();
  await page.getByRole("menuitem", { name: /log out/i }).click();

  await expect(page).toHaveURL(/\/auth\/login/);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/auth\/login\?next=%2Fdashboard/);
});
