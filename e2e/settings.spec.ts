import { test, expect } from "@playwright/test";

test.describe("Settings", () => {
  test("loads settings page with all sections", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await expect(page.locator("text=Settings")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=BILLING")).toBeVisible();
    await expect(page.locator("text=STREAK FREEZE")).toBeVisible();
  });

  test("shows current plan", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await page.waitForTimeout(2000);
    await expect(page.locator("text=Current Plan")).toBeVisible();
  });

  test("has timezone dropdown", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await page.waitForTimeout(2000);
    const select = page.locator("select").first();
    if (await select.isVisible()) {
      const options = await select.locator("option").count();
      expect(options).toBeGreaterThan(0);
    }
  });

  test("delete account requires confirmation phrase", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await page.waitForTimeout(2000);

    const deleteBtn = page.locator('button:has-text("Delete My Account")');
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      // Confirmation input should appear
      await expect(page.locator('text=Type "DELETE MY ACCOUNT" to confirm')).toBeVisible();

      // Confirm button should be disabled until phrase matches
      const confirmBtn = page.locator('button:has-text("Confirm Irreversible Deletion")');
      await expect(confirmBtn).toBeDisabled();

      // Cancel should dismiss
      const cancelBtn = page.locator('button:has-text("Cancel")');
      await cancelBtn.click();
      await expect(
        page.locator('text=Type "DELETE MY ACCOUNT" to confirm')
      ).not.toBeVisible();
    }
  });
});
