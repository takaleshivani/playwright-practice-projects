import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
   readonly page : Page;
   readonly emailInput : Locator;
   readonly passwordInput : Locator;
   readonly loginInButton : Locator;

   constructor(page: Page) {
      this.page = page;
      this.emailInput = page.getByTestId('email');
      this.passwordInput = page.getByTestId('password');
      this.loginInButton = page.getByTestId('login-submit');
   }

   async goto() {
      await this.page.goto('https://practicesoftwaretesting.com/auth/login');
   }
}