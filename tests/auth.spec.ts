import { test as setup, expect } from '@playwright/test';


/**
 * Playwright setup test for customer authentication.
 * Logs in as customer 01, verifies successful login,
 * and saves authentication state to a file for reuse in other tests.
 */
setup("Create customer 01 auth", async ({ page }) => {
    const username = "customer@practicesoftwaretesting.com";
    const password = "welcome01";
    const customer01File=".auth/customer01.json";
    
    await page.goto('https://practicesoftwaretesting.com/auth/login');
    //fill email

    await page.getByTestId('email').fill(username);
    //fill password
    await page.getByTestId('password').fill(password);
    //click 
    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
    await page.context().storageState({ path: customer01File });
});