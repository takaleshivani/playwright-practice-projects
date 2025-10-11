import { test, expect } from "@playwright/test";

test.describe("Home page with no auth", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test", async ({ page, headless }) => {
    await page.waitForLoadState("networkidle");
    headless
      ? await test.step("visual test", async () => {
          await expect(page).toHaveScreenshot("home-page-no-auth.png", {
            mask: [page.getByTitle("Practice Software Testing - Toolshop")],
          });
        })
      : console.log("Running in Headed mode, no screenshot comparison");
  });

  test("check sign in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).toHaveText("Sign in");
  });

  test("validate page title", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Practice Software Testing - Toolshop - v5.0"
    );
  });

  test("grid loads with 9 items", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid.getByRole("link")).toHaveCount(9);
    expect(await productGrid.getByRole("link").count()).toBe(9);
  });

  test("search for Thor Hammer", async ({ page }) => {
    const productGrid = page.locator(".col-md-9");
    await page.getByTestId("search-query").fill("Thor Hammer");
    await page.getByTestId("search-submit").click();
    await expect(productGrid.getByRole("link")).toHaveCount(1);
    await expect(page.getByAltText("Thor Hammer")).toBeVisible();
  });
});

test.describe("Home page customer 01 auth", () => {
  test.use({ storageState: ".auth/customer01.json" });
  test.beforeEach(async ({ page }) => {
    await page.goto("https://practicesoftwaretesting.com/");
  });

  test("visual test authorized", async ({ page, headless }) => {
    await page.waitForLoadState("networkidle");
    headless
      ? await test.step("visual test", async () => {
          await expect(page).toHaveScreenshot("home-page-customer01.png", {
            mask: [page.getByTitle("Practice Software Testing - Toolshop")],
          });
        })
      : console.log("Running in Headed mode, no screenshot comparison");
  });
  test("check customer 01 is signed in", async ({ page }) => {
    await expect(page.getByTestId("nav-sign-in")).not.toBeVisible();
    await expect(page.getByTestId("nav-menu")).toContainText("Jane Doe");
  });



});

/**
 * Validates that product data fetched from the API is displayed in the UI.
 * - Intercepts the /products API response and saves it.
 * - Navigates to the home page and waits for product grid to load.
 * - Asserts that each product's name and price from the API are visible in the UI.
 * - Checks for the presence of a specific product ("Hammer") in the grid.
 */
test("validate product data is visible in UI from API", async ({page}) => {
    let productsAPIResponse: any;
    await test.step("intercept /products", async () => {
       await page.route(
        "https://api.practicesoftwaretesting.com/products**", 
        async (route) => {
        const response = await route.fetch();
        productsAPIResponse = await response.json();
        console.log(productsAPIResponse);
        route.continue();
       });
   });
   await page.goto("/");
   await expect(page.locator(".skeleton").first()).not.toBeVisible();
   const productGrid = page.locator(".col-md-9");

   for(const product of productsAPIResponse.data){
    await expect(productGrid).toContainText(product.name);
    await expect(productGrid).toContainText(product.price.toString());
    }

   await expect(productGrid).toContainText("Hammer");
}); 

