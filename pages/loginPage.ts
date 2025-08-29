import { BrowserContext, Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async clickLoginHere() {
    const link = this.page.locator('a:has-text("Log in here"), a[href$="/login"], a[href*="/login"]').first();
    await link.waitFor({ state: 'visible', timeout: 10000 });
    await link.click();
    await expect(this.page).toHaveURL(/\/login\b/i);
  }

  /**
   * Clicks “Log in with Google” and returns the *live* Google Accounts Page.
   * Handles: popup window, new tab in context, or same-tab navigation.
   */
  async clickLoginWithGoogle(context: BrowserContext): Promise<Page> {
    const btn = this.page.locator('button:has-text("Google"), a:has-text("Google")').first();
    await btn.waitFor({ state: 'visible', timeout: 15000 });

    // Prepare all plausible ways Google auth can appear
    const popupPromise = this.page.waitForEvent('popup').catch(() => null);
    const ctxPagePromise = context.waitForEvent('page').catch(() => null);
    const sameTabNavPromise = this.page
      .waitForNavigation({ url: /accounts\.google\.com/i })
      .then(() => this.page)
      .catch(() => null);

    // Click and then pick whichever appears first
    const [winner] = await Promise.all([
      Promise.race([popupPromise, ctxPagePromise, sameTabNavPromise]),
      btn.click()
    ]);

    // If nothing won the race, try a last-chance scan of context pages
    let target: Page | null = (winner as Page) ?? null;
    if (!target) {
      const candidates = context.pages().filter(p => /accounts\.google\.com/i.test(p.url()));
      target = candidates[candidates.length - 1] ?? null;
    }

    if (!target) throw new Error('Failed to capture Google auth page/popup.');

    if (target.isClosed()) throw new Error('Google auth page closed immediately after opening.');

    await target.waitForLoadState('domcontentloaded');
    return target;
  }
}

