import { test as setup, expect } from "@playwright/test";

const TEST_EMAIL = process.env.E2E_TEST_EMAIL || "test@distill.app";
const TEST_PASSWORD = process.env.E2E_TEST_PASSWORD || "TestPassword123!";

setup("authenticate", async ({ page }) => {
  await page.goto("/sign-in");

  // Clerk renders its own sign-in form
  // Wait for Clerk's email input to appear
  const emailInput = page.locator('input[name="identifier"]');
  await emailInput.waitFor({ timeout: 10000 });
  await emailInput.fill(TEST_EMAIL);

  // Click continue
  await page.getByRole("button", { name: /continue/i }).click();

  // Fill password
  const passwordInput = page.locator('input[name="password"]');
  await passwordInput.waitFor({ timeout: 10000 });
  await passwordInput.fill(TEST_PASSWORD);

  // Click sign in
  await page.getByRole("button", { name: /sign in/i }).click();

  // Wait for redirect to dashboard
  await page.waitForURL("/dashboard**", { timeout: 15000 });
  await expect(page.locator("text=dashboard")).toBeVisible();

  // Save auth state
  await page.context().storageState({ path: "e2e/.auth/user.json" });
});
