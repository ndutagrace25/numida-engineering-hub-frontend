import { expect, test } from "@playwright/test";

// Runs against the real backend (see tests/e2e/auth.setup.ts) as the
// seeded qa.tester account.

test("adding a PR link persists, groups by group name, and links out to the URL", async ({
  page,
}) => {
  await page.goto("/pull-requests");
  await page.waitForSelector('h2:has-text("Outstanding pull requests")');

  await page.getByRole("button", { name: "New PR link" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  const marker = `E2E PR ${Date.now()}`;
  const groupName = `e2e-group-${Date.now()}`;
  await page.getByLabel("Title").fill(marker);
  await page.getByLabel("URL").fill("https://github.com/org/repo/pull/1");
  await page.getByLabel("Group").fill(groupName);
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByText(marker)).toBeVisible();
  await expect(page.getByText(groupName, { exact: true })).toBeVisible();

  const row = page.locator("a", { hasText: marker });
  await expect(row).toHaveAttribute(
    "href",
    "https://github.com/org/repo/pull/1",
  );
  await expect(row.getByText("Open")).toBeVisible();

  await page.reload();
  await expect(page.getByText(marker)).toBeVisible();
});

test("an empty title shows a validation error and does not submit", async ({
  page,
}) => {
  await page.goto("/pull-requests");
  await page.getByRole("button", { name: "New PR link" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByLabel("URL").fill("https://github.com/org/repo/pull/1");
  await page.getByLabel("Group").fill("numida-core");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(page.getByText("Title is required")).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
});
