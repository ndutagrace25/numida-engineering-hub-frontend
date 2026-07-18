import { expect, test } from "@playwright/test";

// Runs against the real backend (see tests/e2e/auth.setup.ts) as the
// seeded qa.tester account.

test("requesting PTO with a reason and handover URL persists and shows a derived status", async ({
  page,
}) => {
  await page.goto("/pto");
  await page.waitForSelector('div:has-text("PTO")');

  await page.getByRole("button", { name: "Request PTO" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByLabel("Start date").fill("2026-09-10");
  await page.getByLabel("End date").fill("2026-09-12");
  const marker = `E2E PTO reason ${Date.now()}`;
  await page.getByLabel("Reason (optional)").fill(marker);
  await page
    .getByLabel("Handover notes URL (optional)")
    .fill("https://example.com/handover-notes");
  await page.getByRole("button", { name: "Submit request" }).click();

  await expect(page.getByRole("dialog")).not.toBeVisible();

  const row = page
    .locator(".rounded-xl")
    .filter({ hasText: "Sep 10 – Sep 12 · 3 days" })
    .first();
  await expect(row).toBeVisible();
  await expect(row.getByText("Upcoming")).toBeVisible();
  await expect(row.getByRole("link", { name: /notes/ })).toHaveAttribute(
    "href",
    "https://example.com/handover-notes",
  );
});

test("an invalid date range shows a validation error and does not submit", async ({
  page,
}) => {
  await page.goto("/pto");
  await page.getByRole("button", { name: "Request PTO" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByLabel("Start date").fill("2026-09-20");
  await page.getByLabel("End date").fill("2026-09-01");
  await page.getByRole("button", { name: "Submit request" }).click();

  await expect(
    page.getByText("End date can't be before the start date"),
  ).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
});
