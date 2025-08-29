import { Page } from '@playwright/test';

export class mainPage {
  constructor(private page: Page) {}

  private async acceptCookies() {
    const accept = this.page.locator('#onetrust-accept-btn-handler');
    if (await accept.isVisible().catch(() => false)) await accept.click().catch(() => {});
  }

  async open(url = 'https://tradenation.com/en-gb/') {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.acceptCookies();
  }

  async clickSignUpOrLogin() {
    // header link at the top of the page
    const trigger = this.page
      .locator(
        'header a:has-text("Sign up / Log in"), header a:has-text("Sign up"), header a:has-text("Log in"), a[href*="/login"]'
      )
      .first();
    await trigger.waitFor({ state: 'visible', timeout: 10000 });
    await trigger.click();
  }
}