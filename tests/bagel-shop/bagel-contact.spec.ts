import {test,expect} from "@playwright/test";
import { isContext } from "vm";

/**
 * Validates the contact form submission flow in the bagel shop app.
 * - Navigates to the app and opens the contact page in a new window.
 * - Fills out the contact form fields.
 * - Handles and asserts dialog messages for confirmation and success.
 * - Verifies the form is reset after successful submission.
 */
test("Send message through contact form", async ({ page, context }) => {
    await page.goto("http://localhost:5173/");

    const contactPagePromise = context.waitForEvent("page");
    await page.getByRole("link", { name: "Contact" }).click();
    const contactPage = await contactPagePromise;
    await contactPage.locator("#name").fill("John Doe");
    await contactPage.locator("#email").fill("john.doe@example.com");
    await contactPage.locator("#message").fill("Hello, this is a test message.");

    contactPage.once("dialog", async (dialog) => {
        expect(dialog.message()).toBe("Send this message?");
        console.log(`Dialog message: ${dialog.message()}`);
        await dialog.accept();

        contactPage.once("dialog", async (dialog2) => {
            expect(dialog2.message()).toContain("Message sent successfully!");
            console.log(`Dialog message: ${dialog2.message()}`);
            await dialog2.dismiss();
        })
    });
    
    await contactPage.getByRole("button", { name: "Send Message" }).click();

    await expect(contactPage.locator("#name")).toHaveValue("");
});