import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async gotoForexMarkets() {
    await this.page.goto('https://tradenation.com/en-gb/markets/#forex', { waitUntil: 'domcontentloaded' });
  }

  async acceptCookiesIfVisible() {
    const button = this.page.getByRole('button', { name: /(accept|agree).*(cookies)?/i });
    try {
      if (await button.isVisible()) await button.click();
    } catch {}
  }

  async clickTradeNationLogo() {
    const logoLink = this.page
      .locator('a[data-testid="logo"], a:has(img[alt*="Trade Nation" i]), a[aria-label*="logo" i]')
      .first();
    await expect(logoLink).toBeVisible({ timeout: 10000 });
    await logoLink.click();
  }

  async clickTradeNationLogoAndWait(expectedUrl: RegExp, timeout = 15000) {
    const logoLink = this.page
      .locator('a[data-testid="logo"], a:has(img[alt*="Trade Nation" i]), a[aria-label*="logo" i]')
      .first();
    await expect(logoLink).toBeVisible({ timeout: 10000 });

    await Promise.all([
      this.page.waitForURL(expectedUrl, { timeout }),
      logoLink.click(),
    ]);
  }
}

