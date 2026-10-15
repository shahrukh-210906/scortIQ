import { test, expect, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';

async function finishGuidedFixture(page: Page, topicId: string) {
  const lesson = await (await page.request.post(`/api/lessons/${topicId}`)).json();
  execFileSync(process.platform === 'win32' ? '.venv/Scripts/python.exe' : 'python', [
    '-c',
    'import sys; from backend.app.database import SessionLocal,SocraticState; db=SessionLocal(); db.merge(SocraticState(lesson_id=sys.argv[1],phase=4,taught_phase=-1)); db.commit(); db.close()',
    lesson.id,
  ]);
  await page.reload();
}

test('Socratic checks keep a wrong answer on the same step and unlock notes after all four', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.request.post('/api/auth/local', {
    data: { name: 'Guided learner', teaching_language: 'hinglish' },
  });
  await page.goto('/lesson/reactions-signs');
  const notes = page.getByRole('button', { name: 'Continue to exam notes', exact: true });
  await expect(notes).toBeDisabled();
  // Deterministic inference fixture; the progress, attempt validation and navigation use real APIs.
  await page.route('**/api/lessons/*/turn', async (route) => {
    const lessonId = route.request().url().split('/').at(-2)!;
    execFileSync(process.platform === 'win32' ? '.venv/Scripts/python.exe' : 'python', [
      '-c',
      'import sys,json; from backend.app.database import SessionLocal,Lesson,SocraticState; db=SessionLocal(); s=db.get(SocraticState,sys.argv[1]); s=s or SocraticState(lesson_id=sys.argv[1],phase=0,taught_phase=-1); s.taught_phase=s.phase; db.add(s); l=db.get(Lesson,sys.argv[1]); h=json.loads(l.messages); h.extend([{"role":"user","content":"Explain this step"},{"role":"assistant","content":"Nayi substance banne par chemical change hota hai. Tum kya observe karoge?"}]); l.messages=json.dumps(h); db.commit(); db.close()',
      lessonId,
    ]);
    const lesson = await (await page.request.post('/api/lessons/reactions-signs')).json();
    await route.fulfill({ json: { ...lesson, reply: lesson.messages.at(-1).content } });
  });
  await page.getByRole('button', { name: 'Explain this step', exact: true }).click();
  await page.getByLabel('Any movement', { exact: true }).check();
  await page.getByRole('button', { name: 'Check understanding', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Step 1 of 4/ })).toBeVisible();
  await expect(
    page.getByRole('status').filter({ hasText: 'Ask the tutor to explain' }),
  ).toBeVisible();
  await expect(notes).toBeDisabled();
  const answers = [
    'A new substance',
    'The new white solid',
    'No; boiling also produces bubbles',
    'Water changes state without forming a new substance',
  ];
  for (const [phase, answer] of answers.entries()) {
    await page.getByRole('button', { name: 'Explain this step', exact: true }).click();
    await page.getByLabel(answer, { exact: true }).check();
    await page.getByRole('button', { name: 'Check understanding', exact: true }).click();
    if (phase < 3)
      await expect(
        page.getByRole('heading', { name: new RegExp(`Step ${phase + 2} of 4`) }),
      ).toBeVisible();
  }
  await expect(notes).toBeEnabled();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Guided practice complete', exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: 'test-results/socratic-mobile.png', fullPage: true });
  await notes.click();
  await expect(page.getByRole('heading', { name: 'Write it clearly in an exam' })).toBeVisible();
});

