# Conversational tutor repair: release smoke test

The original beginner test (v1) returned the same response to six distinct questions in each language. The app, rather than the model alone, caused this by unconditionally replacing validated model replies with a phase template.

The app now keeps valid model explanations, supplies original prerequisite meanings and conversation history, and asks for patient, everyday teaching. Reflection's phase-0 context focuses on the actual requested prerequisite instead of introducing all the later laws. Model reply JSON uses an exact citation-ID enum for the OpenAI-compatible runtime. Repeated output, selected language failures, observed unsupported digressions and mismatched example/check pairs can use a clearly labelled source fallback. These guards are narrow, not a general factual verifier. Checked arithmetic and saved comprehension gates remain intact.

## Evidence

- Intermediate full 14-turn retests are retained in v2–v5, including malformed output, English drift in Hinglish, unsupported mirror/wall imagery and questions about examples not actually explained. These failures led to the targeted guards; they were not deleted.
- The full v5 comparison returned six distinct first-six replies in each language, versus one in v1. Both profiles stayed at phase 0 after a wrong checkpoint. That run predates the last example/check alignment guard and is not the final acceptance run.
- The final v6 release smoke check contains six real turns using fresh synthetic profiles: English ray and normal definitions; Hinglish introduction, perpendicular explanation, a request for another example, and clarification following a wrong checkpoint. All succeeded and stayed at phase 0. Five retained model-generated explanations; one used labelled source guidance. The book-cover example replaced the notebook-corner example when confusion continued.
- 61 backend tests passed. The browser Socratic-gating journey also passed. No training run was performed for this repair.

## Remaining limits

This is a limited pilot, not proof of general teaching quality or factual accuracy. Model wording remains awkward in places, and the final wrong-answer reply is more blunt than the requested older-sibling tone. Source fallback may sound authored; it is now question-specific for beginner reflection rather than a single lesson paragraph. Other topics have prerequisite facts and conversational model replies but their outage fallback remains phase-based. Broader concept coverage, educator review and evaluation of unseen conversations remain necessary. Multiple-choice correctness remains a limited comprehension signal, not mastery.

`transcript.json` contains the actual final responses and mode labels. No existing student's account or lesson was modified for the evaluation.
