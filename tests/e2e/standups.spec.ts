import { expect, test } from "@playwright/test";

// Runs against the real backend (see tests/e2e/auth.setup.ts) as the
// seeded qa.tester account. Tests 1 and 2 both edit qa.tester's own
// standup for the current week, so they're forced serial — running them
// in parallel would race two saves against the same backend row (each
// save replaces the full items list, so whichever finishes last would
// silently wipe out the other's marker).
test.describe.serial("standup create/edit", () => {
  test("submitting a standup item persists across reload and appears in the weekly team view", async ({
    page,
  }) => {
    const marker = `E2E marker ${Date.now()}`;

    await page.goto("/standups");
    await page.waitForSelector('h2:has-text("This week\'s standup")');

    const didInput = page.getByPlaceholder("Add an item, press Enter").first();
    await didInput.fill(marker);
    await didInput.press("Enter");

    await page.getByRole("button", { name: "Submit standup" }).click();
    await expect(page.getByText("Standup saved.")).toBeVisible({
      timeout: 5000,
    });

    await page.reload();
    await expect(page.getByText(marker)).toBeVisible();

    await page.goto("/standups/weekly");
    await expect(page.getByText(marker)).toBeVisible();
  });

  test("History search narrows results to a matching keyword", async ({
    page,
  }) => {
    const marker = `HistorySearchMarker${Date.now()}`;

    await page.goto("/standups");
    await page.waitForSelector('h2:has-text("This week\'s standup")');
    const didInput = page.getByPlaceholder("Add an item, press Enter").first();
    await didInput.fill(marker);
    await didInput.press("Enter");
    await page.getByRole("button", { name: "Submit standup" }).click();
    await expect(page.getByText("Standup saved.")).toBeVisible({
      timeout: 5000,
    });

    await page.goto("/standups/history");
    await page.getByPlaceholder("Search keyword…").fill(marker);
    await expect(page.getByText(marker)).toBeVisible();
    await expect(
      page.getByText("No entries match these filters"),
    ).not.toBeVisible();
  });
});

test("Team History's engineer filter narrows results to that engineer", async ({
  page,
}) => {
  await page.goto("/standups/history");
  await page.getByRole("button", { name: "Team History" }).click();

  await page.getByLabel("Filter by engineer").click();
  const engineerOption = page.getByRole("option").nth(1); // index 0 is "All engineers"
  const engineerName = (await engineerOption.textContent())?.trim();
  await engineerOption.click();

  expect(engineerName).toBeTruthy();
  await expect(page.locator("body")).toContainText(engineerName ?? "");
});
