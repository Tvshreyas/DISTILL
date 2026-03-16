import { test, expect } from "@playwright/test";

test.describe("Session Flow", () => {
  test("new session page loads with form", async ({ page }) => {
    await page.goto("/dashboard/session/new");
    await expect(page.locator("text=new session")).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[placeholder="title of the content..."]')).toBeVisible();
  });

  test("shows all content type buttons", async ({ page }) => {
    await page.goto("/dashboard/session/new");
    for (const type of ["book", "video", "article", "podcast", "other"]) {
      await expect(page.locator(`button:has-text("${type}")`)).toBeVisible();
    }
  });

  test("submit button is disabled without title", async ({ page }) => {
    await page.goto("/dashboard/session/new");
    const submitBtn = page.locator('button:has-text("start session")');
    await expect(submitBtn).toBeDisabled();
  });

  test("can fill out the session form", async ({ page }) => {
    await page.goto("/dashboard/session/new");

    await page.fill('input[placeholder="title of the content..."]', "Test Book Title");
    await page.click('button:has-text("book")');
    await page.fill(
      'textarea[placeholder="what do you hope to get from this?"]',
      "Learn something new"
    );

    const submitBtn = page.locator('button:has-text("start session")');
    await expect(submitBtn).toBeEnabled();
  });

  test("retroactive toggle works", async ({ page }) => {
    await page.goto("/dashboard/session/new");
    const toggle = page.locator('button[role="switch"]');
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  test("character counter updates on reason input", async ({ page }) => {
    await page.goto("/dashboard/session/new");
    await expect(page.locator("text=0/140")).toBeVisible();
    await page.fill(
      'textarea[placeholder="what do you hope to get from this?"]',
      "Hello"
    );
    await expect(page.locator("text=5/140")).toBeVisible();
  });
});
