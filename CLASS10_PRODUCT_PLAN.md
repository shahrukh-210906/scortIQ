# ScortIQ: Class 10 classroom learning plan

Agreed direction: 10 October 2026. This plan supersedes the broader Class 9–12 scope and old feature order in REBUILD_PLAN.md. Board/year: CBSE 2026–27, confirmed by the user. This is a specification; features described here are not all implemented.

## Student experience

1. Sign in, choose a teaching language (English, Hindi or Hinglish) and an exam-answer language (English or Hindi). Save both to the account and allow changes later. Hinglish is an app teaching mode, not a separate NCERT textbook edition.
2. Join the selected teacher's classroom using a controlled invitation. The dashboard shows today's assigned topics, due dates, learning stages, quiz evidence, writing feedback and the saved review queue.
3. Open Study, choose Maths, Chemistry, Biology or Physics, then a chapter and topic. Classroom assignments provide a direct shortcut to the same topic.
4. **Understand with AI:** start with a short diagnostic question; explain in the preferred teaching language, use examples, offer hints and check understanding. The tutor uses reviewed topic sources and the teacher's scoped support settings. A student's short answer is learning evidence; neither time spent nor an AI completion phrase proves mastery.
5. **Prepare exam notes:** show a simple explanation alongside an answer in the chosen exam language. Include key scientific terms, necessary points, equations/units, labelled diagrams where appropriate, common omissions and a worked answer structure. Explain why each point matters. Accept equivalent correct wording; do not reward keyword repetition without meaning. Mark allocations require a reviewed question/rubric, not a model guess.
6. **Practise interactively when relevant:** balance reactions by changing coefficients, match reactants/products, identify reaction types or conditions; use Maths/Physics formula and unit activities where useful. Keep formula identities intact and check supported answers deterministically. Topics without a suitable activity skip this stage.
7. **Recall quiz:** short topic-level questions, server-side grading, explanations and targeted retry recommendations. Retain individual attempts and distinguish submitted, cancelled and failed attempts.
8. **Write a subjective practice exam at any time:** choose topics/chapter coverage, answer language and timed or untimed practice. Auto-save answers, submit, receive rubric-based provisional AI feedback, then revise. Practice exams remain accessible independently of completion of lesson stages.

The study sequence is recommended, with teacher-assigned focus. Learners can revisit completed stages and notes; teachers can define an assignment sequence without globally blocking independent revision. Draft content or an unavailable AI service must be visibly identified. During an AI outage, preserve work and allow access to available reviewed notes/practice; do not fabricate a tutoring interaction.

## Written exam feedback

Start with typed short answers, proofs and numerical working. Give feedback on conceptual accuracy, missing reasoning, answer organisation, relevant terminology, units, equations and diagram requirements. Separate scientific correctness from language fluency. Show a point-by-point rubric, provisional score and the student's original answer. Allow teacher correction and retain the correction history. Formal teacher-assigned exam marks require teacher approval; independent practice may display provisional feedback immediately.

Do not provide an answer coach during timed assessment; make coaching available after submission or in an explicitly untimed practice mode. Never overwrite a student's submission with the model answer. Handwritten uploads, mathematical handwriting recognition and diagram assessment are later features requiring their own evaluation.

## Teacher experience

- Teacher sign-in and approved teacher role; choosing a role in the browser must not grant access.
- Create multiple classrooms, manage membership, rotate invitations and remove access. Students may join multiple classrooms; assignments/settings retain their classroom scope.
- Assign a topic, sequence, practice activity or written exam to a classroom or selected students, with due dates and instructions.
- View stages completed, submitted quiz results, written answers and recurring misconceptions. Show the actual evidence behind a recommendation, rather than a single unexplained ability score.
- Set support per student and topic: simpler wording, smaller steps, extra examples, prerequisite review, hint pace and language support. Record author, scope and update time; allow reset. Resolve multiple teachers' settings using the active assignment's classroom.
- Use evidence-based descriptions such as "needs help with balancing oxygen atoms" instead of permanent labels such as "weak student". A learner's difficulty in one topic should not lower expectations everywhere.
- Review AI feedback and proposed scores, correct rubrics/content and assign follow-up work. Teachers see only members of classrooms they control.
- Later: small-group assignments, classroom announcements, revision schedules, question banks, progress exports and approved co-teachers.

Teacher settings are validated teaching preferences, not arbitrary instructions that can override source accuracy, account permissions or assessment rules. Every protected operation must validate the teacher's relationship to the classroom/student on the server.

## Curriculum and content structure

Use `curriculum/class10_ncert_2026_27.json` as the planning catalogue and `CLASS10_CURRICULUM.md` as the readable chapter/topic list. Maths has its own book. Chemistry, Biology and Physics are app groupings of the integrated NCERT Science textbook; Our Environment is grouped with Biology.

Each published topic needs objectives, prerequisites, a reviewed teaching pack, English/Hindi exam notes, misconception checks, optional activities, quiz questions and subjective questions with reviewed rubrics. Store source edition, chapter/section/page references, rights status, reviewer and content version. A catalogue topic is not a finished lesson. Preserve existing pilot topic IDs through explicit mappings before integrating the new catalogue; do not discard saved lessons, reflections or scores.

NCERT book contents and CBSE assessment scope are separate fields. The current Science syllabus has inconsistent wording around some formative-only areas, particularly heredity/magnetic effects. Flag those mappings for teacher review before publishing board-exam claims. Keep supplemental periodic classification, evolution and motor/induction/generator activities distinctly tagged as formative material.

Sources: [NCERT Maths 2026–27 contents](https://ncert.nic.in/textbook/pdf/jemh1ps.pdf), [NCERT Science 2026–27 contents](https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf), [CBSE Class 10 Maths syllabus](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1X_2026-27.pdf), [CBSE Class 10 Science syllabus](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf), [CBSE supplemental Science reading](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1IX_2026-27_RM.pdf).

## Implementation order

1. Save language preferences and introduce the versioned four-subject catalogue with accurate availability labels.
2. Restructure topic pages into Understand → Exam notes → Activity when applicable → Recall quiz. Keep prior account-owned learning records.
3. Build one complete reviewed topic journey, including a real configured AI tutor, before rolling out every catalogue topic. Supabase configuration remains deferred; local development can continue.
4. Add teacher roles, classrooms, invitations and memberships, then daily topic assignments and assignment-aware dashboards.
5. Add topic-level support settings and evidence-based teacher analytics.
6. Add typed subjective practice exams, auto-save, reviewed rubrics, provisional feedback and teacher approval.
7. Expand reviewed content across the catalogue, assess English/Hindi/Hinglish tutoring quality, then complete production authentication and operational validation.

## Acceptance criteria

- Both language preferences persist and remain distinct; switching teaching language preserves learning evidence.
- Students resume each stage, notes, reflection, activity and quiz without losing work.
- Activity scores use supported deterministic checks and never expose hidden quiz keys before submission.
- A student can access independent written practice without finishing the topic journey.
- Teacher assignments and support settings affect only authorised students and the intended topic/classroom.
- Teacher-approved marks retain the original submission, provisional feedback and approval/correction history.
- Curriculum versions identify textbook coverage and assessment scope; no draft note is labelled reviewed or official exam guidance.
- Real AI behaviour, factual grounding, bilingual notes and written grading are evaluated before release. Existing mocked auth tests do not prove a live provider integration.
