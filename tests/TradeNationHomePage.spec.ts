import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Trade Nation Home Page', () => {
  test('Logo goes to site home', async ({ page }) => {
    const home = new HomePage(page);

    await home.gotoForexMarkets();
    await home.acceptCookiesIfVisible();

   await home.clickTradeNationLogo();

await expect(page).toHaveURL(
  /^https:\/\/(?:www\.)?tradenation\.com\/en-[a-z]{2}\/?(?:\?.*)?$/,
  { timeout: 15000 }
);

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
