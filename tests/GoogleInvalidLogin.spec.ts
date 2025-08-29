import { test } from '@playwright/test';
import { mainPage } from '../pages/mainPage';
import { LoginPage } from '../pages/loginPage';
import { GoogleSignInPage } from '../pages/googleSignPage';

test.describe.configure({ mode: 'serial' }); // keeps the auth flow tidy

test('Invalid Google login shows validation', async ({ page, context }) => {
  const home = new mainPage(page);
  await home.open();                          // go to home
  await home.clickSignUpOrLogin();            // click top "Sign up / Log in"

  const login = new LoginPage(page);
  await login.clickLoginHere();               // click "log in here"

  // ensure we're on the /login page explicitly if needed
  await page.goto('https://tradenation.com/login', { waitUntil: 'domcontentloaded' });

  const googlePopup = await login.clickLoginWithGoogle(context);   // click "Log in with Google"

  const google = new GoogleSignInPage(googlePopup);
  await google.enterEmail('tegaenajekpo50@gmail.com');             // any non-existent email is fine
  await google.enterInvalidPassword('definitely-wrong-password');  // invalid pass
  await google.expectInvalidPasswordAndLog();                      // assert + log the message
});

