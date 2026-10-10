import { test, expect } from '@playwright/test';

test('email sign-in handles a wrong code and recovers the saved account', async ({ page }) => {
  let signedIn = false;
  let attempts = 0;
  await page.route('**/api/config', (route) =>
    route.fulfill({
      json: {
        local_profiles: false,
        email_signin: true,
        inference_configured: false,
        content_status: 'pilot draft',
      },
    }),
  );
  await page.route('**/api/me', (route) =>
    route.fulfill(
      signedIn
        ? { json: { id: 'verified-account', name: 'Asha', verified: true } }
        : { status: 401, json: { detail: 'Sign in to continue.' } },
    ),
  );
  await page.route('**/api/progress', (route) =>
    route.fulfill({
      json: {
        started_topics: ['reactions-signs'],
        completed_steps_by_topic: { 'reactions-signs': ['read'] },
        attempts: [],
      },
    }),
  );
  await page.route('**/api/auth/email/start', (route) => route.fulfill({ json: { ok: true } }));
  await page.route('**/api/auth/email/verify', (route) => {
    attempts++;
    if (attempts === 1)
      return route.fulfill({
        status: 400,
        json: { detail: 'The code could not be verified. Check it or request a new one.' },
      });
    signedIn = true;
    return route.fulfill({ json: { id: 'verified-account', name: 'Asha', verified: true } });
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByLabel('Your email').fill('asha@example.com');
  await page.getByRole('button', { name: 'Send sign-in code', exact: true }).click();
  await page.getByLabel('Sign-in code').fill('111111');
  await page.getByRole('button', { name: 'Verify and start learning' }).click();
  await expect(page.getByRole('alert')).toContainText('could not be verified');
  await page.getByLabel('Sign-in code').fill('123456');
  await page.screenshot({ path: 'test-results/email-signin-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Verify and start learning' }).click();
  await expect(page.getByRole('heading', { name: 'Hello, Asha.' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Hello, Asha.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('student can study, submit a quiz, reload progress and rename their profile', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByLabel('What should we call you?').fill('Asha');
  await page.getByRole('button', { name: 'Start learning', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Hello, Asha.' })).toBeVisible();
  await page.getByRole('link', { name: 'Explore your first chapter' }).click();
  await page.getByRole('link', { name: /Recognising a chemical reaction/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Recognising a chemical reaction' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'AI tutoring is on its way.' })).toBeVisible();
  const lessonProgress = page.getByRole('progressbar', { name: 'Lesson steps completed' });
  await expect(lessonProgress).toHaveAttribute('value', '0');
  await expect(
    page.getByRole('button', { name: 'I’ve worked through the example' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'I’ve read the idea' }).click();
  await expect(lessonProgress).toHaveAttribute('value', '1');
  await page.getByRole('button', { name: 'I’ve worked through the example' }).click();
  await expect(lessonProgress).toHaveAttribute('value', '2');
  await page.getByRole('button', { name: 'Show explanation' }).click();
  await expect(page.getByText('It remains water; no new substance forms.')).toBeVisible();
  await page.getByRole('button', { name: 'I’ve reflected on the question' }).click();
  await expect(lessonProgress).toHaveAttribute('value', '3');
  await page.reload();
  await expect(lessonProgress).toHaveAttribute('value', '3');
  await page.getByText('Report an issue with this lesson', { exact: true }).click();
  await page
    .getByLabel('Tell us what you noticed')
    .fill('Please explain the example more clearly.');
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('saved for review');
  await page.getByText('Learning sources (1)', { exact: true }).click();
  await expect(
    page.getByText('pilot-1 · Pilot draft · review pending', { exact: true }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/lesson-progress-desktop.png', fullPage: false });
  await page.getByRole('link', { name: 'Check your understanding' }).click();
  await page.getByRole('button', { name: 'Start practice', exact: true }).click();
  await page.getByLabel('A white solid forming when two solutions mix', { exact: false }).check();
  await page.getByLabel('2H₂ + O₂ → 2H₂O', { exact: false }).check();
  await page.getByLabel('Coefficients before formulas', { exact: false }).check();
  await page.getByRole('button', { name: 'Submit & see feedback' }).click();
  await expect(page.getByRole('heading', { name: '3 of 3 correct' })).toBeVisible();
  await page.getByRole('link', { name: 'View your progress' }).click();
  await page.reload();
  await expect(page.getByText('Latest quiz: 3/3', { exact: false })).toBeVisible();
  await page.getByRole('link', { name: 'Settings', exact: true }).click();
  await page.getByLabel('Name', { exact: true }).fill('Asha Rao');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toHaveText('Your name has been updated.');
  await page.screenshot({ path: 'test-results/settings-desktop.png', fullPage: true });
  await page.getByRole('link', { name: 'Overview', exact: true }).click();
  await page.screenshot({ path: 'test-results/dashboard-desktop.png', fullPage: true });
  expect(errors).toEqual([]);
});

test('mobile library navigation fits and filters correctly', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByLabel('What should we call you?').fill('Ravi');
  await page.getByRole('button', { name: 'Start learning', exact: true }).click();
  await page.screenshot({ path: 'test-results/dashboard-mobile.png', fullPage: true });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
  await page.getByRole('link', { name: 'Explore your first chapter' }).click();
  await page.getByRole('link', { name: /Recognising a chemical reaction/ }).click();
  await expect(page.getByRole('progressbar', { name: 'Lesson steps completed' })).toHaveAttribute(
    'value',
    '0',
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/lesson-progress-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('link', { name: 'My learning', exact: true }).click();
  await page.getByRole('button', { name: 'Physics', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Light & reflection', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Chemical reactions', exact: true })).toHaveCount(
    0,
  );
  await page
    .getByRole('searchbox', { name: 'Search chapters and concepts' })
    .fill('does not exist');
  await expect(page.getByRole('heading', { name: 'No chapters found' })).toBeVisible();
  await page.setViewportSize({ width: 812, height: 375 });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
});
