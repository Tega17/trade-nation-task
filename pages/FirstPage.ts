// pages/FirstPage.ts
import { Page, expect } from '@playwright/test';

export class FirstPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://tradenation.com/en-gb', { waitUntil: 'domcontentloaded' });
    await this.acceptCookiesIfVisible();
    await this.closeRegionModalIfPresent();
  }

  private async acceptCookiesIfVisible() {
    // Try a few common buttons, one by one (no mixed-engine comma selectors)
    const candidates = [
      this.page.getByRole('button', { name: /accept all/i }),
      this.page.getByRole('button', { name: /accept/i }),
      this.page.getByRole('button', { name: /agree/i }),
      this.page.locator('[data-testid*="cookie"] button'),
      this.page.locator('button:has-text("Accept all")'),
      this.page.locator('button:has-text("Accept")'),
    ];

    for (const loc of candidates) {
      const btn = loc.first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click({ timeout: 5000 }).catch(() => {});
        break;
      }
    }
  }

  private async closeRegionModalIfPresent() {
    const candidates = [
      this.page.getByRole('button', { name: /continue/i }),
      this.page.getByRole('button', { name: /go to.*uk|en-gb|stay here/i }),
    ];
    for (const loc of candidates) {
      const btn = loc.first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        break;
      }
    }
  }

  async clickSignUpOrLogin() {
    await this.page.waitForLoadState('domcontentloaded');

    // If header collapses, open menu
    const menu = this.page.getByRole('button', { name: /menu|open menu|hamburger/i }).first();
    if (await menu.isVisible().catch(() => false)) await menu.click().catch(() => {});

    // Try multiple possible triggers — sequentially
    const triggers = [
      this.page.getByRole('link', { name: /sign up.*log in|log in|sign in|sign up/i }),
      this.page.getByRole('button', { name: /log in|sign in|sign up/i }),
      this.page.locator('a[href*="/login"]'),
      this.page.locator('a[href*="/sign-in"], a[href*="/signin"]'),
    ];

    let clicked = false;
    for (const t of triggers) {
      const el = t.first();
      if (await el.isVisible().catch(() => false)) {
        await el.click();
        clicked = true;
        break;
      }
    }
    if (!clicked) {
      throw new Error('Login trigger not found');
    }

    await expect(this.page.getByRole('button', { name: /google|continue with google/i }).first())
      .toBeVisible({ timeout: 10000 });
  }

  async clickContinueWithGoogle() {
    const btn = this.page.getByRole('button', { name: /google|continue with google/i }).first();
    await btn.click();
  }
}
