import { Page, expect } from '@playwright/test';

export class AuthPage {
  constructor(private page: Page) {}

  async openSignupWelcome() {
    await this.page.goto('https://tradenation.com/en-bs/signup/welcome', {
      waitUntil: 'domcontentloaded',
    });
  }

  async clickLoginHere() {
    await this.page.getByRole('link', { name: /log in here/i }).click();
    await expect(this.page).toHaveURL(/\/en-bs\/login/i);
  }

  /** Clicks the Google button on /en-bs/login (id="logingoogle"). */
  async clickLoginWithGoogle() {
    await this.page.locator('#logingoogle').click();  // <-- IMPORTANT: await the click
  }
}

