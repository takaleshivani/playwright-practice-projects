import { Given, When, Then, Before, After } from "@cucumber/cucumber";
import { registerUser } from "@datafactory/register";
import { LoginPage } from "@pages/login/login.page";
import { chromium, Browser, Page, expect } from "@playwright/test";

import 'dotenv/config';

let browser: Browser;
let page: Page;
let loginPage: LoginPage;

const email = `test${Date.now()}@test.com`;
const password = "Sambhajinagar@1104";

// --------------------- HOOKS ---------------------
Before({ timeout: 30000 }, async function () {
  console.log("Launching browser...");
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
  loginPage = new LoginPage(page);
});

// After(async function () {
//   if (page && !page.isClosed()) await page.close();
//   if (browser) await browser.close();
// });

// --------------------- STEPS ---------------------
Given("the new user is registered using api", async function () {
  await registerUser(email, password);
  console.log("User registered via API");
});

Then("the user is on the login page", { timeout: 20000 }, async function () {
  await loginPage.goto();
  console.log("User navigated to login page:", await page.url());
});

When("the user enters valid credentials", { timeout: 30000 }, async function () {
  // Debugging: pause Playwright Inspector
//   await page.pause();

  console.log("About to login with email:", email);

  try {
    await page.waitForLoadState('domcontentloaded');
    await loginPage.login(email, password);
    console.log("Login attempted successfully");
  } catch (err) {
    console.error("Login failed:", err);
  }
});

Then("the user should be able to log in successfully", async function () {
  await expect(page.locator('[data-test="nav-menu"]')).toContainText("Test User");
  console.log("User login verified successfully");
});
