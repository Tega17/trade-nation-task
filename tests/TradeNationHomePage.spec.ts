import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Trade Nation Home Page', () => {
  test('Click on the Trade Nation logo at the top of the page', async ({ page }) => {
    const home = new HomePage(page);
    await home.gotoForexMarkets();
    await home.acceptCookiesIfVisible();
    await home.clickTradeNationLogo();
    // Optionally, check navigation or print the new URL
    console.log('URL after clicking logo:', await page.url());
  });

  test('Confirm current page title', async ({ page }) => {
    const home = new HomePage(page);
    await home.gotoForexMarkets();
    await home.acceptCookiesIfVisible();
    const title = await page.title();
    console.log('Current Page Title:', title);
    expect(title).not.toBe('');
  });
});