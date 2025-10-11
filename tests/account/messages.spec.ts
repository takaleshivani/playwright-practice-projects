// import {test,expect} from "@playwright/test";
import {LoginPage } from '@pages/login/login.page';
import { registerUser } from "@datafactory/register";
import {MessagePage} from "@pages/account/message.page";
import { createMessageFromContactForm } from "@datafactory/messages";
import {test,expect} from "@fixtures/pages.fixture";


/**
 * Validate and Reply to a message from contact form
 * Register a new user using api call
 * Login with the newly registered user
 * Create a message using api call from contact form
 * Validate the message in messages page
 * Reply to the message and validate the reply
 */
test("customer reply to a message", async ({context, loginPage, accountPage,messagePage}) => {
    const timestamp = Date.now(); // to get the current timestamp
    const email = `new_user${timestamp}@gmail.com`;
    const password = 'Sambhajinagar@1104';
    const dropdownOptions = "payments";
    const message ="This is a test message from Playwright with dropdown option as payments";
    const messageUserAuthFile = ".auth/messageUser.json";   

    //Register a new user using api call
    await test.step('Register a new user', async () => {
        // const loginPage = new LoginPage(page);
        await loginPage.goto();
        await registerUser(email, password);
        await loginPage.login(email, password);
        // await expect(page.getByTestId("nav-menu")).toContainText("Test User");
        await expect(accountPage.navMenu).toContainText("Test User");
        // await page.context().storageState({path: messageUserAuthFile}); //to save the token in auth file
        await context.storageState({path: messageUserAuthFile}); //to save the token in auth file
    }); 

    //Create a message using api call from contact form
    await test.step("create a message from contact form" , async () => {
        await createMessageFromContactForm
            ("Testy Mctesterface", 
                message,
                dropdownOptions, 
                messageUserAuthFile);
    });

    //Validate the message in messages page and reply to the message
    await test.step("validate and reply to a message"   , async () => {
        // Navigate to Messages page
        // const messagePage = new MessagePage(page);
        await messagePage.goto();
        await expect(messagePage.table).toBeVisible();
        await expect(messagePage.table).toContainText(message.substring(0,20)); //validating part of the message
        await expect(messagePage.table).toContainText(dropdownOptions);

        await messagePage.detailsLink.click();
        await expect(messagePage.messageList).toBeVisible();
        await expect(messagePage.messageList).toContainText(message);

        // Reply to the message
        const replyMessage = "This is an automated reply from Playwright";
        await messagePage.replyInput.fill(replyMessage);
        await messagePage.replySubmit.click();
        await expect(messagePage.reply).toContainText(replyMessage);
    });
}); 




