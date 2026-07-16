import { expect, test } from "@playwright/test";

// A single smoke test confirming the app builds, starts, and serves a
// page — not a product test. Real E2E coverage arrives with each feature.
test("home page loads and shows the foundation confirmation", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /numida engineering hub — frontend foundation/i,
    }),
  ).toBeVisible();
});
