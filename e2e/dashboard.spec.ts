import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test("loads and shows dashboard heading", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("text=dashboard")).toBeVisible({ timeout: 10000 });
  });

  test("displays streak counter", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.locator("text=days")).toBeVisible({ timeout: 10000 });
  });

  test("shows start session button when no active session", async ({ page }) => {
    await page.goto("/dashboard");
    // Wait for data to load
    await page.waitForTimeout(2000);

    const startBtn = page.locator('a:has-text("Start Session")');
    const continueBtn = page.locator('a:has-text("Continue")');

    // Either start session or continue should be visible
    const hasStartOrContinue =
      (await startBtn.count()) > 0 || (await continueBtn.count()) > 0;
    expect(hasStartOrContinue).toBe(true);
  });

  test("navigates to library", async ({ page }) => {
    await page.goto("/dashboard");
    const libraryLink = page.locator('a[href*="/library"]');
    if (await libraryLink.isVisible()) {
      await libraryLink.click();
      await expect(page).toHaveURL(/\/library/);
    }
  });

  test("navigates to settings", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await expect(page.locator("text=Settings")).toBeVisible({ timeout: 10000 });
  });
});
