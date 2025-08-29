import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Trade Nation Home Page', () => {
  test('Logo goes to site home', async ({ page }) => {
    const home = new HomePage(page);

    await home.gotoForexMarkets();
    await home.acceptCookiesIfVisible();

   await Promise.all([
  page.waitForURL('https://tradenation.com/en-gb', { timeout: 15000 }),
  home.clickTradeNationLogo(),
]);

// Optional: sanity check on title
await expect(page).toHaveTitle(/trade nation/i);
})

  test('Page has a non-empty title on Forex Markets', async ({ page }) => {
    const home = new HomePage(page);
    await home.gotoForexMarkets();
    await home.acceptCookiesIfVisible();
    await expect(page).toHaveTitle(/.+/); // non-empty
  });
});
