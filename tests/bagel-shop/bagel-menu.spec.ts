import {test,expect} from "@playwright/test";

/**
 * Test suite for the Bagel Menu page in the bagel shop app.
 * - Navigates to the menu page before each test.
 * - Contains tests for adding bagels to the cart and handling dialogs.
 */
test.describe("Bagel Menu Page Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/menu.html");
  });

  const bagelType = "Sesame";
  /**
   * Validates adding a Sesame bagel to the cart.
   * - Handles confirmation and success dialogs.
   * - Clicks the Add to Cart button for the specified bagel type.
   */
  test(`Add $${bagelType} Bagel To Cart`, async ({ page }) => {

    let dialogCount = 0;
    page.on("dialog", async (dialog) => {
      dialogCount++;
      console.log(`Dialog ${dialogCount} message: ${dialog.message()}`);
      
      if(dialog.type() === "confirm") {
        expect(dialog.message()).toBe(`Add ${bagelType} bagel to cart?`);
        await dialog.accept();
      }
      else
      {
        expect(dialog.message()).toContain(`${bagelType} bagel added to cart!`);
        await dialog.dismiss();
      }
    });

    // const table = page.locator("#menuTable");
    // const bagelRow = table.getByRole("row", {name : bagelType});
    // const addButton = bagelRow.getByRole("button", { name: "Add to Cart" });

    // await addButton.click();

    // await page
    // .getByRole("row", { name: new RegExp(`^${bagelType}`) })
    // .getByRole("button", { name: "Add to Cart" })
    // .click();

    await page
          .getByRole("cell", { name: new RegExp(`^${bagelType}`) })
          .locator("..") // Move to the parent row
          .getByRole("button", { name: "Add to Cart" })
          .click();
  });

 
});