# ScortIQ

The current product direction is Class 10 only (CBSE 2026–27): learn with AI in English/Hindi/Hinglish, prepare exam answers in English/Hindi, practise relevant equations, take recall quizzes and write subjective practice exams under teacher supervision. See [product plan](CLASS10_PRODUCT_PLAN.md), [chapter/topic catalogue](CLASS10_CURRICULUM.md) and [implementation queue](REMAINING_TASKS.md). The catalogue is planning data, not published lesson content; the running pilot below has not yet been restructured to this full flow.

A fresh rebuild of the science learning companion. React + TypeScript + Vite frontend, FastAPI backend, SQLAlchemy persistence and a server-side Hugging Face integration.

## Current milestone

Working local pilot: onboarding, three science chapters/seven concepts, lesson opening/resume, explanations, server-graded quizzes, saved progress, profile editing, mobile navigation, and ownership checks. Quiz answer keys remain on the server until submission. Failed/abandoned attempts do not become scores; repeated submissions do not count twice.

Lessons now have a saved three-step checklist (read, example, reflection) with an accessible progress bar. Steps are completed in order and are isolated per account. Checklist completion is not a mastery claim and does not change quiz scores.

Versioned source documents/passages now ground tutor requests. Development seeds original draft notes; production retrieval accepts only reviewed sources. Topic/language/class filters prevent mixing unrelated curriculum passages. Retrieval currently uses bounded lexical ranking, not semantic embeddings or a completed textbook retrieval system. References are checked against the retrieved passage IDs and shown with the reply; that check does not prove factual entailment.

This is **not a production-ready release yet**. Local profiles are not verified identities. Original seed content is awaiting educator review. The Hugging Face tutor is disabled until an actual endpoint is configured; no fake AI responses are used. No model has been trained.

## Run locally (Windows PowerShell, from project root)

Requires Node.js 22+ and Python 3.12+.

```powershell
npm ci
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend/requirements.lock.txt
.\.venv\Scripts\python.exe -m alembic upgrade head
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```

In a second terminal:

```powershell
npm run dev
```

Open http://127.0.0.1:5173. Frontend requests are proxied to the backend on port 8000, keeping cookies same-origin. Do not expose the development server publicly. SQLite lives under `backend/.data/`; the local session lasts seven days. Leaving the learning space ends the session; local profiles do not provide account recovery. Verified authentication is required for cross-device account access.

The backend defaults to development and creates missing tables for local convenience. Production requires migrations before startup. If an existing development schema was created without Alembic, do not run an initial migration on top of it blindly; use a fresh development database or inspect and baseline the schema explicitly.

## Configuration

Copy `backend/.env.example` to `backend/.env`, set the values, and start Uvicorn with `--env-file backend/.env`. The file is ignored by Git. Keep secrets exclusively on the server.

- `APP_ENV=production` disables local profile creation and requires PostgreSQL plus `SUPABASE_URL` (HTTPS) and `SUPABASE_PUBLISHABLE_KEY` (public publishable or legacy anon key).
- Email-code sign-in verifies the code and confirmed account through Supabase Auth. The backend issues a one-hour HttpOnly, SameSite=Strict browser session with Secure enabled in production. Supabase access tokens never reach the frontend. Production rejects local profiles. Provider revocation is not continuously polled during that one-hour session; stricter revocation policies remain release work.
- `DATABASE_URL=postgresql+psycopg://...` selects PostgreSQL. Run Alembic against that database before starting production.
- `HF_ENDPOINT_URL` must point to the base URL of a compatible dedicated inference endpoint; the backend appends `/v1/chat/completions`.
- `HF_TOKEN` and `HF_MODEL_ID` configure authenticated inference. Replies must be JSON objects containing a non-empty `reply` string and `citations`, an array of 1–3 unique retrieved passage IDs. Invalid or invented references produce recoverable errors without saving the response.
- `DAILY_TUTOR_LIMIT` defaults to 30 request reservations per user per UTC day. Failed provider calls also consume reservations to bound retry costs. Sessions are limited to 20 AI turns; recent history is bounded. Global ingress rate limits and operational spend controls remain release work.

