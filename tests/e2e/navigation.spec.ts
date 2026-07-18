import { expect, test } from "@playwright/test";

// Smoke/navigation checks confirming the implemented routes build, serve,
// and link to each other correctly — not full product tests. Those arrive
// alongside real backend-connected feature work.

test("/ redirects to the dashboard", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
});

test("sidebar links navigate to each implemented screen", async ({ page }) => {
  await page.goto("/dashboard");

  const nav = page.getByRole("navigation", { name: "Primary" });

  await nav.getByRole("link", { name: "Standups" }).click();
  await expect(page).toHaveURL("/standups");
  await expect(page.getByText("This week's standup")).toBeVisible();

  await nav.getByRole("link", { name: "My History" }).click();
  await expect(page).toHaveURL(/\/standups\/history/);
  await expect(page.getByRole("button", { name: "My History" })).toBeVisible();

  await nav.getByRole("link", { name: "PTO" }).click();
  await expect(page).toHaveURL("/pto");
  await expect(
    page.getByRole("heading", { name: "PTO", exact: true }),
  ).toBeVisible();

  await nav.getByRole("link", { name: "AOB" }).click();
  await expect(page).toHaveURL("/aob");
  await expect(page.getByText("Any Other Business")).toBeVisible();

  await nav.getByRole("link", { name: "Pull Requests" }).click();
  await expect(page).toHaveURL("/pull-requests");
  await expect(page.getByText("Outstanding pull requests")).toBeVisible();

  await nav.getByRole("link", { name: "Dashboard" }).click();
  await expect(page).toHaveURL("/dashboard");
});

test("the dashboard's Weekly Standups widget links to the team weekly view", async ({
  page,
}) => {
  await page.goto("/dashboard");

  await page.getByRole("link", { name: "Team view →" }).click();

  await expect(page).toHaveURL(/\/standups\/weekly/);
  await expect(
    page.getByRole("heading", { name: "Team Weekly View" }),
  ).toBeVisible();
});

test("hovering a Weekly Standups avatar shows the engineer's full name", async ({
  page,
}) => {
  await page.goto("/dashboard");

  const avatar = page
    .locator('[data-slot="tooltip-trigger"]', { hasText: "GN" })
    .first();
  await avatar.hover();

  await expect(page.locator('[data-slot="tooltip-content"]')).toHaveText(
    "Grace Nduta",
  );
});

test("mobile viewport shows the menu trigger and opens the navigation drawer", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");

  const menuButton = page.getByRole("button", {
    name: /open navigation menu/i,
  });
  await expect(menuButton).toBeVisible();

  await menuButton.click();
  const drawer = page.getByRole("dialog");
  await expect(drawer.getByRole("link", { name: "Standups" })).toBeVisible();

  await drawer.getByRole("link", { name: "Standups" }).click();
  await expect(page).toHaveURL("/standups");
});
