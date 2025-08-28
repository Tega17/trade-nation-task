import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Trade Nation Home Page', () => {
  test('Logo goes to site home (any locale)', async ({ page }) => {
    const home = new HomePage(page);

    await home.gotoForexMarkets();
    await home.acceptCookiesIfVisible();

    // Click + wait atomically to avoid flakiness
    await Promise.all([
      page.waitForURL(/https:\/\/tradenation\.com\/en-[a-z]{2}\/?.*/, { timeout: 15000 }),
      home.clickTradeNationLogo(),
    ]);

    // Optional: sanity check on title
    await expect(page).toHaveTitle(/trade nation/i);
  });

  test('Page has a non-empty title on Forex Markets', async ({ page }) => {
    const home = new HomePage(page);
    await home.gotoForexMarkets();
    await home.acceptCookiesIfVisible();
    await expect(page).toHaveTitle(/.+/); // non-empty
  });
});
