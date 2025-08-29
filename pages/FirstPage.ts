// pages/FirstPage.ts
import { Page, expect } from '@playwright/test';

export class FirstPage {
  constructor(private page: Page) {}

  async goto() {
    // Force en-GB and desktop header
    await this.page.goto('https://tradenation.com/en-gb', { waitUntil: 'domcontentloaded' });
    await this.acceptCookiesIfVisible();
    await this.closeRegionModalIfPresent();
  }

  private async acceptCookiesIfVisible() {
    // Handles various cookie banners
    const cookieBtns = this.page.locator([
      'role=button[name=/accept all|accept|agree/i]',
      '[data-testid*="cookie"] button',
      'button:has-text("Accept")',
      'button:has-text("Accept all")',
    ].join(', '));
    if (await cookieBtns.first().isVisible()) {
      await cookieBtns.first().click().catch(() => {});
    }
  }

  private async closeRegionModalIfPresent() {
    const regionBtn = this.page.getByRole('button', { name: /continue|go to.*uk|en-gb|stay here/i });
    if (await regionBtn.isVisible()) await regionBtn.click().catch(() => {});
  }

  async clickSignUpOrLogin() {
    // Open the login/signup entry point in the header
    await this.page.waitForLoadState('domcontentloaded');

    // Some headers collapse on smaller viewports—open menu if needed
    const menuBtn = this.page.getByRole('button', { name: /menu|open menu|hamburger/i });
    if (await menuBtn.isVisible()) await menuBtn.click().catch(() => {});

    const trigger = this.page.locator([
      'role=link[name=/sign up.*log in|log in|sign in|sign up/i]',
      'role=button[name=/log in|sign in|sign up/i]',
      'a[href*="/login"]',
      'a[href*="/sign-in"]',
      'a[href*="/signin"]',
    ].join(', ')).first();

    await trigger.waitFor({ state: 'visible', timeout: 10000 });
    await trigger.click();

    // If a modal opens, wait for auth options to appear
    await this.page.waitForTimeout(300); // small settle
    await expect(
      this.page.getByRole('button', { name: /google|continue with google/i }).first()
    ).toBeVisible({ timeout: 10000 });
  }

  async clickContinueWithGoogle() {
    const btn = this.page.getByRole('button', { name: /google|continue with google/i }).first();
    await btn.waitFor({ state: 'visible', timeout: 10000 });
    await btn.click();
  }
}

