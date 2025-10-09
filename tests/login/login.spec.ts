import { test, expect } from '@playwright/test';
import { registerUser } from '../../lib/datafactory/register';
import {LoginPage } from '../../lib/pages/login.page';

/**
 * Playwright test suite for login functionality.
 * This test navigates to the Practice Software Testing website
 * and prepares for login-related test cases.
 */
test.describe('Home Page  with no auth', () => {
test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
});


test("Check Sign In Page", async ({ page }) => {
    await expect(page.locator('[data-test="nav-sign-in"]')).toHaveText("Sign in");
});

});


test.describe('Home Page with auth', () => {
  test.use({ storageState: "./.auth/customer01.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/"); // Go to home page
  });

  test("check user is logged in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();  
  });
});

test("login with newly registered user", async ({ page }) => {
  const email = `test${Date.now()}@test.com`;
  const password = "Sambhajinagar@1104";

  await registerUser(email, password);

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(email, password);

  await expect(page.getByTestId("nav-menu")).toContainText("Test User");
});
