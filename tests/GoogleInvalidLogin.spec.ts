import { test, expect } from '@playwright/test';
import { FirstPage} from '../pages/FirstPage';
// If you actually use these, keep them; otherwise remove to avoid TS lint errors.
import { LoginPage} from '../pages/LoginPage';
import { GoogleSignInPage} from '../pages/GoogleSignPage';

test.describe.configure({ mode: 'serial' });

test('Invalid Google login shows validation', async ({ page }) => {
  const mainPage = new FirstPage(page);

  // Open your site and bring up the auth options
  await mainPage.goto();
  await mainPage.clickSignUpOrLogin();

  // tests/GoogleInvalidLogin.spec.ts
const googleCta = await (async () => {
  // on-page
  const btn1 = page.getByRole('button', { name: /google|continue with google/i }).first();
  if (await btn1.isVisible().catch(() => false)) return btn1;

  const link1 = page.getByRole('link', { name: /google|continue with google/i }).first();
  if (await link1.isVisible().catch(() => false)) return link1;

  // common auth iframe
  const frame = page.frameLocator(
    'iframe[title*="sign" i], iframe[title*="login" i], iframe[src*="auth"], iframe[src*="login"]'
  );
  const btn2 = frame.getByRole('button', { name: /google|continue with google/i }).first();
  if (await btn2.isVisible().catch(() => false)) return btn2;

  const link2 = frame.getByRole('link', { name: /google|continue with google/i }).first();
  if (await link2.isVisible().catch(() => false)) return link2;

  throw new Error('Google sign-in button not found');
})();

// Try popup and same-tab in parallel
const popupPromise = page.waitForEvent('popup').catch(() => null);
await googleCta.click();

const googlePage =
  (await popupPromise) ??
  (await (async () => {
    try {
      await page.waitForURL(/accounts\.google\.com|google\.com\/signin/i, { timeout: 15000 });
      return page;
    } catch { return null; }
  })());

if (!googlePage) throw new Error('Google auth did not open (popup or same-tab)');

await googlePage.waitForLoadState('domcontentloaded');
await expect(googlePage).toHaveURL(/accounts\.google\.com|google\.com\/signin/i);

// Email
await googlePage.getByRole('textbox', { name: /email|phone/i }).fill('tegaenajekpo50@gmail.com');
await googlePage.getByRole('button', { name: /^next$/i }).click();

// Password – visible field only (Google renders a hidden one too)
const pass = googlePage.locator('input[name="Passwd"]:visible');
await pass.waitFor({ state: 'visible', timeout: 15000 });
await pass.fill('wrong-password');
await googlePage.getByRole('button', { name: /^next$/i }).click();

// Expect some error
await expect(
  googlePage.getByText(/wrong password|try again|couldn’t sign you in|enter a password|couldn’t find your google account/i)
).toBeVisible({ timeout: 10000 });

});
