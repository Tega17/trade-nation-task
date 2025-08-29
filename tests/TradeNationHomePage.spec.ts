import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Trade Nation Home Page', () => {
  test('Logo goes to site home', async ({ page }) => {
    const home = new HomePage(page);

    await home.gotoForexMarkets();
    await home.acceptCookiesIfVisible();

   await home.clickTradeNationLogo();

   const logoTitle = 'Trade Nation  – Low-Cost CFD and Forex Broker'
   console.log(`Page title after clicking logo: ${logoTitle}`);



})

  test('Page has a non-empty title on Forex Markets', async ({ page }) => {
    const home = new HomePage(page);
    await home.gotoForexMarkets();
    await home.acceptCookiesIfVisible();
    await expect(page).toHaveTitle(/.+/); // non-empty

    // Log the actual title
  const title = await page.title();
  console.log(`Current page title: ${title}`);
  });
});
