# ScortIQ production rebuild plan

Prepared 7 October 2026. Planning document only; the existing application has not been rebuilt.

**Implementation update:** Following the requested reset, the old local application files and uncommitted AI service changes were removed. Git history and this plan were retained. A new React/TypeScript frontend and FastAPI backend now provide the first local learning flow, database persistence, server-side quiz grading, migration tooling, a guarded Hugging Face integration and a training entry point. The build, 11 backend tests and two browser journeys pass. Verified web sign-in, reviewed sources/retrieval, actual model training and production deployment remain outstanding. See `README.md` for the current implementation and setup.

**8 October update:** Added a persisted three-step lesson checklist/progress bar, versioned source import, topic-scoped lexical passage retrieval, source references on tutor replies, and rejection of invented citation IDs. Draft sources are excluded from production retrieval. The build, 15 backend tests and two desktop/mobile browser journeys pass; migration `0002` upgrades the previous schema without removing learning records. Reviewed external curriculum, semantic retrieval and factual-support evaluation remain outstanding. `BUILD_PROGRESS.md` tracks the defined milestone count.

## 1. Evidence and scope

ScortIQ is an AI learning companion for Indian students, with class 9–12 science topics, conversational tutoring, equation activities, generated quizzes, a sandbox tutor, and progress tracking. This assessment uses the local checkout. Its Git remote is `shahrukh-210906/SCORT-IQ`, whereas the supplied URL is `shahrukh-210906/scortIQ`. The supplied repository could not be independently retrieved through web browsing, so parity with that repository is unverified. Confirm the authoritative repository before implementation.

An existing uncommitted change in `src/utils/aiService.js` was preserved. Findings are source-review findings, not a complete runtime or security audit. `npm run build` completed with warnings: missing effect dependencies in ChatTutor, EquationTutor and SandboxTutor, plus outdated Browserslist data. Compilation success does not establish production readiness. Live tutoring, authentication, and deployment behavior were not tested.

| Finding | Evidence | Rebuild requirement |
|---|---|---|
| Login creates a local profile without proving identity | `LoginScreen.js`, `App.js` | Verified accounts, secure sessions, authorization on every protected API |
| Profiles, scores, and progress exist only in browser storage | `App.js` | PostgreSQL records tied to authenticated users; cross-device persistence |
| Gemini requests originate in the browser | `utils/aiService.js` | Server-only inference credentials; quotas, throttling, timeouts and monitoring |
| The `REACT_APP_` key is included in the client bundle | `utils/aiService.js` | A frontend environment variable does not keep a credential secret; rotate any previously deployed key |
| Tutor policy is appended only to the opening request and is not retained as a system policy on later calls | `tutors/ChatTutor.js`, `utils/aiService.js` | Persist server-owned tutor policy and reconstruct validated conversation context each turn |
| Completion depends on the model emitting `LESSON_COMPLETE` | `tutors/ChatTutor.js` | Server-owned lesson states and assessment-based mastery |
| Failed quiz generation exits through `onQuizComplete(0, topic.id)` | `TopicQuiz.js`, `App.js` | Distinguish failed/cancelled attempts from submitted assessments |
| Correct answers and grading are available in the browser | `TopicQuiz.js` | Store answer keys on the server; submit answers for grading |
| AI JSON is parsed with minimal application validation; failures become strings or empty arrays | `utils/aiService.js` | Strict schemas, typed errors, bounded repair/retry and useful recovery UI |
| Unchecked local-storage JSON can break startup; logout clears all origin storage | `App.js` | Resilient storage handling and scoped session cleanup |
| Curriculum is hardcoded into UI-oriented data | `data/curriculum.js` | Versioned curriculum database with reviewed source references |
| HTML insertion is used for equation content | `tutors/EquationTutor.js` | Safe math/chemistry rendering; sanitize any permitted rich content before accepting editor/AI input |
| Current toolchain uses Create React App | `package.json` | Adopt a supported build/framework path |
| No project-owned test files or CI configuration were found in the inspected tracked-style file inventory | Project inventory | Automated validation and staged releases |

Email activity reporting is also implemented client-side. Replace it with an explicit, minimal server-side notification policy rather than sending learning activity by default.

## 2. Product scope

Keep the vision: a curriculum-grounded tutor that teaches concepts, identifies misconceptions, provides equation practice, and tracks learning evidence.

