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

  // Click "Continue with Google" and capture the popup
  const [google] = await Promise.all([
    page.waitForEvent('popup'), // or: context.waitForEvent('page')
    page.getByRole('button', { name: /google/i }).click(),
  ]);

  await google.waitForLoadState('domcontentloaded');
  await expect(google).toHaveURL(/accounts\.google\.com/);

  // Email step
  await google.getByRole('textbox', { name: /email|phone/i }).fill('invalid@example.com');
  await google.getByRole('button', { name: /^next$/i }).click();

  // Password step — IMPORTANT: only target the visible field
  const pass = google.locator('input[name="Passwd"]:visible');
  await pass.waitFor({ state: 'visible', timeout: 15000 });
  await pass.fill('wrong-password');

  await google.getByRole('button', { name: /^next$/i }).click();

  // Expect validation message
  await expect(
    google.getByText(/wrong password|try again|couldn’t sign you in|enter a password/i)
  ).toBeVisible();
});
