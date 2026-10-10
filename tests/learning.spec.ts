import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';

test('approved teachers create classrooms and students join and leave on mobile', async ({
  page,
  browser,
}) => {
  await page.goto('/');
  await page.getByLabel('What should we call you?').fill('Class teacher');
  await page.getByRole('button', { name: 'Start learning', exact: true }).click();
  await expect(page.getByRole('link', { name: 'Classrooms', exact: true })).toBeVisible();
  const teacher = await (await page.request.get('/api/me')).json();
  execFileSync(process.platform === 'win32' ? '.venv/Scripts/python.exe' : 'python', [
    '-m',
    'backend.manage_teacher',
    'grant',
    '--user-id',
    teacher.id,
  ]);
  await page.goto('/classrooms');
  await page.getByLabel('Classroom name').fill('Class 10 Science');
  await page.getByRole('button', { name: 'Create classroom', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Classroom created' })).toBeVisible();
  const code = (await page.locator('.classroom-code').innerText()).trim();
  const studentContext = await browser.newContext({ viewport: { width: 375, height: 812 } });
  try {
    const studentPage = await studentContext.newPage();
    await studentPage.goto('http://127.0.0.1:5173/');
    await studentPage.getByLabel('What should we call you?').fill('Class student');
    await studentPage.getByRole('button', { name: 'Start learning', exact: true }).click();
    await expect(studentPage.getByRole('heading', { name: /Hello, Class/ })).toBeVisible();
    await studentPage.goto('http://127.0.0.1:5173/classrooms');
    await studentPage.getByLabel('Classroom code').fill(code);
    await studentPage.getByRole('button', { name: 'Join classroom', exact: true }).click();
    await expect(studentPage.getByRole('heading', { name: 'Class 10 Science' })).toBeVisible();
    await expect(studentPage.getByRole('button', { name: 'Remove Class student' })).toHaveCount(0);
    await studentPage.reload();
    await expect(studentPage.getByRole('heading', { name: 'Class 10 Science' })).toBeVisible();
    expect(
      await studentPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
    await studentPage.screenshot({ path: 'test-results/classrooms-mobile.png', fullPage: true });
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Students (1)' })).toBeVisible();
    await expect(page.getByText('Class student', { exact: true })).toBeVisible();
    await page.screenshot({ path: 'test-results/classrooms-teacher.png', fullPage: true });
    await studentPage.getByRole('button', { name: 'Leave classroom', exact: true }).click();
    await expect(studentPage.getByRole('heading', { name: 'Class 10 Science' })).toHaveCount(0);
  } finally {
    await studentContext.close();
  }
});

test('topic stages resume with exam notes, checked equations and saved recall results', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByLabel('Exam-answer language', { exact: true }).selectOption('hi');
  await page.getByLabel('What should we call you?').fill('Topic learner');
  await page.getByRole('button', { name: 'Start learning', exact: true }).click();
  await page.goto('/lesson/reactions-signs');
  await expect(page.getByRole('button', { name: '1. AI learning', exact: true })).toHaveAttribute(
    'aria-current',
    'step',
  );
  await page.getByRole('button', { name: 'Continue to exam notes', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Write it clearly in an exam' })).toBeVisible();
  await expect(
    page.getByText('बर्फ का पिघलना भौतिक परिवर्तन क्यों है?', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: '2. Exam notes', exact: true })).toHaveAttribute(
    'aria-current',
    'step',
  );
  await page.getByRole('button', { name: 'Continue to activity', exact: true }).click();
  await page.getByRole('button', { name: 'Check atom counts', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'atom counts do not match' }),
  ).toBeVisible();
  await page.getByLabel('Coefficient for Mg', { exact: true }).fill('2');
  await page.getByLabel('Coefficient for MgO', { exact: true }).fill('2');
  await page.getByRole('button', { name: 'Check atom counts', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Balanced with the smallest' }),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/topic-activity-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Continue to recall quiz', exact: true }).click();
  await page.getByRole('button', { name: 'Start topic recall', exact: true }).click();
  await page.getByLabel('A white solid forming when two solutions mix', { exact: false }).check();
  await page.getByLabel('No new substance forms', { exact: true }).check();
  await page.getByRole('button', { name: 'Submit topic recall', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Your latest topic score' })).toHaveText(
    'Your latest topic score: 2 / 2',
  );
  await page.reload();
  await expect(page.getByRole('button', { name: '4. Recall quiz', exact: true })).toHaveAttribute(
    'aria-current',
    'step',
  );
  await expect(page.getByRole('status').filter({ hasText: 'Your latest topic score' })).toHaveText(
    'Your latest topic score: 2 / 2',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/lesson/light-reflection');
  await expect(page.getByRole('button', { name: '3. Activity', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '3. Recall quiz', exact: true })).toBeVisible();
});

test('language preferences persist and all four study subjects can be browsed', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByLabel('Teaching language', { exact: true }).selectOption('hinglish');
  await page.getByLabel('Exam-answer language', { exact: true }).selectOption('hi');
  await page.getByLabel('What should we call you?').fill('Language learner');
  await page.getByRole('button', { name: 'Start learning', exact: true }).click();
  await page.goto('/settings');
  await expect(page.getByLabel('Teaching language', { exact: true })).toHaveValue('hinglish');
  await expect(page.getByLabel('Exam-answer language', { exact: true })).toHaveValue('hi');
  await page.getByLabel('Exam-answer language', { exact: true }).selectOption('en');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('status')).toContainText('language preferences have been updated');
  await page.reload();
  await expect(page.getByLabel('Teaching language', { exact: true })).toHaveValue('hinglish');
  await expect(page.getByLabel('Exam-answer language', { exact: true })).toHaveValue('en');
  await page.goto('/learn');
  const map = page.getByRole('region', { name: 'Class 10 study map' });
  for (const [subject, chapter] of [
    ['maths', 'Real Numbers'],
    ['chemistry', 'Acids, Bases and Salts'],
    ['biology', 'Heredity'],
    ['physics', 'Electricity'],
  ]) {
    await map.getByLabel('Study subject').selectOption(subject);
    await expect(map.locator('summary').filter({ hasText: chapter })).toBeVisible();
  }
  await map.locator('summary').filter({ hasText: 'Electricity' }).click();
  await expect(
    map.getByText('Connecting charge, current and time', { exact: false }),
  ).toBeVisible();
  await expect(map.getByText('Lesson not available yet')).toHaveCount(36);
  await map.getByLabel('Search the study map').fill('no matching concept');
  await expect(map).toContainText('No matching chapters or topics.');
  await map.getByLabel('Search the study map').fill('resistivity');
  await expect(map.locator('summary')).toHaveCount(1);
  await map.locator('summary').click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/study-map-mobile.png', fullPage: true });
});

test('saved review concepts persist, retry failures and can be removed on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByLabel('What should we call you?').fill('Review learner');
  await page.getByRole('button', { name: 'Start learning', exact: true }).click();
  await page.goto('/lesson/reactions-signs');
  let requests = 0;
  await page.route('**/api/bookmarks/reactions-signs', (route) => {
    requests++;
    if (requests === 1)
      return route.fulfill({ status: 503, json: { detail: 'Please try saving again.' } });
    return route.continue();
  });
  await page.getByRole('button', { name: 'Save for review', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Please try saving again.');
  await page.getByRole('button', { name: 'Save for review', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Remove from review', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Remove from review', exact: true })).toBeVisible();
  await page.goto('/learn');
  const queue = page.getByRole('region', { name: 'Saved for review' });
  await expect(queue.getByRole('link', { name: 'Recognising a chemical reaction' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/review-queue-mobile.png', fullPage: true });
  await queue.getByRole('link', { name: 'Recognising a chemical reaction' }).click();
  await expect(
    page.getByRole('heading', { name: 'Recognising a chemical reaction' }),
  ).toBeVisible();
  await page.goto('/learn');
  await queue.getByRole('button', { name: 'Remove from review', exact: true }).click();
  await expect(queue).toContainText('Nothing saved yet.');
  await page.reload();
  await expect(queue).toContainText('Nothing saved yet.');
});

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
  await page.getByRole('button', { name: 'Continue to exam notes', exact: true }).click();
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
  await page
    .getByLabel('Your answer, in your own words')
    .fill('Water remains water when it freezes.');
  await page.getByRole('button', { name: 'Save my answer', exact: true }).click();
  await expect(page.getByText('Your answer is saved.', { exact: true })).toBeVisible();
  await expect(page.locator('.revealed-answer')).toHaveText(
    'It remains water; no new substance forms.',
  );
  await page.getByRole('button', { name: 'I’ve reflected on the question' }).click();
  await expect(lessonProgress).toHaveAttribute('value', '3');
  await page.reload();
  await expect(page.getByLabel('Your answer, in your own words')).toHaveValue(
    'Water remains water when it freezes.',
  );
  await expect(lessonProgress).toHaveAttribute('value', '3');
  await page.getByText('Report an issue with this lesson', { exact: true }).click();
  await page
    .getByLabel('Tell us what you noticed')
    .fill('Please explain the example more clearly.');
  await page.getByRole('button', { name: 'Send report', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'saved for review' })).toContainText(
    'saved for review',
  );
  await page.getByText('Learning sources (1)', { exact: true }).click();
  await expect(
    page.getByText('pilot-1 · Pilot draft · review pending', { exact: true }),
  ).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/lesson-progress-desktop.png', fullPage: false });
  await page.getByRole('button', { name: '4. Recall quiz', exact: true }).click();
  await page.getByRole('link', { name: 'Chapter practice quiz' }).click();
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
  await expect(page.getByRole('status')).toHaveText(
    'Your profile and language preferences have been updated.',
  );
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
  await page.getByRole('button', { name: 'Continue to exam notes', exact: true }).click();
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
