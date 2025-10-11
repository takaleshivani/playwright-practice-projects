import { AccountPage } from "@pages/account/account.page";
import { MessagePage } from "@pages/account/message.page";
import { LoginPage } from "@pages/login/login.page";
import  { test as pageTest,expect} from "@playwright/test";


type MyPages={
    loginPage: LoginPage;
    messagePage: MessagePage;
    accountPage: AccountPage;
};

export const test = pageTest.extend<MyPages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  messagePage: async ({ page }, use) => {
    await use(new MessagePage(page));
  },
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  }
});

export { expect };

