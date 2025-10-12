import {test,expect} from "@playwright/test";
import * as fs  from 'fs';

/**
 * Validates the order creation flow by uploading a file in the bagel shop app.
 * - Navigates to the order page and uploads a design file.
 * - Fills out instructions and quantity fields.
 * - Handles and asserts the upload confirmation dialog.
 * - Places the order and downloads the receipt.
 * - Reads and logs the receipt file content, then cleans up the file.
 */
test("Create an order by uploading file" , async ({ page }) => {
    await page.goto("http://localhost:5173/order.html");

    await page.locator("#designUpload").setInputFiles("bagel-shop.txt");
    await page.locator("#instructions").fill("This is an instruction");
    await page.locator("#quantity").fill("2");

     page.once("dialog", async (dialog) => {
        expect(dialog.message()).toContain('File "bagel-shop.txt" uploaded successfully!');
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.dismiss();
    });

    await page.getByRole("button", { name: "Place Order" }).click();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole("button", { name: "Download Receipt" }).click();
    const download = await downloadPromise;

    const fileName = __dirname+download.suggestedFilename();
    await download.saveAs(__dirname+download.suggestedFilename());

    const fileContent = fs.readFileSync(fileName, 'utf-8');
    console.log("Content:" ,fileContent);

    fs.unlinkSync(fileName); // Clean up the downloaded file
});