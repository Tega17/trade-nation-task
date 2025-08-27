import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async gotoForexMarkets() {
    await this.page.goto('https://tradenation.com/en-gb/markets/#forex', { waitUntil: 'domcontentloaded' });
  }

  async acceptCookiesIfVisible() {
    const acceptButton = this.page.getByRole('button', { name: /accept all cookies/i });
    if (await acceptButton.isVisible().catch(() => false)) {
      await acceptButton.click();
    }
  }

 async clickTradeNationLogo() {
  // Wait for the logo link (parent <a> of the logo <img>) to be visible
  const logoLink = this.page.locator('a:has(img[src*="TN-PrimaryLogo-RGB-WhiteText-Strapline.png"])').first();
  await logoLink.waitFor({ state: 'visible', timeout: 10000 });

  if (await logoLink.isVisible().catch(() => false)) {
    await logoLink.click();
  } else {
    throw new Error('Trade Nation logo link not found or not visible');
  }
}

  async assertHomePageTitle() {
  await this.page.waitForFunction(
    () => document.title.includes('Trade Nation'),
    null,
    { timeout: 15000 }
  );
}
}
