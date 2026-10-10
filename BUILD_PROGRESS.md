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
