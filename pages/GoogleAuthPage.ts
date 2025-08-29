import { Page, Locator, BrowserContext } from '@playwright/test';

const GOOGLE_URL_RE = /accounts\.google\.com|google\.com\/signin/i;

export class GoogleAuthPage {
  constructor(private page: Page) {}

  // Minimal, stable locators
  get email(): Locator {
    return this.page.getByRole('textbox', { name: /email|phone/i });
  }
  get next(): Locator {
    return this.page.getByRole('button', { name: /^next$/i });
  }
  get password(): Locator {
    return this.page.locator('input[name="Passwd"]:visible');
  }
  get error(): Locator {
    return this.page.getByText(/wrong password|incorrect password|try again|couldn’t sign you in/i);
  }

  /** Click handler may open popup or navigate same-tab. Find a *live* Google page. */
  static async acquireAfterClick(basePage: Page, click: () => Promise<void>): Promise<Page> {
    const ctx: BrowserContext = basePage.context();

    // 1) Click the button that triggers Google
    await click();

    // 2) Poll for up to ~4s to find any *open* page on Google (popup or same-tab)
    for (let i = 0; i < 20; i++) {
      const pages = ctx.pages().filter(p => !p.isClosed());
      for (const p of pages) {
        const url = p.url();
        if (GOOGLE_URL_RE.test(url)) {
          await p.waitForLoadState('domcontentloaded').catch(() => {});
          return p;
        }
      }
      // Same-tab path might still be navigating
      if (GOOGLE_URL_RE.test(basePage.url())) {
        await basePage.waitForLoadState('domcontentloaded').catch(() => {});
        return basePage;
      }
      await basePage.waitForTimeout(200);
    }

    throw new Error('Could not find a live Google sign-in page (popup or same-tab).');
  }

  async enterEmailAndNext(email: string) {
    // Some regions show consent or account chooser. We skip fancy handling and just wait for the field.
    await this.email.waitFor({ state: 'visible', timeout: 15000 });
    await this.email.fill(email);
    await this.next.click();
  }

  async enterPasswordAndNext(password: string) {
    await this.password.waitFor({ state: 'visible', timeout: 15000 });
    await this.password.fill(password);
    await this.next.click();
  }
}