**Proposed first release:** class 10 science, 3–5 reviewed chapters, English and Hindi/Hinglish, verified student accounts, resumable lessons, reviewed quizzes, progress, feedback reporting, and a content administration interface. This is a planning assumption that should be confirmed in discovery.

**Later releases:** remaining chapters, classes 9/11/12, additional languages, expanded equation activities, sandbox learning, teacher/parent views, and optional voice/image input. Each new language needs its own evaluation and content review. Payments are optional and should follow validation of the learning product.

Retain useful topic IDs, reviewed lesson concepts, and visual assets after checking accuracy and rights. Build the new application in a separate directory/branch and keep the old app available as a reference. Do not blindly migrate browser scores as verified mastery.

## 3. Recommended architecture

Start with one backend application and background workers, rather than many services.

| Layer | Proposed choice | Purpose |
|---|---|---|
| Student/admin web | React + TypeScript + Vite; router, query client, Tailwind, safe math renderer | Focused web app with reliable navigation, typed data and accessible components |
| Backend | Python FastAPI + Pydantic | Authentication integration, learning workflows, AI orchestration, grading and admin APIs |
| Identity | Managed authentication with verified email/provider login | Secure sessions and account recovery; backend verifies identity and ownership |
| Data | PostgreSQL + migrations | Users, curriculum, lessons, attempts, answers, progress and release metadata |
| Retrieval | PostgreSQL pgvector plus keyword search | Retrieve chapter-specific supporting passages; avoid a separate vector service initially |
| Storage | Private object storage | Reviewed source documents and generated exports |
| Jobs | Redis-backed worker queue when asynchronous ingestion/generation is needed | Import content, build indexes and prepare question drafts |
| Model registry | Private Hugging Face model repository | Versioned model weights/adapters and model cards |
| Inference | Hugging Face dedicated Inference Endpoint | Production inference for the trained model |
| Operations | Containerized API/worker, managed database, frontend hosting, CI/CD | Repeatable deployment, monitoring and rollback |

Pin compatible versions at implementation time. Deploy staging and production separately. Host near intended users where provider availability, latency and data requirements permit.

Request flow: student → authenticated API → permission/quota checks → lesson state and source retrieval → Hugging Face model → output validation and supported calculation checks → persisted response → student. The browser never receives the inference token.

Core entities: User, StudentProfile, CurriculumVersion, Subject, Chapter, Topic, SourceDocument, SourceChunk, LessonSession, Message, QuestionVersion, QuizAttempt, SubmittedAnswer, MasteryEvidence, Feedback, ModelRelease, EvaluationRun and AuditEvent. Include ownership, timestamps and content/model versions. A mastery value must retain the evidence used to derive it.

Core API groups: profile; curriculum; lesson start/resume/turn; quiz start/submit/results; progress; feedback; and protected content/model administration. Mutating requests need duplicate-submission protection. Quiz answers remain hidden until the relevant submission is graded.

## 4. Tutor design

Use an explicit lesson workflow: diagnose → explain → guided practice → independent check → summary/review recommendation. Give graduated hints, then a worked explanation when needed; do not trap struggling students in endless Socratic questions.

Retrieve only appropriate curriculum passages using class, subject, chapter, edition and language filters. Return traceable source references. If evidence is absent or conflicting, ask a clarifying question or say the material is not covered reliably.

The model proposes explanations and questions; the application controls permissions, completion, scoring and storage. Validate a typed turn format containing commentary, question type, options, hint level and source IDs. Keep any answer keys in backend-only fields. Validate that citations refer to retrieved sources and actually support the response during evaluation.

Use deterministic checking for supported numeric, unit and symbolic problems. Use reviewed rubrics for open-ended responses, treat model grading as fallible, and allow corrections. Isolate any calculation execution; never execute arbitrary generated code.

Handle streaming/cancellation, stale requests, repeated submissions, context limits, provider outages and model warming. During an outage, preserve attempts and offer reviewed material; do not generate a fake tutor response or fabricate a score.

## 5. Custom model training plan

Rebuild the application from scratch, but **fine-tune an existing pretrained model**. Training a general language model from random weights is a separate, much larger research and infrastructure effort. A custom fine-tune is not automatically more accurate than Gemini.

### A. Define the benchmark first

