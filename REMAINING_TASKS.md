# Remaining tasks

Updated 10 October 2026. Supabase configuration is deferred at the user's request.

## Revised product direction

Class 10 only, CBSE 2026–27. The agreed journey is AI understanding → exam notes → relevant equation/activity practice → recall quiz, with independent subjective practice exams and teacher-supervised classroom assignments. Teaching language (English/Hindi/Hinglish) and exam-answer language (English/Hindi) are separate account preferences.

See `CLASS10_PRODUCT_PLAN.md` and `CLASS10_CURRICULUM.md`. This direction supersedes the old feature order below. The catalogue covers 27 core chapters with 185 proposed topics and 13 supplementary formative topics; it is not yet integrated as reviewed lesson content.

## Priority implementation queue

- [x] Persist teaching/exam-language preferences and add four-subject catalogue navigation with clear lesson availability.
- [ ] Introduce topic stages: AI understanding, exam notes, optional activity and topic recall quiz.
- [ ] Complete one reviewed topic journey with real AI grounding and exam-writing notes in English/Hindi.
- [ ] Add authorised teacher roles, classroom creation, invitations and membership.
- [ ] Add daily topic assignments and assignment-aware student/teacher dashboards.
- [ ] Add teacher support settings per student/topic and evidence-based analytics.
- [ ] Add subjective practice exams, answer auto-save, reviewed rubrics and provisional AI feedback.
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
- [ ] Build a frozen tutor benchmark and a reviewed training dataset.

## External setup and release work
- [ ] Configure and live-test Supabase email sign-in/recovery (deferred).
- [ ] Obtain educator/rights approval for curriculum and training material.
- [ ] Train/evaluate a model and connect an approved Hugging Face endpoint.
- [ ] Configure staging/production hosting, monitoring, rate limits and backup recovery.
- [ ] Complete privacy, account deletion, accessibility and load checks.

Commit and push each completed task separately after relevant validation. Reports are currently stored for future staff review; no notification or staff review interface is implemented yet.
