import {test, expect} from '@playwright/test';

test.describe('Checkout Challenge', () => {
    test.use({ storageState: "./.auth/customer01.json" });

    test.beforeEach(async ({ page }) => {   
        await page.goto('https://practicesoftwaretesting.com/');
    });

  test('Add product to cart', async ({ page,headless }) => {
    await page.locator('[data-test="product-01K70RRBBFWQF2M2Y8KQZTKQ3D"]').click();
    await page.locator('[data-test="add-to-cart"]').click();
    await page.locator('div').filter({ hasText: 'Product added to shopping' }).nth(2).click();
    await page.locator('[data-test="nav-cart"]').click();
    await page.locator('[data-test="proceed-1"]').click();
    await page.locator('[data-test="proceed-2"]').click();
    await expect(
      page.locator(".step-indicator").filter({ hasText: "2" })
    ).toHaveCSS("background-color", "rgb(51, 153, 51)");
    await page.getByTestId("state").fill("Sydney");
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