Create 300–500 expert-reviewed pilot cases across explanations, misconceptions, multi-turn tutoring, equations, structured questions, language quality, unsupported questions and adversarial instructions. Separate held-out chapters/question families from training data; prevent near-duplicate leakage. Compare the current Gemini approach, an open model with retrieval, and its fine-tuned version under the same evaluation conditions.

### B. Establish an open-model baseline

Benchmark a small shortlist of roughly 4–8B instruction models against quality, language behavior, license, endpoint compatibility, memory and cost. Qwen3-8B is one candidate to evaluate, not a final selection. Confirm its actual Hindi/Hinglish performance on the project benchmark rather than relying on multilingual claims. Fix the selected revision and inference settings; configure any reasoning mode and token limits explicitly.

### C. Build the dataset

Use source material whose rights permit the intended ingestion, training and commercial use. Do not assume downloadable textbooks can be freely redistributed or used for every purpose. Document rights and provenance before inclusion.

Start with 2,000–5,000 carefully reviewed examples as a pilot target, then expand only when error analysis justifies it. Include correct explanations, realistic incorrect student answers, escalating hints, recovered misconceptions, supported calculations, language variants, source-grounded answers and uncertainty responses. These counts are planning targets, not guarantees of adequate coverage.

Store multi-turn messages with source/version metadata, class/topic/language labels and reviewer status. Teacher-review synthetic examples; never train directly on unverified generated answers. Exclude personal student data by default; any later use requires an appropriate permission and de-identification process.

### D. Train and measure

Use supervised fine-tuning with Hugging Face Transformers, TRL and PEFT LoRA/QLoRA. Pilot GPU requirements depend on architecture, sequence length, batch size and quantization; measure a small run before budgeting full training. Track data hashes, hyperparameters, seeds, checkpoints and training/evaluation metrics.

Fine-tuning teaches tutoring behavior, language and response structure. Retrieval supplies versioned curriculum knowledge. Calculation tools address supported arithmetic/symbolic tasks. Keep all three.

Compare base+retrieval against fine-tuned+retrieval. Review results by language and topic, including regressions. Add preference tuning only after supervised training if a documented error pattern warrants it; reinforcement learning is not an initial requirement.

### E. Publish and deploy

Upload a private model or adapter repository with its tokenizer, compatible base revision, license, model card, evaluation report and training provenance. Confirm whether the chosen endpoint runtime supports adapters; merge into a compatible model artifact if required and permitted by the license. Test deployed/quantized artifacts because their behavior can differ from training-time evaluation.

Use a dedicated Hugging Face Inference Endpoint for the production path. Publishing on the Hub alone does not create a running production API. Keep endpoint authentication in the backend, pin model releases, configure replica limits, and measure warm/cold latency. Scale-to-zero saves idle compute but introduces cold starts; choose it deliberately for a tutor experience.

Deploy a candidate to staging, run the held-out evaluation, then canary it against the last approved model. Record the model, prompt and retrieval versions for each turn. Keep one-click rollback. If the fine-tune does not outperform the open-model baseline, retain the baseline and improve data rather than forcing the trained model into production.

## 6. Delivery sequence

Indicative 12–16 week roadmap for a small experienced team with educator support. A solo or part-time effort will take longer; content rights, review capacity and training experiments can change the timeline.

| Phase | Window | Deliverables | Exit gate |
|---|---|---|---|
| Discovery | Week 1 | Confirm repository, users, pilot chapters, language policy, budget, rights and benchmark rubric | Approved pilot scope and measurable acceptance criteria |
| Foundation | Weeks 2–3 | New app structure, identity, database, migrations, staging, CI and account-owned APIs | Two users cannot access each other's records; sessions persist across devices |
| Content and learning | Weeks 4–5 | Reviewed curriculum import, source references, lesson states, reviewed quiz bank and grading | One complete non-AI learning journey works and failures never alter scores |
| Grounded AI baseline | Weeks 6–7 | Open model endpoint, retrieval, validated tutor turns, math checks, retries, quotas and feedback | Baseline passes agreed pilot accuracy and outage tests |
| Dataset and training | Weeks 8–10 | Reviewed training set, reproducible fine-tune, benchmark comparison and release artifact | Candidate demonstrates useful improvement without critical regressions |
| Product completion | Weeks 11–12 | Resume, progress, revision suggestions, equation practice, accessibility and content/admin review | End-to-end student and reviewer journeys pass |
| Hardening and beta | Weeks 13–16 | Load/security testing, backup restore, alerts, rollback, closed beta and fixes | Launch criteria satisfied on real hosting |

