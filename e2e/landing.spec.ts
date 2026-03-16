import { test, expect } from "@playwright/test";

// Landing page is public — no auth needed
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Landing Page", () => {
  test("loads with hero text and CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=think more clearly")).toBeVisible();
    await expect(page.locator("text=start your journey")).toBeVisible();
  });

  test("hero CTA links to /start", async ({ page }) => {
    await page.goto("/");
    const cta = page.locator('a:has-text("start your journey")');
    await expect(cta).toHaveAttribute("href", /\/start/);
  });

  test("navigation contains sign-in link", async ({ page }) => {
    await page.goto("/");
    const signInLink = page.locator('a:has-text("get early access")');
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute("href", /\/sign-in/);
  });

  test("FAQ section is present with expandable items", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=questions you might have")).toBeVisible();
    const faqItems = page.locator("details");
    await expect(faqItems.first()).toBeVisible();
  });

  test("final CTA links to sign-up", async ({ page }) => {
    await page.goto("/");
    const finalCta = page.locator('a:has-text("start reflecting")');
    await expect(finalCta).toHaveAttribute("href", /\/sign-up/);
  });
});
