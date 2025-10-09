import {test, expect} from '@playwright/test';
import { randomState } from '../lib/helpers/states';

/**
 * Checkout Challenge Test
 * Simulates a logged-in customer adding a product to the cart,
 * completing checkout steps, selecting a payment method,
 * and verifying successful payment.
 */
test.describe('Checkout Challenge', () => {
    test.use({ storageState: "./.auth/customer01.json" });

    test.beforeEach(async ({ page }) => {   
        await page.goto('https://practicesoftwaretesting.com/');
    });

    

    test('Add product to cart', async ({ page,headless }) => {
    await page.getByTestId('product-01K73J0SAS5BSA9D613F7P1ZBT').click();
    await page.locator('[data-test="add-to-cart"]').click();
    await page.locator('div').filter({ hasText: 'Product added to shopping' }).nth(2).click();
    await page.locator('[data-test="nav-cart"]').click();
    await page.locator('[data-test="proceed-1"]').click();
    await page.locator('[data-test="proceed-2"]').click();
    await expect(
      page.locator(".step-indicator").filter({ hasText: "2" })
    ).toHaveCSS("background-color", "rgb(51, 153, 51)");
    await page.getByTestId("state").fill(randomState());
    await page.getByTestId("postal_code").fill("98765");
    await page.getByTestId("proceed-3").click();
    await expect(page.getByTestId("finish")).toBeDisabled();
    await page.getByTestId("payment-method").selectOption("Buy Now Pay Later");
    await page
      .getByTestId("monthly_installments")
      .selectOption("6 Monthly Installments");
    await page.getByTestId("finish").click();
    await expect(page.locator(".help-block")).toHaveText(
      "Payment was successful"
    );
  });

  
});


/**
 * API Challenge Test
 * Sends requests to the product API to search for a product by name,
 * retrieves its details, and verifies the product's name, price, description, and ID.
 */
test.describe('API challenge', () => {
    test('Get /products/{id}', async ({ request }) => {   
        const apiURL = "https://api.practicesoftwaretesting.com";
        const getProductResponse = await request.get(
                apiURL + "/products/search?q=thor%20hammer"
        );
        expect(getProductResponse.status()).toBe(200);
        const productBody = await getProductResponse.json();
        const productId = productBody.data[0].id;

        const response = await request.get(apiURL + "/products/" + productId);

        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        console.log(responseBody);
        console.log("Product Name : ", responseBody.name);
        expect(responseBody.name).toBe("Thor Hammer");
        expect(responseBody.price).toBe(11.14);
        expect(responseBody.description).toBe(
                "Donec malesuada tempus purus. Integer sit amet arcu magna. Sed vel laoreet ligula, non sollicitudin ex. Mauris euismod ac dolor venenatis lobortis. Aliquam iaculis at diam nec accumsan. Ut sodales sed elit et imperdiet. Maecenas vitae molestie mauris. Integer quis placerat libero, in finibus diam. Interdum et malesuada fames ac ante ipsum primis in faucibus."
        );
        expect(responseBody.id).toBe(productId);
        expect(responseBody.price).toBeNumber();
    }
    );
});