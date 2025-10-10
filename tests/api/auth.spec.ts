import { test as setup, expect } from '@playwright/test';
import {LoginPage } from '../../lib/pages/login/login.page';
import { log } from 'console';

/**
 * Playwright setup test for customer authentication.
 * Logs in as customer 01, verifies successful login,
 * and saves authentication state to a file for reuse in other tests.
 */
setup("Create customer 01 auth", async ({ page }) => {
    const username = "customer@practicesoftwaretesting.com";
    const password = "welcome01";
    const customer01File=".auth/customer01.json";
    
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    // //fill email
    // await loginPage.emailInput.fill(username);
    // //fill password
    // await loginPage.passwordInput.fill(password);
    // //click 
    // await loginPage.loginInButton.click();
    await loginPage.login(username, password);

    await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
    await page.context().storageState({ path: customer01File });
});

