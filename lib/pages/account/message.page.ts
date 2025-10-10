import { type Locator, type Page } from "@playwright/test";

export class MessagePage {
   readonly page : Page;
   readonly table : Locator;
   readonly detailsLink : Locator;
   readonly messageList : Locator;
   readonly replyInput : Locator;
   readonly replySubmit : Locator;
   readonly contactForm: Locator;
   readonly reply: Locator;

    constructor(page: Page) {
       //logic to reply to message
       this.page =page;
       this.table = page.locator('app-messages', { has: page.locator('text=Messages') });
       this.detailsLink = page.getByRole('link', { name: 'Details' }).first();
       this.messageList = page
          .locator("div.card") 
          .filter({ hasText: 'Subject:' });
       this.replyInput = page.getByTestId('message');
       this.replySubmit = page.getByTestId('reply-submit');
       this.reply = page
                .getByRole("heading", { name: "Replies" })
                .locator("+ div.card");
       this.contactForm = page.getByRole("link", { name: "contact form" });
    }


    async goto() {
        await this.page.goto('/account/messages');
    }
    
}
