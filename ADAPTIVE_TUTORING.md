# Private adaptive tutoring

In Settings, enable **Remember which explanations help me**. Tutor replies then offer **This explanation helped** and **Try a different approach**. Future replies try different explanations separately for each student and topic. This works with the existing configured inference model; it does not require new API credits.

The application uses a small Bernoulli contextual bandit with Thompson sampling: each account/topic/style has helpful and unhelpful counts, a Beta(1,1) prior and a sampled reward estimate. Before any feedback it starts with step-by-step explanations; later it balances exploration and reported helpfulness among step-by-step, worked-example and concise explanations. Each saved assistant turn permits one immutable rating. Identical retries do not increment counts. It is reinforcement learning of a teaching-style selection policy, not RLHF or changes to language-model weights.

Reported helpfulness is a preference signal. It does not establish a fixed learning style, prove learning gains, label factual correctness, change exam marks or infer mastery. Requests for extra detail or simple language from an authorised teacher exclude concise explanations; existing language, source citation and tutor policies continue to apply.

Feedback is opt-in, stored under the authenticated account and never exported into shared training automatically. Disabling stops using and collecting feedback and preserves counts for a later opt-in. **Forget explanation preferences** removes ratings and policy counts, disables adaptation and keeps lessons/quizzes. Other students cannot inspect or rate an account's lessons. Teachers do not receive a feedback-data export through this feature.

Migration `0013` adds `learner_memory`, `teaching_arms` and `tutor_ratings`. Apply it to managed databases before running this version. Local development creates the missing tables on startup.

Next research steps: educator-defined outcomes, delayed recall/transfer measures, consented controlled evaluation and better support for students whose ratings and assessed understanding differ. Current rewards are explicit helpfulness only; this is an experimental personalisation feature.
