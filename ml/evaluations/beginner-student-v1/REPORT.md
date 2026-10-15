# Complete-beginner live tutoring test

Topic: light-reflection. Two isolated synthetic student profiles, English and Hinglish, seven real chat turns each. No provider mocks; tested the connected preview application, including its source-guidance layer. All 14 requests returned HTTP 200. This evaluates what the student actually sees, not raw model capability in isolation.

## Result: fails beginner teaching needs

In each language, the first six different student messages received exactly the same response (one unique reply out of six). Questions asked what light/reflection, ray, normal, perpendicular and 90 degrees mean, requested an easier everyday example, and expressed a mistaken belief that angles use the mirror surface.

The app did not define the requested words, respond to the misconception in chat, or simplify after repeated confusion. Its repeated opening assumed knowledge of rays, reference lines, perpendicular lines and angles. After an intentionally wrong checkpoint, it added incidence, reflection and same-plane terminology rather than reducing complexity.

The checkpoint correctly kept both profiles at phase 0. No unsupported mastery claim or automatic progression was observed. Language selection worked mechanically; this is not an independent fluency certification.

## Cause and required next change

`backend/app/source_guidance.py` returns a fixed phase-0 problem statement without considering the student's question. This source layer replaces model prose to reduce factual errors, but currently also discards question-specific clarification. A deployment change alone will not fix this behavior.

Required work: retain factual grounding while responding to the actual confusion; explain prerequisite vocabulary in everyday language, one concept at a time; use a concrete example before symbols and angles; check that prerequisite before returning to the main problem; respond differently after a wrong answer. Add a regression conversation that rejects identical replies to these distinct clarification requests. Do not infer comprehension merely from a student saying yes.

Full actual student/tutor messages and saved phases are in `transcript.json`. No student's existing lesson or account was used. No tutor behavior was changed as part of this evaluation.
