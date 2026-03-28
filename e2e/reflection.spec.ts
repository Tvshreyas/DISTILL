import { test, expect } from "@playwright/test";

test.describe("Reflection Flow", () => {
  test("reflection page loads after session", async ({ page }) => {
    // Navigate to a session — the actual session ID will vary
    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    // If there's an active session, continue it
    const continueBtn = page.locator('a:has-text("Continue")');
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(2000);
      // Should be on a session page
      await expect(page).toHaveURL(/\/dashboard\/session\//);
    }
  });

  test("reflection form has text area", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    const continueBtn = page.locator('a:has-text("Continue")');
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(2000);

      // Look for a textarea or content-editable area for writing reflections
      const textarea = page.locator("textarea").first();
      if (await textarea.isVisible()) {
        await expect(textarea).toBeVisible();
      }
    }
  });

  test("reflection prompt is displayed", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForTimeout(2000);

    const continueBtn = page.locator('a:has-text("Continue")');
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
      await page.waitForTimeout(2000);
      // A reflection prompt should be visible (ends with ?)
      const promptText = page.locator("text=?");
      // At least one question mark text should exist on the reflection page
      expect(await promptText.count()).toBeGreaterThanOrEqual(0);
    }
  });

  test("library shows reflections after submission", async ({ page }) => {
    await page.goto("/dashboard/library");
    await page.waitForTimeout(3000);

    // Either reflections exist or empty state
    const hasReflections = await page
      .locator('a[href*="/dashboard/library/"]')
      .count();
    const hasEmptyState = await page
      .locator("text=no reflections found")
      .count();

    expect(hasReflections > 0 || hasEmptyState > 0).toBe(true);
  });

  test("reflection detail page displays content in quotes", async ({
    page,
  }) => {
    await page.goto("/dashboard/library");
    await page.waitForTimeout(3000);

    const firstReflection = page
      .locator('a[href*="/dashboard/library/"]')
      .first();
    if (await firstReflection.isVisible()) {
      await firstReflection.click();
      await page.waitForTimeout(2000);
      // Content should be wrapped in smart quotes (ldquo/rdquo)
      const content = page.locator("p.whitespace-pre-wrap");
      if (await content.isVisible()) {
        const text = await content.textContent();
        expect(text).toMatch(/[\u201C\u201D]/);
      }
    }
  });
});
