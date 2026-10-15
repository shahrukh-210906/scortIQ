# Rebuild progress

10 October scope update: Added the agreed Class 10-only student/teacher specification and NCERT/CBSE 2026–27 planning catalogue: 27 chapters, 185 proposed topic units and 13 formative supplement topics. Five chapter PDF fetches failed; their detailed mappings are flagged for review. New classroom/exam/language features are specified, not yet implemented. Current priorities are in `REMAINING_TASKS.md`.

Updated 8 October 2026. This bar counts defined milestones, not time, effort, or production readiness.

`████░░░░` **4 of 8 milestones complete**

| Milestone | Status |
|---|---|
| New responsive frontend and database-backed backend | Complete |
| Server-graded quizzes and saved account-owned progress | Complete |
| Saved lesson checklist and accessible progress bar | Complete |
| Versioned source import, topic-scoped lexical retrieval and citation-ID validation | Complete |
| Verified web sign-in, account recovery and production identity checks | Implemented with Supabase email codes; 19 backend and 3 browser checks pass. Awaiting project configuration and live delivery/recovery validation |
| Educator-reviewed curriculum, improved retrieval and tutor benchmark | Pending; current content is draft |
| Custom model training, evaluation and Hugging Face deployment | Pending; training entry point exists, no trained model |
| Production hosting, load/accessibility/privacy checks, monitoring and recovery | Pending |

Current milestone: configure and live-verify Supabase sign-in and recovery. Source review and model evaluation can continue independently, but no unreviewed model/content should be treated as release-ready.

10 October: Existing rebuild committed and pushed. Added persisted learner issue reports with validation and submission feedback. Supabase configuration is deferred; feature work is tracked in `REMAINING_TASKS.md`.
10 October: Added saved, editable account-owned written reflections. Build, 21 backend checks, migration parity and browser journeys validate the feature.
10 October: Added account-owned bookmarks and a mobile-friendly Saved for review queue. Validated build, 22 backend checks, four browser journeys (including failed-save retry, reload persistence and removal), formatting and migration parity.
10 October: Implemented saved teaching/exam-answer language preferences and searchable four-subject study-map navigation, with clear planned-topic labels and retained pilot lessons. Build, 24 backend checks, five browser journeys and migration parity pass. Real bilingual content/model evaluation remains pending.
10 October: Added saved AI-learning/notes/activity/recall stages across the seven-topic pilot. Original draft exam notes include a first-topic Hindi version; Chemistry balancing activities use server atom counts; topic recall quizzes retain graded results. Build, 26 backend checks, six browser journeys and migration parity pass. Live AI and educator-reviewed bilingual content remain incomplete.
10 October: Added operator-approved teacher roles and private classrooms with expiring/replaceable join codes, teacher rosters and student join/leave controls. Teacher access cannot be chosen by a browser. Build, 28 backend checks, seven browser journeys and migration parity validate the feature. Daily assignments and teacher analytics remain next; Supabase setup remains deferred.
10 October: Added dated classroom topic assignments, teacher instructions, withdrawal and assignment-aware dashboards. Students see their own saved practice; classroom owners see current-member notes/activity/recall summaries. Completion reflects saved practice rather than mastery or formal marks. Build, 30 backend checks, eight browser journeys, formatting/lint and migration parity pass. Teacher support settings and richer evidence-based analytics are next. Supabase remains deferred.
10 October: Added per-classroom/student/topic support choices for simpler language, step-by-step detail and guided practice, with saved teacher controls and student visibility. Current memberships and approved teachers determine the fixed instructions added to each AI request; language and grounding policies remain applied. Build, 33 backend checks, nine browser journeys and migration parity validate policy wiring and access checks. Live AI quality remains unverified. Next: deeper classroom evidence/attempt analytics and subjective practice exams. Supabase remains deferred.
15 October: Configured local Supabase authentication and verified the public settings endpoint plus a successful email-code send request. Code verification/recovery and managed database connection remain pending; local demo access is available.
15 October: Added teacher-only topic recall history with ten-attempt pages, latest/best summaries and question-level selected/expected answers. Current membership, teacher approval and active assignments restrict access. No schema changes. Build, 35 backend checks, ten browser journeys and format/lint checks validate the feature. Next: subjective practice exams and saved written answers; reviewed rubrics and live AI feedback remain prerequisites for formal assessment.
15 October: Added independent single-question written practice exams with saved language/question snapshots, server autosave, browser draft recovery, optimistic revision checks and locked submission. Draft self-review examples/checklists are available after submission; no scores or AI feedback are issued. Short-screen sidebar access is fixed. Build, 37 backend checks, 12 browser journeys, formatting/lint and migration parity pass. Next: educator-reviewed rubrics, evaluated provisional AI writing feedback and teacher exam review.
15 October: Connected the already-installed local Ollama/Llama 3.1 model without paid API calls or downloads, and added a beginner guide covering retrieval, reviewed training examples, QLoRA and local model import. Five real app tutor requests returned accepted JSON/citations; manual checks found a wrong Physics answer and uneven Hindi, so the model remains experimental. Reply-language instructions were tightened; 37 backend checks and format/lint pass. No model training, educator approval or AI exam grading has occurred.
15 October: Added a frozen draft 42-case benchmark, an isolated local-app evaluation runner and a blank human-review sheet. The installed Llama 3.1 run returned 39 accepted replies and three failures. Language/question-mark indicators are recorded separately from unassessed factual quality. Training validation now rejects holdout overlap. All 42 automated checks and suite/lint/format validation pass. Educator review, independent training examples and model comparisons remain next; no fine-tuning was performed.