Content preparation and model benchmarking can overlap foundation work once the scope is approved. Do not delay backend correctness while collecting training data.

## 7. Production acceptance criteria

Proposed targets to calibrate in discovery, not claims about current performance:

- No known critical/high security defects; secret scanning and server-side ownership checks pass.
- Account data remains consistent across devices; cancelled/failed quizzes do not create submitted scores; duplicate submissions do not double count.
- At least 95% factual correctness on the reviewed pilot test set, reported separately by topic/language; no critical errors in the defined safety and grading suite. Increase test coverage before widening scope.
- At least 99% accepted structured tutor turns after bounded validation/recovery, with invalid outputs producing a safe recoverable error.
- Warm tutor response start p95 target below 5 seconds at the agreed load; separately measure full-turn latency and cold starts.
- Target 99.5% application availability for beta; define dependency outages and measurement windows. Set supported concurrency and per-student cost limits through actual load tests.
- Reviewed quiz keys and rubrics; server-side grade integrity; no completion based solely on model assertions.
- Mobile, keyboard and screen-reader critical journeys pass; mathematical notation is readable and accessible.
- Backup restoration and rollback are demonstrated in staging; alerting detects inference failures, job backlogs and unusual spend.
- Versioned deployments and content; educator sign-off and pilot feedback issues resolved before public expansion.

Use unit tests for grading/state transitions, integration tests for ownership and persistence, end-to-end tests for student journeys, AI evaluation for behavior/correctness, and load tests for real concurrency. Include corrupted storage, missing sources, malformed model JSON, long conversations, hostile input and dependency failures.

Because the audience includes minors, make age/consent policy, data minimization, retention/deletion, access controls and applicable privacy review explicit release work. Avoid publishing student conversations or training on them by default.

## 8. Budget and staffing

Plan separate budgets for application hosting/database, GPU training experiments, recurring inference, content/teacher review, monitoring and support. Uploading a model does not make inference free. Avoid a fixed price estimate until a benchmark establishes memory needs, tokens per session and concurrency.

Estimate monthly inference as hardware hourly rate × active replica-hours, plus related hosting/storage/network costs. Estimate cost per lesson using measured tokens, throughput and average utilization, including idle capacity. Cap input/output tokens, concurrent requests and daily student usage; alert before budget thresholds.

Suggested responsibilities: product/full-stack lead, backend/ML engineer, educator/content reviewer and QA/design support. These may be shared roles, but educator review is necessary for credible curriculum accuracy.

## 9. First implementation milestone

Deliver one vertical slice: verified login → choose one reviewed chapter → start a grounded tutor session → resume it → submit a reviewed quiz → receive a server-computed score → view evidence-based progress. Demonstrate the same journey under an inference outage and with a second account. Only then expand chapters and train against the benchmark.

Before work starts, confirm authoritative repository, pilot scope, GPU/hosting budget, available reviewed material and intended concurrent users. Until confirmed, use the pilot assumptions above. Preserve the existing checkout and its uncommitted changes.

## References

- React: Create React App deprecation and migration guidance: https://react.dev/blog/2025/02/14/sunsetting-create-react-app
- Hugging Face TRL/PEFT training: https://huggingface.co/docs/trl/peft_integration
- Candidate model card: https://huggingface.co/Qwen/Qwen3-8B
- Hugging Face Inference Endpoints: https://huggingface.co/docs/inference-endpoints/index
- Autoscaling and scale-to-zero tradeoffs: https://huggingface.co/docs/inference-endpoints/autoscaling

### Supabase sign-in implementation � 8 October 2026

The selected provider is Supabase. Email-code sign-in and passwordless account recovery now use server-side Supabase verification and one-hour HttpOnly browser sessions. The same verified identity restores saved progress on another browser; local pilot profiles remain separate. Expiring challenges, attempt limits, resend cooldowns, session rotation, logout and production rejection of local sessions are implemented. Database migration 0003 adds verification challenges.

Validation: 19 backend checks and 3 browser checks pass, including mocked sign-in and account recovery. Live project URL/public key, code email template, delivery, production database/HTTPS and abuse controls remain required. The milestone stays in progress until live integration is verified.
