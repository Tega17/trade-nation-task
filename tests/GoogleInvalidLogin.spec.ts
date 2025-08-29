import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import { GoogleAuthPage } from '../pages/GoogleAuthPage';

test('Valid email + invalid password shows Google validation', async ({ page }) => {
  const auth = new AuthPage(page);

  await auth.openSignupWelcome();
  await auth.clickLoginHere();

  // Acquire a *live* Google page (popup or same-tab), using resilient search.
  const googlePage = await GoogleAuthPage.acquireAfterClick(page, () => auth.clickLoginWithGoogle());
  const google = new GoogleAuthPage(googlePage);

  await google.enterEmailAndNext('tegaenajekpo50@gmail.com');
  await google.enterPasswordAndNext('Wrong-password');

  await expect(google.error).toBeVisible({ timeout: 10000 });
  console.log('Google validation:', (await google.error.innerText()).trim());
});
