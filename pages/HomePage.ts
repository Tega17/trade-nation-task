import { Page, expect } from '@playwright/test';

// pages/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}

  async gotoForexMarkets() {
    await this.page.goto('https://tradenation.com/en-gb/markets/forex', { waitUntil: 'domcontentloaded' });
  }

  async acceptCookiesIfVisible() {
    const btn = this.page.getByRole('button', { name: /accept all|accept|agree/i });
    if (await btn.isVisible()) await btn.click().catch(() => {});
  }

  async closeRegionModalIfPresent() {
    const regionBtn = this.page.getByRole('button', { name: /continue|go to.*uk|en-gb|stay here/i });
    if (await regionBtn.isVisible()) await regionBtn.click().catch(() => {});
  }

  async clickTradeNationLogo() {
    await this.acceptCookiesIfVisible();
    await this.closeRegionModalIfPresent();

    const logoLink = this.page.locator([
      'css=header a[href^="/en-gb"]',
      'css=header a[href="https://tradenation.com/en-gb"]',
      'css=header a:has(img[alt*="trade nation" i])',
      'role=link[name=/trade nation|home|logo/i]',
    ].join(', ')).first();

    await logoLink.waitFor({ state: 'visible', timeout: 10000 });
    await logoLink.click();
  }
}
