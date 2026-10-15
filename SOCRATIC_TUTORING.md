# Guided Socratic tutoring

Each connected tutor lesson now follows four saved steps:

1. Understand what the problem gives and asks.
2. Work through the solution with reasons for each step.
3. Connect the underlying topic to that solution.
4. Apply the idea and check understanding.

Use **Explain this step**, read the reply in the selected teaching language, and attempt the short comprehension check. A wrong answer stays on the same step and requires another explanation before retrying. The next prompt tells the tutor to simplify or use a different explanation. A correct check unlocks the next teaching step. The server enforces order, account ownership, stale-attempt rejection and the requirement to receive an explanation first; a chat message or preference rating cannot unlock a step.

All four checks unlock exam notes/activity/recall while the AI endpoint is configured. Independent written exams remain available separately. With no tutor configured, the existing offline notes/practice path remains available. Existing lesson stages and learning records are preserved. Migration `0014` adds the saved teaching state to managed databases; development creates missing tables.

The seven pilot topics have four original multiple-choice checks each, checked deterministically on the server. Options are currently English; the AI is instructed to explain and ask the check in the student's teaching language. A short correct check is evidence of answering that question, not proof of mastery, and the pilot content still needs educator review. The model can still make mistakes; the phase gate cannot certify every sentence of its explanation. The fixed checkpoint tracks a topic example rather than creating a new graded checkpoint for every arbitrary problem a student types.

Chats retain up to 100 turns, with bounded recent context and the existing account request quota. Feedback-based explanation preferences remain separate from correctness and teacher support remains active.