## Checks

```powershell
npm run build
npm run format:check
.\.venv\Scripts\python.exe -m unittest backend.tests.test_learning -v
npm run test:e2e
```

Browser tests use installed Chrome on Windows and Chromium in Linux CI. They start the local servers if needed. Test screenshots/traces are under `test-results/`. Backend tests use a separate temporary database and test account isolation, hidden keys, server grading, idempotency, invalid attempts, lesson resume, inference outages, logout, cross-site writes and local-profile disabling in production mode.

Install `backend/requirements-dev.txt` to run `python -m ruff check backend ml` and `python -m ruff format --check backend ml`. Application versions are locked in `package-lock.json` and `backend/requirements.lock.txt`; `backend/requirements.txt` declares the allowed ranges for deliberate dependency updates. On Windows, `scripts/start.ps1` starts the backend and frontend together after dependencies are installed.

## Next milestones

1. Configure Supabase email delivery and validate live sign-in/recovery, HTTPS session behavior, abuse limits and access policies.
2. Import educator-reviewed sources and build the content administration/review flow.
3. Extend the existing source ingestion and lexical retrieval with a rights-reviewed textbook corpus, semantic retrieval, factual-support evaluation, safe math checking and assessment rubrics.
4. Create a frozen evaluation benchmark and reviewed training dataset; run and evaluate LoRA/QLoRA experiments (`ml/`).
5. Deploy an approved Hugging Face model, run live integration/error/load tests, and add tracing, alerts and rollback.
6. Add managed staging/production hosting, global request limits, backup restore tests, privacy/consent/deletion flows and accessibility audit.

See `REBUILD_PLAN.md` for the complete roadmap. The old tracked application can be recovered from Git history; the previous uncommitted AI service edits were removed as part of the requested reset.

## Import learning sources

Apply migrations before import, then run `python -m backend.import_sources path/to/sources.jsonl` with the backend environment active. Imports are atomic, accept only known pilot topics, and require rights confirmation. Re-importing the exact document is safe; changing an existing source ID is rejected. Corrections need a new versioned ID. No external textbook has been downloaded or imported.

Each JSONL record requires `id`, `title`, `topic_id`, `class_level: 10`, `language: "en"`, `version`, `rights`, `rights_confirmed: true`, `review_status: "draft"` or `"reviewed"`, and `passages` (1–100 strings, each at most 2000 characters). Reviewed material also requires a named `reviewer`. These metadata fields document the approval process; they do not replace an actual educator/rights review.

The current database migration is `0008`. Upgrading from `0001` adds source, checklist and email challenge tables without deleting existing learning records. Development startup creates missing tables for its existing local database; use Alembic for managed/staging/production databases.

## Supabase email sign-in and recovery

1. Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `backend/.env`. Use the project URL and public key from your Supabase project; never use a service-role key. Restart the backend with `--env-file backend/.env` (the Windows start script loads this file automatically).
2. Enable email authentication in Supabase. Configure the Magic Link email template to include `{{ .Token }}` so students receive a six-digit code rather than needing a link. See [Supabase passwordless email documentation](https://supabase.com/docs/guides/auth/auth-email-passwordless). Configure suitable email delivery/SMTP and provider limits for real student accounts.
3. Sign out of the local pilot profile, enter your email, then enter the code. The same verified Supabase user recovers their saved learning on another device. New accounts start as �Learner�; rename in Settings. Local pilot progress is separate and is not automatically merged by email.
4. Challenges expire after ten minutes and permit five verification attempts. Email send reservations enforce a one-minute cooldown and five sends per hour per normalized address; failed provider calls also consume a reservation. Provider-side and global ingress rate limits/CAPTCHA, concurrent send-limit enforcement, expired challenge retention cleanup and delivery monitoring must be validated/hardened before public launch.
5. Run migration `0003` for managed databases. Live email delivery, production PostgreSQL migration, multi-device sign-in and recovery must be verified with your configured project before marking the sign-in milestone complete. Automated tests mock Supabase; they do not send emails or prove a live integration.

## Lesson issue reports — 10 October 2026

Learners can expand "Report an issue with this lesson", choose a category and submit a 10–2,000 character description. Reports are stored against the authenticated account and topic; invalid topics, blank messages and cross-site writes are rejected. The UI preserves failed submissions for retry and confirms saved reports. A per-account limit allows ten reports per hour; stronger concurrent/global abuse enforcement remains release work. Reports are saved locally in the configured database; staff triage and notifications are not implemented yet.

Run migration `0008` on managed databases before starting this version. See `REMAINING_TASKS.md` for the current feature queue; Supabase setup is deferred.

## Saved reflections — 10 October 2026

Each lesson now includes a written answer field. Learners can save and revise up to 4,000 characters; their answer is restored when reopening the lesson and isolated from other accounts. Saving a reflection does not grade it or mark checklist steps complete. Migration `0005` adds the reflection table without changing existing lessons, scores or reports.

## Bookmarks and review queue — 10 October 2026

Choose "Save for review" on a lesson to keep that concept in the learning library's "Saved for review" list. The queue persists across reloads, is private to the account and lists recently saved concepts first. Open a saved concept to revisit it or remove it from either the lesson or the queue. Saving/removing does not change checklist completion or quiz scores. Migration `0006` adds bookmarks without altering learning records.

## Language preferences and four-subject study map — 10 October 2026

Choose teaching language (English, Hindi or Hinglish) and exam-answer language (English or Hindi) before opening a local profile or verifying an email code. Settings saves both independently. Existing accounts default to English; verified sign-in preserves previously saved preferences unless the learner changes the language controls. The server includes the chosen teaching language in the tutor system policy on each request. This does not translate existing notes or prove live bilingual tutor quality; current pilot notes remain English and the endpoint still requires configuration/evaluation.

Study includes a searchable NCERT/CBSE 2026–27 map of all four subjects, 27 chapters and 185 planned topics. Expand a chapter to see its topics and official NCERT link. Planned topics are explicitly unavailable, with the existing pilot lessons remaining separately accessible. This preserves prior lesson IDs and saved learning. Supplementary formative units remain in the planning catalogue and are not yet included in the core study-map UI.

Migration `0007` adds account language preferences without changing users or learning records. Validation: build, 24 backend checks, five browser journeys, formatter/linter checks and migration parity pass; browser coverage includes preference reload, four-subject browsing, search and mobile overflow.

## Topic learning stages — 10 October 2026

Pilot topics now open on AI learning and provide saved navigation through exam notes, a relevant activity when available, and a topic recall quiz. Students can revisit any stage. The AI stage retains its explicit unconfigured state until an inference endpoint is connected; no automated claim of learning or mastery is made. Existing notes checklists, reflections, source references, bookmarks and chapter quizzes remain accessible with their existing records.

Exam notes include a sample question/answer, important terms, answer-writing steps and a reminder about common omissions. These are original draft teaching notes, not official marking schemes. The first Chemistry topic has a Hindi draft selected by the exam-answer preference; other pilot notes explicitly fall back to English. All topic recall questions are currently English drafts and require educator review.

The three Chemistry topics include fixed-formula balancing practice with server-calculated atom counts, hints and smallest-positive-whole-number coefficient checking (1–20). Success is saved without changing quiz scores. Topics without an activity omit that stage. Every pilot topic has its own two-question recall quiz, with answer keys hidden until submission, server grading, duplicate-submit protection and saved latest results. Unsubmitted recall selections and unfinished activity coefficients are kept while switching stages in the current page, but are not restored after a full reload. Chapter practice remains a separate assessment; topic scores are not yet included in dashboard aggregates.

Migration `0008` adds journey/activity records and topic recall attempts without changing existing learning tables. Validation: build, 26 backend checks, six browser journeys, formatting/linting and migration parity pass. Browser coverage includes Hindi notes, stage restoration, incorrect/correct atom counts, saved recall results, activity omission and prior learning flows. Mocked inference checks do not establish live tutoring quality.
