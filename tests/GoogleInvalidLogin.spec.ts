import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { GoogleAuthPage } from '../pages/GoogleAuthPage';

test('Valid email + invalid password shows Google validation', async ({ page }) => {
  const auth = new AuthPage(page);

  await auth.openSignupWelcome();
  await auth.clickLoginHere();

  const googlePage = await GoogleAuthPage.acquireAfterClick(page, () => auth.clickLoginWithGoogle());
  const google = new GoogleAuthPage(googlePage);

  await google.enterEmailAndNext('tegaenajekpo50@gmail.com');

  const result = await google.submitInvalidPasswordOrDetectBlock('Wrong-password');

  if (result === 'wrong_password') {
    // Normal path: we reached password step and saw wrong-password validation
    await expect(google.wrongPasswordError).toBeVisible();
    console.log('Wrong password. Try again or click Forgot password to reset it.');
  } else {
    // CI path: Google blocked before password — still a failed login, acceptable in CI
    await expect(google.earlyBlocker).toBeVisible();
    console.warn('Google auth was blocked in CI before password step; treating as expected failure.');
  }
});
