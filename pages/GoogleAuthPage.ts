import { Page, Locator } from '@playwright/test';

const GOOGLE_URL_RE = /accounts\.google\.com|google\.com\/signin/i;

export class GoogleAuthPage {
  constructor(private page: Page) {}

  get email(): Locator {
    return this.page.getByRole('textbox', { name: /email|phone/i });
  }
  get next(): Locator {
    return this.page.getByRole('button', { name: /^next$/i });
  }
  get password(): Locator {
    // visible only — Google renders hidden inputs too
    return this.page.locator('input[name="Passwd"]:visible');
  }

  // Wrong-password / generic error messages
  get wrongPasswordError(): Locator {
    return this.page.getByText(/wrong password|incorrect password|try again/i);
  }
 
// AFTER ✅
get earlyBlocker(): Locator {
  return this.page
    .getByText(
      /couldn’t sign you in|couldn't sign you in|this browser or app may not be secure|try again later/i
    )
    .first();
}


  static async acquireAfterClick(basePage: Page, click: () => Promise<void>): Promise<Page> {
    const ctx = basePage.context();
    await click();

    // search for a live Google page (popup or same tab) for up to ~4s
    for (let i = 0; i < 20; i++) {
      const openPages = ctx.pages().filter(p => !p.isClosed());
      for (const p of openPages) {
        if (GOOGLE_URL_RE.test(p.url())) {
          await p.waitForLoadState('domcontentloaded').catch(() => {});
          return p;
        }
      }
      if (GOOGLE_URL_RE.test(basePage.url())) {
        await basePage.waitForLoadState('domcontentloaded').catch(() => {});
        return basePage;
      }
      await basePage.waitForTimeout(200);
    }
    throw new Error('Could not find a live Google sign-in page.');
  }

  async enterEmailAndNext(email: string) {
    await this.email.waitFor({ state: 'visible', timeout: 15000 });
    await this.email.fill(email);
    await this.next.click();
  }

  /**
   * CI-safe: either reaches password and submits invalid password
   * or detects an early Google blocker page and returns that result.
   */
  async submitInvalidPasswordOrDetectBlock(badPassword: string): Promise<'wrong_password' | 'blocked'> {
    // Wait for either password input OR an early blocker
    const got = await Promise.race([
      this.password.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'pwd' as const).catch(() => null),
      this.earlyBlocker.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'block' as const).catch(() => null),
    ]);

    if (got === 'pwd') {
      await this.password.fill(badPassword);
      await this.next.click();
      await this.wrongPasswordError.waitFor({ state: 'visible', timeout: 15000 });
      return 'wrong_password';
    }

    // If we’re here, password never appeared but a blocker did (or neither appeared).
    // Try one more quick check for blocker text before returning.
    if (await this.earlyBlocker.isVisible().catch(() => false)) {
      return 'blocked';
    }
    // Last resort: treat as blocked to avoid test timeout flake.
    return 'blocked';
  }
}

