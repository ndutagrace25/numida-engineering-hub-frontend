import { test as setup } from "@playwright/test";

// Logs in once against the real backend and saves the resulting session
// cookie so every other (authenticated) test project starts already signed
// in, instead of repeating a login flow in every test file. See the
// README's "Authentication" section for how to seed this account locally.
const EMAIL = process.env.E2E_TEST_EMAIL ?? "qa.tester@numida.com";
const PASSWORD = process.env.E2E_TEST_PASSWORD ?? "TestPass123!";
const authFile = "tests/e2e/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/auth/login");
  await page.getByLabel("Work email").fill(EMAIL);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(/\/dashboard/);

  await page.context().storageState({ path: authFile });
});
