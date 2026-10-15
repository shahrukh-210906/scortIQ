# Remaining tasks

Updated 15 October 2026. Supabase authentication is configured locally and the email-code send request succeeded; code verification/recovery and cloud database setup remain pending.

## Revised product direction

Class 10 only, CBSE 2026–27. The agreed journey is AI understanding → exam notes → relevant equation/activity practice → recall quiz, with independent subjective practice exams and teacher-supervised classroom assignments. Teaching language (English/Hindi/Hinglish) and exam-answer language (English/Hindi) are separate account preferences.

See `CLASS10_PRODUCT_PLAN.md` and `CLASS10_CURRICULUM.md`. This direction supersedes the old feature order below. The catalogue covers 27 core chapters with 185 proposed topics and 13 supplementary formative topics; it is not yet integrated as reviewed lesson content.

## Priority implementation queue

- [x] Persist teaching/exam-language preferences and add four-subject catalogue navigation with clear lesson availability.
- [x] Introduce topic stages: AI understanding, exam notes, optional activity and topic recall quiz.
- [ ] Complete one reviewed topic journey with real AI grounding and exam-writing notes in English/Hindi.
- [x] Add authorised teacher roles, classroom creation, invitations and membership.
- [x] Add daily topic assignments and assignment-aware student/teacher dashboards.
- [x] Add teacher support settings per student/topic and apply them to the AI tutor policy.
- [x] Expand classroom analytics with topic recall attempt history and question-level evidence for teacher review.
- [x] Add independent written practice exams, answer autosave, resume and immutable submission with draft self-review guidance.
- [ ] Add educator-reviewed writing rubrics and evaluated provisional AI feedback.
- [ ] Add teacher review/approval of assigned exam marks and correction history.
- [ ] Review all catalogue topics, resolve assessment-scope ambiguity and expand content safely.

## Completed
- [x] Define the revised Class 10 student/teacher plan and NCERT/CBSE chapter/topic planning catalogue.
- [x] Commit and push the existing React/FastAPI rebuild with saved lessons and server-graded quizzes.
- [x] Let learners report incorrect or confusing lesson content, with persisted account-owned reports and submission feedback.

## Earlier backlog (sequence superseded above)
- [x] Save learners' written reflections and restore them when a lesson is reopened.
- [x] Add bookmarks and a review queue for concepts learners want to revisit.
- [ ] Add supported equation-balancing practice with deterministic checking and hints.
- [ ] Add quiz attempt history and a way to reopen previous answer explanations.
- [ ] Add authorized staff report triage and curriculum review tools.
- [ ] Add reviewed content versions and richer retrieval with factual-support evaluation.
- [x] Build a frozen draft tutor benchmark and run an initial local evaluation (42 cases across seven topics and three languages).
- [ ] Obtain educator review of benchmark facts/replies and prepare a separate reviewed training dataset without holdout leakage.
- [x] Connect existing local Ollama inference and document a no-paid-API training path.

## External setup and release work
- [ ] Complete live Supabase code verification/recovery and connect the managed database (authentication credentials are configured locally).
- [ ] Obtain educator/rights approval for curriculum and training material.
- [ ] Benchmark candidate local models, prepare reviewed data, train/evaluate an adapter if useful and deploy an approved inference runtime (Ollama baseline connected experimentally).
- [ ] Configure staging/production hosting, monitoring, rate limits and backup recovery.
- [ ] Complete privacy, account deletion, accessibility and load checks.

Commit and push each completed task separately after relevant validation. Reports are currently stored for future staff review; no notification or staff review interface is implemented yet.

## Student adaptation — 15 October 2026
- [x] Opt-in private per-student/topic explanation feedback, bandit selection, teacher overrides and reset controls.
- [ ] Evaluate learning gains with educator-defined outcomes; current rewards are reported helpfulness only.

## Fine-tuning experiment — 15 October 2026
- [x] Prepare a separate GPU training environment and run an original synthetic QLoRA behavior experiment; save the local adapter, package versions, metrics and sample comparisons.
- [ ] Produce educator-reviewed, licensed Class 10 examples; improve Hindi/Hinglish and guiding-question behavior before considering deployment.
- [ ] Independently evaluate factual accuracy and the actual serving artifact. Current synthetic validation loss does not certify teaching quality.
- [x] Add the requested four-step Socratic sequence with explanation-before-check, failed-answer retry, persistence and server-enforced progression.
# Local tutor update — 15 October 2026

Completed: local Gemma QLoRA training, private local runtime connection, four saved comprehension-gated teaching steps, English/Hindi/Hinglish pilot source guidance, checked reflection calculations and visible source-response labels. Verification: 54 backend tests, 14 browser journeys and production build passed.

Remaining: educator review of the seven pilot topics and public training examples; full reviewed CBSE 2026–27 topic content; broader unseen factual and language evaluation; improved provider reliability (final pilot run accepted 41/42 requests). Fine-tuning alone remains insufficient for factual accuracy. See `ml/LOCAL_TUTOR.md`.

