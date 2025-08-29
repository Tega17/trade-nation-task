import { Page, expect } from '@playwright/test';

export class GoogleSignInPage {
  constructor(private page: Page) {}

  async enterEmail(email: string) {
    if (this.page.isClosed()) throw new Error('GoogleSignInPage: page is closed before enterEmail().');

    // Ensure we’re on Google Accounts and the field is present
    await this.page.waitForURL(/accounts\.google\.com/i, { timeout: 15000 });
    const emailInput = this.page.locator('input[name="identifier"], #identifierId');
    await emailInput.first().waitFor({ state: 'visible', timeout: 15000 });
    await emailInput.first().fill(email);

    // Click the next button for the identifier step
    await this.page.locator('#identifierNext, #identifierNext button').first().click();
  }

  async enterInvalidPassword(pwd: string) {
    if (this.page.isClosed()) throw new Error('GoogleSignInPage: page is closed before enterInvalidPassword().');

    const pass = this.page.locator('input[name="Passwd"], input[type="password"]');
    await pass.first().waitFor({ state: 'visible', timeout: 15000 });
    await pass.first().fill(pwd);
    await this.page.getByRole('button', { name: /next/i }).first().click();
  }

  async expectInvalidPasswordAndLog() {
    const err = this.page.locator('[role="alert"], [aria-live="assertive"]').first();
    await expect(err).toContainText(/wrong|incorrect|try again|couldn.?t/i, { timeout: 15000 });
    console.log('Validation message:', (await err.innerText()).trim());
  }
}

