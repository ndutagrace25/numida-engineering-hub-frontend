import { expect, test } from "@playwright/test";

// Runs against the real backend (see tests/e2e/auth.setup.ts) as the
// seeded qa.tester account.

test("posting an AOB item with a link persists and shows on reload", async ({
  page,
}) => {
  await page.goto("/aob");
  await page.waitForSelector('h2:has-text("Any Other Business")');

  await page.getByRole("button", { name: "New post" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  const marker = `E2E AOB post ${Date.now()}`;
  await page.getByLabel("Title").fill(marker);
  await page.getByLabel("Body").fill("Details raised by an e2e test.");
  await page.getByLabel("Link (optional)").fill("https://example.com/notes");
  await page.getByRole("button", { name: "Post" }).click();

  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByText(marker)).toBeVisible();

  await page.reload();
  await expect(page.getByText(marker)).toBeVisible();
  const card = page
    .locator(".rounded-xl")
    .filter({ hasText: marker })
    .first();
  await expect(card.getByRole("link", { name: /Learn more/ })).toHaveAttribute(
    "href",
    "https://example.com/notes",
  );
});

test("an empty title shows a validation error and does not submit", async ({
  page,
}) => {
  await page.goto("/aob");
  await page.getByRole("button", { name: "New post" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("button", { name: "Post" }).click();

  await expect(page.getByText("Title is required")).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
});