test('adaptive explanation preferences persist and can be forgotten', async ({ page }) => {
  await page.goto('/');
  await page.request.post('/api/auth/local', { data: { name: 'Adaptive learner' } });
  await page.goto('/settings');
  const option = page.getByRole('checkbox', { name: 'Remember which explanations help me' });
  await expect(option).not.toBeChecked();
  await option.check();
  await expect(
    page.getByText('Adaptive tutoring enabled for your account.', { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(option).toBeChecked();
  const lesson = await (await page.request.post('/api/lessons/reactions-signs')).json();
  // Store a deterministic tutor fixture; feedback itself uses the real authenticated API.
  execFileSync(process.platform === 'win32' ? '.venv/Scripts/python.exe' : 'python', [
    '-c',
    'import sys,json; from backend.app.database import SessionLocal,Lesson; db=SessionLocal(); row=db.get(Lesson,sys.argv[1]); row.messages=json.dumps([{"role":"user","content":"Explain"},{"role":"assistant","content":"A new substance indicates a chemical change. What might you observe?","teaching_style":"worked_example"}]); db.commit(); db.close()',
    lesson.id,
  ]);
  await page.goto('/lesson/reactions-signs');
  await page.getByRole('button', { name: 'This explanation helped', exact: true }).click();
  await expect(page.getByText('Saved: this explanation helped.', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Saved: this explanation helped.', { exact: true })).toBeVisible();
  await page.goto('/settings');
  await expect(page.getByText(/reactions-signs · Worked example: 1 helpful/)).toBeVisible();
  await page.getByRole('button', { name: 'Forget explanation preferences', exact: true }).click();
  await expect(option).not.toBeChecked();
  await expect(page.getByText(/Explanation preferences forgotten/)).toBeVisible();
  await page.reload();
  await expect(option).not.toBeChecked();
});

test('written exams restore failed autosaves and keep submitted answers read-only on mobile', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.request.post('/api/auth/local', {
    data: { name: 'Writing learner', teaching_language: 'hinglish', exam_language: 'hi' },
  });
  await page.goto('/writing');
  await page.getByLabel('Written exam topic', { exact: true }).selectOption('reactions-signs');
  await page.getByRole('button', { name: 'Start written exam', exact: true }).click();
  await expect(
    page.getByText('बर्फ का पिघलना भौतिक परिवर्तन क्यों है?', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Example answer', exact: true })).toHaveCount(0);
  let failures = 1;
  await page.route('**/api/writing/exams/*/answer', async (route) => {
    if (failures-- > 0)
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ detail: 'Test save unavailable. Please retry.' }),
      });
    else await route.continue();
  });
  const answer = 'बर्फ पिघलने पर पानी ही रहती है। कोई नया पदार्थ नहीं बनता।';
  await page.getByLabel('Your written answer', { exact: true }).fill(answer);
  await expect(page.getByRole('alert').filter({ hasText: 'Test save unavailable' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Submit written answer', exact: true }),
  ).toBeDisabled();
  await page.reload();
  await expect(page.getByLabel('Your written answer', { exact: true })).toHaveValue(answer);
  await expect(page.getByRole('status').filter({ hasText: 'Written answer saved.' })).toBeVisible();
  await page.request.patch('/api/me', { data: { name: 'Writing learner', exam_language: 'en' } });
  await page.reload();
  await expect(page.getByText('Write your answer in Hindi.', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Submit written answer', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Review your written answer', exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel('Your written answer', { exact: true })).not.toBeEditable();
  await expect(
    page.getByText('No marks or AI feedback have been issued.', { exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/writing-review-mobile.png', fullPage: true });
  await page.getByRole('link', { name: 'Back to written exams', exact: true }).click();
  await page.getByRole('link', { name: 'Review written answer', exact: true }).click();
  await expect(page.getByLabel('Your written answer', { exact: true })).toHaveValue(answer);
});

test('written drafts keep later typing during a save and reject stale-window overwrites', async ({
  page,
}) => {
  await page.goto('/');
  await page.request.post('/api/auth/local', { data: { name: 'Draft learner' } });
  const exam = await (
    await page.request.post('/api/writing/exams', { data: { topic_id: 'light-reflection' } })
  ).json();
  await page.goto(`/writing/${exam.id}`);
  const answerField = page.getByLabel('Your written answer', { exact: true });
  await expect(answerField).toBeVisible();
  expect(
    (
      await page.request.put(`/api/writing/exams/${exam.id}/answer`, {
        data: { answer: 'Saved in another window', revision: 0 },
      })
    ).ok(),
  ).toBe(true);
  await answerField.fill('My separate unsaved draft');
  await expect(page.getByRole('alert').filter({ hasText: 'another window' })).toBeVisible();
  await expect(answerField).toHaveValue('My separate unsaved draft');
  await page.reload();
  await expect(answerField).toHaveValue('My separate unsaved draft');
  await page.getByRole('button', { name: 'Load saved answer', exact: true }).click();
  await expect(answerField).toHaveValue('Saved in another window');
  let releaseSave: (() => void) | undefined;
  const heldSave = new Promise<void>((resolve) => {
    releaseSave = resolve;
  });
  let first = true;
  await page.route('**/api/writing/exams/*/answer', async (route) => {
    if (first) {
      first = false;
      await heldSave;
    }
    await route.continue();
  });
  await answerField.fill('First part of my answer');
  await expect(page.getByRole('status').filter({ hasText: 'Saving written answer' })).toBeVisible();
  await answerField.fill('First part of my answer, with a later explanation.');
  releaseSave!();
  await expect(page.getByRole('status').filter({ hasText: 'Written answer saved.' })).toBeVisible();
  await page.reload();
  await expect(answerField).toHaveValue('First part of my answer, with a later explanation.');
  await page.screenshot({ path: 'test-results/writing-draft-desktop.png', fullPage: true });
});

test('teacher can review submitted topic attempts and question evidence on mobile', async ({
  page,
  browser,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const teacher = await (
    await page.request.post('/api/auth/local', { data: { name: 'Review teacher' } })
  ).json();
  execFileSync(process.platform === 'win32' ? '.venv/Scripts/python.exe' : 'python', [
    '-m',
    'backend.manage_teacher',
    'grant',
    '--user-id',
    teacher.id,
  ]);
  const room = await (
    await page.request.post('/api/classrooms', { data: { name: 'Evidence class' } })
  ).json();
  await page.request.post(`/api/classrooms/${room.id}/assignments`, {
    data: { topic_id: 'reactions-signs', study_date: '2026-10-15' },
  });
  const context = await browser.newContext();
  try {
    const student = await context.newPage();
    await student.goto('http://127.0.0.1:5173/');
    const profile = await (
      await student.request.post('/api/auth/local', { data: { name: 'Review student' } })
    ).json();
    await student.request.post('/api/classrooms/join', { data: { code: room.join_code } });
    const lesson = await (await student.request.post('/api/lessons/reactions-signs')).json();
    await page.goto('/classrooms');
    await page.getByText('Review topic quiz attempts', { exact: true }).click();
    await page.getByLabel('Student to review', { exact: true }).selectOption(profile.id);
    await page
      .getByLabel('Assigned topic to review', { exact: true })
      .selectOption('reactions-signs');
    await page.getByRole('button', { name: 'Review attempts', exact: true }).click();
    const evidence = page.getByRole('region', { name: 'Student quiz evidence', exact: true });
    await expect(
      evidence.getByText('No submitted recall quizzes yet.', { exact: false }),
    ).toBeVisible();
    await student.request.post(`/api/lessons/${lesson.id}/recall`);
    for (const choice of [0, 1]) {
      const quiz = await (await student.request.post(`/api/lessons/${lesson.id}/recall`)).json();
      const answers = Object.fromEntries(
        quiz.questions.map((question: { id: string }) => [question.id, choice]),
      );
      expect(
        (await student.request.post(`/api/recall/${quiz.id}/submit`, { data: { answers } })).ok(),
      ).toBe(true);
    }
    await page.getByRole('button', { name: 'Review attempts', exact: true }).click();
    await expect(evidence.getByText('2 submitted recall attempts', { exact: true })).toBeVisible();
    await evidence
      .getByText(/Recall score 1 \/ 2/)
      .first()
      .click();
    const expandedAttempt = evidence.locator('.attempt-evidence[open]');
    await expect(expandedAttempt.getByText('Student chose: Water evaporating')).toBeVisible();
    await expect(expandedAttempt.getByText('Needs another look', { exact: true })).toBeVisible();
    await expect(
      expandedAttempt.getByText('Expected answer: A white solid forming when two solutions mix'),
    ).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({ path: 'test-results/teacher-attempts-mobile.png', fullPage: true });
    await page.reload();
    await page.getByText('Review topic quiz attempts', { exact: true }).click();
    await page.getByLabel('Student to review', { exact: true }).selectOption(profile.id);
    await page
      .getByLabel('Assigned topic to review', { exact: true })
      .selectOption('reactions-signs');
    await page.getByRole('button', { name: 'Review attempts', exact: true }).click();
    await expect(evidence.getByText('2 submitted recall attempts', { exact: true })).toBeVisible();
    await student.goto('http://127.0.0.1:5173/classrooms');
    await expect(
      student.getByRole('heading', { name: 'Evidence class', exact: true }),
    ).toBeVisible();
    await expect(student.getByText('Review topic quiz attempts', { exact: true })).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test('teacher topic support saves, resumes and is visible only on the selected student topic', async ({
  page,
  browser,
}) => {
  await page.goto('/');
  const teacher = await (
    await page.request.post('/api/auth/local', { data: { name: 'Support teacher' } })
  ).json();
  execFileSync(process.platform === 'win32' ? '.venv/Scripts/python.exe' : 'python', [
    '-m',
    'backend.manage_teacher',
    'grant',
    '--user-id',
    teacher.id,
  ]);
  const room = await (
    await page.request.post('/api/classrooms', { data: { name: 'Support classroom' } })
  ).json();
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  try {
    const student = await context.newPage();
    await student.goto('http://127.0.0.1:5173/');
    const profile = await (
      await student.request.post('/api/auth/local', {
        data: { name: 'Support student', teaching_language: 'hinglish' },
      })
    ).json();
    await student.request.post('/api/classrooms/join', { data: { code: room.join_code } });
    await page.goto('/classrooms');
    await page.getByText('Personalise topic support', { exact: true }).click();
    await page.getByLabel('Student for support', { exact: true }).selectOption(profile.id);
    await page.getByLabel('Topic for support', { exact: true }).selectOption('reactions-signs');
    await page.getByLabel('Use simpler language', { exact: true }).check();
    await page.getByLabel('Explain in smaller steps with more detail', { exact: true }).check();
    await page.getByLabel('Offer extra guided practice', { exact: true }).check();
    await page.getByRole('button', { name: 'Save topic support', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Support saved' })).toBeVisible();
    await page.reload();
    await page.getByText('Personalise topic support', { exact: true }).click();
    await page.getByLabel('Student for support', { exact: true }).selectOption(profile.id);
    await page.getByLabel('Topic for support', { exact: true }).selectOption('reactions-signs');
    await expect(page.getByLabel('Use simpler language', { exact: true })).toBeChecked();
    await page.screenshot({ path: 'test-results/teacher-support-desktop.png', fullPage: true });
    await student.goto('http://127.0.0.1:5173/lesson/reactions-signs');
    const support = student.getByRole('region', {
      name: 'Teacher support for this topic',
      exact: true,
    });
    await expect(support.getByText('Use simpler language', { exact: true })).toBeVisible();
    await expect(support.getByText('Offer extra guided practice', { exact: true })).toBeVisible();
    await expect(
      support.getByText(/These choices (will guide AI tutoring|guide your next AI reply)/),
    ).toBeVisible();
    expect(await student.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await student.screenshot({ path: 'test-results/student-support-mobile.png', fullPage: true });
    await student.goto('http://127.0.0.1:5173/lesson/light-reflection');
    await expect(
      student.getByRole('button', { name: 'Continue to exam notes', exact: true }),
    ).toBeVisible();
    await expect(support).toHaveCount(0);
    for (const label of [
      'Use simpler language',
      'Explain in smaller steps with more detail',
      'Offer extra guided practice',
    ])
      await page.getByLabel(label, { exact: true }).uncheck();
    await page.getByRole('button', { name: 'Save topic support', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Support saved' })).toBeVisible();
    await student.goto('http://127.0.0.1:5173/lesson/reactions-signs');
    await expect(
      student.getByRole('button', { name: 'Continue to exam notes', exact: true }),
    ).toBeVisible();
    await expect(support).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test('daily assignments appear on student dashboards and teachers see saved practice', async ({
  page,
  browser,
}) => {
  await page.goto('/');
  const teacher = await (
    await page.request.post('/api/auth/local', { data: { name: 'Assignment teacher' } })
  ).json();
  execFileSync(process.platform === 'win32' ? '.venv/Scripts/python.exe' : 'python', [
    '-m',
    'backend.manage_teacher',
    'grant',
    '--user-id',
    teacher.id,
  ]);
  await page.goto('/classrooms');
  await page.getByLabel('Classroom name').fill('Daily science');
  await page.getByRole('button', { name: 'Create classroom', exact: true }).click();
  await expect(page.locator('.classroom-code')).toBeVisible();
  const code = await page.locator('.classroom-code').innerText();
  await page.getByLabel('Topic to study', { exact: true }).selectOption('light-reflection');
  await page
    .getByLabel('Instructions (optional)', { exact: true })
    .fill('Explain both laws in your own words.');
  await page.getByRole('button', { name: 'Share study task', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Study task shared' })).toBeVisible();
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  try {
    const student = await context.newPage();
    await student.goto('http://127.0.0.1:5173/');
    await student.request.post('/api/auth/local', { data: { name: 'Assignment student' } });
    await student.request.post('/api/classrooms/join', { data: { code } });
    await student.reload();
    const board = student.getByRole('region', { name: 'Assigned study', exact: true });
    await expect(board.getByRole('heading', { name: 'Laws of reflection' })).toBeVisible();
    await expect(board.getByText('Explain both laws in your own words.')).toBeVisible();
    await expect(board.getByText('Not started', { exact: true })).toBeVisible();
    await board.getByRole('link', { name: 'Start assigned topic' }).click();
    await expect(
      student.getByRole('button', { name: 'Continue to exam notes', exact: true }),
    ).toBeVisible();
    const lesson = await (await student.request.post('/api/lessons/light-reflection')).json();
    for (const step of ['read', 'example', 'reflect']) {
      expect(
        (await student.request.post(`/api/lessons/${lesson.id}/steps`, { data: { step } })).ok(),
      ).toBe(true);
    }
    const quiz = await (await student.request.post(`/api/lessons/${lesson.id}/recall`)).json();
    const answers = Object.fromEntries(
      quiz.questions.map((question: { id: string }) => [question.id, 0]),
    );
    expect(
      (await student.request.post(`/api/recall/${quiz.id}/submit`, { data: { answers } })).ok(),
    ).toBe(true);
    await student.goto('http://127.0.0.1:5173/');
    await expect(board.getByText('Practice complete', { exact: true })).toBeVisible();
    expect(await student.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await student.screenshot({ path: 'test-results/assignments-mobile.png', fullPage: true });
    await page.goto('/');
    const teacherBoard = page.getByRole('region', { name: 'Assigned study', exact: true });
    await expect(teacherBoard.getByText('1 / 1 students finished practice')).toBeVisible();
    await expect(teacherBoard.getByText('Assignment student', { exact: true })).toBeVisible();
    await page.screenshot({ path: 'test-results/assignments-teacher.png', fullPage: true });
    await teacherBoard.getByRole('button', { name: 'Withdraw study task' }).click();
    await expect(teacherBoard.getByRole('heading', { name: 'Laws of reflection' })).toHaveCount(0);
    await student.reload();
    await expect(board.getByRole('heading', { name: 'Laws of reflection' })).toHaveCount(0);
  } finally {
    await context.close();
  }
});

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
    await expect(
      page.locator('.classroom-roster').getByText('Class student', { exact: true }),
    ).toBeVisible();
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
  await finishGuidedFixture(page, 'reactions-signs');
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
  // Exercise the offline-tutor path even when local inference is configured.
  await page.route('**/api/config', async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      json: { ...(await response.json()), inference_configured: false },
    });
  });
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
  await finishGuidedFixture(page, 'reactions-signs');
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
  await finishGuidedFixture(page, 'reactions-signs');
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
