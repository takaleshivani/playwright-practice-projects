import {test,expect} from "playwright/test";

/**
 * Validates that clicking the "Get Promo Code" button opens a popup displaying the promo code.
 * - Navigates to the local bagel shop app.
 * - Waits for the popup window to open after clicking the button.
 * - Asserts that the popup contains the expected promo code text.
 */
test("validate promo code popup", async ({ page }) => {
    await page.goto("http://localhost:5173/");

    const   popupPromise = page.waitForEvent('popup');
    await page.getByRole("button",{name: "Get Promo Code"}).click();
    const popup = await popupPromise;
    await expect(popup.getByText("The promo code is: B6G2")).toBeVisible();
});