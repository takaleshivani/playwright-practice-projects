import { test, expect } from '@playwright/test';


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
