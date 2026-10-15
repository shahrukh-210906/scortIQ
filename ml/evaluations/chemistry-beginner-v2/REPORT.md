# Beginner chemistry conversation

Implemented question-specific beginner support for `reactions-balance`: atoms, molecules, symbols, small subscripts, big coefficients, reaction sides, unchanged formulas and a different drawn-group explanation after confusion. Original authored help is available in English, Hindi and Hinglish; it remains draft and is not inserted into production retrieval.

Actual local-model conversations use fresh synthetic profiles. The v1 transcript retains the discovered contradiction: the model began by agreeing that a student could change H₂O into H₂O₂, then said this was a mistake. A narrow check now rejects that affirmative opening for this misconception. This is an observed-error guard, not a general chemistry fact checker.

The final v2 script repeats nine real turns: seven Hinglish beginner questions and two English questions. It checks that phase 0 remains saved and intentionally wrong checkpoint answers do not advance either student. The transcript records model/source/calculation response modes; source recovery is disclosed in the UI.

Whole-number water groups use deterministic arithmetic: `7H₂O` has 14 H and 7 O atoms; `19H₂O` has 38 H and 19 O atoms. The counter supports one water formula with integer coefficient 1–1000, not arbitrary chemistry. Negative/decimal coefficients, H₂O₂, multiple formulas and complete equations are rejected by this small counter. The final source explanation avoids guessing these counts.

Verification: 65 backend tests passed, including all-language help, unseen coefficients, unsupported counter inputs and formula-misconception checks. The browser Socratic-gating test passed. The local model can still produce awkward wording and other factual mistakes; broader unseen testing and genuine educator review remain necessary. No training or deployment occurred for this change.
