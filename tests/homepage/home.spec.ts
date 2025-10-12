/**
 * Playwright test suite for Practice Software Testing home page.
 *
 * - Tests home page UI and functionality for unauthenticated and authenticated users.
 * - Includes visual regression, sign-in, product grid, search, and API data validation tests.
 * - Uses custom fixtures and storage state for user authentication scenarios.
 */
import { test, expect } from "@playwright/test";
import * as fs from 'fs';

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
        // console.log(productsAPIResponse);
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

/**
 * Validates that custom product data from a mocked API response is displayed in the UI.
 * - Intercepts and overwrites the /products API response with custom product data.
 * - Navigates to the home page and checks that the UI displays the mocked product name and price.
 * - Ensures the product grid reflects the changes made to the API response.
 */
test("validate product data is visible in UI from API - alternative", async ({page}) => {
    let productsAPIResponse: any;
    await test.step("overwrite /products", async () => {
       await page.route(
        "https://api.practicesoftwaretesting.com/products**", 
        async (route) => {
        const response = await route.fetch();
        const json = await response.json();
        json.data[0]["name"] = "My Custom Hammer";
        json.data[0]["price"] = 10000.0;
        json.data[0]["in_stock"] = false;
       await route.fulfill({response,json});
       });
       
   });
   await page.goto("/");
   const productGrid = page.locator(".col-md-9");
   await expect(productGrid.getByRole("link").first()).toContainText("My Custom Hammer");
   await expect(productGrid.getByRole("link").first()).toContainText("10000.0");
});


test('record HAR file dynamically', async ({ browser }) => {
  // Create a new context and record all requests
  const context = await browser.newContext({
    recordHar: {
      path: './hars/products.har', // HAR file will be saved here
      content: 'embed',            // Store response bodies inside HAR
    },
  });

  const page = await context.newPage();

  await page.goto('https://api.practicesoftwaretesting.com/products**');
  await page.waitForTimeout(2000); // Let it record a few requests

  await context.close();

  // Verify file was created
  console.log('HAR file saved:', fs.existsSync('./hars/products.har'));
});

/**
 * Validates that product data is loaded from a HAR file and displayed in the UI.
 * - Mocks the /products API using a pre-recorded HAR file before navigation.
 * - Navigates to the home page and checks that the product grid contains expected data from the HAR.
 * - Asserts that the price "1.99" is visible, confirming the mock worked.
 */
test("validate product data is loaded from har file", async ({ page }) => {
    // Mock /products API using HAR before navigation
    await page.routeFromHAR("./hars/products.har", {
        url: "https://api.practicesoftwaretesting.com/products**",
        update: true,
    });
    await page.goto("/");
    const productGrid = page.locator(".col-md-9");
    await expect(productGrid).toContainText("1.99");
});


/**
 * Checks for input elements on the page that do not have associated label elements.
 * - Navigates to the bug demo site.
 * - Finds all input elements without a corresponding label.
 * - Asserts that all inputs have labels for accessibility compliance.
 */
test("check for inputs without labels", async ({ page }) => {
    await page.goto("https://with-bugs.practicesoftwaretesting.com/");
     const inputWithoutLabels = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("input"))
            .filter((input) => !document.querySelector(`label[for='${input.id}']`))
            .map((input) => input.outerHTML);
    });
    expect(inputWithoutLabels.length,
        `Labels with issues: \n${inputWithoutLabels.toString()}`
    ).toBe(0);
});


/**
 * Checks for broken images on the page.
 * - Finds all image elements with zero natural height or width.
 * - Asserts that there are no broken images present on the page.
 */
test("check for broken images", async ({ page }) => {
    // await page.goto("https://with-bugs.practicesoftwaretesting.com/");
    const brokenImages = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("img"))
            .filter((img) => img.naturalHeight == 0 || img.naturalWidth === 0)
            .map((img) => img.src);
    });
    expect(brokenImages.length,
        `Broken images found: \n${brokenImages}`
    ).toBe(0);
});