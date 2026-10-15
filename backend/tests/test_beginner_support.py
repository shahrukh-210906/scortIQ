import unittest

from backend.app.beginner_support import (
    beginner_fallback,
    conversational_check,
    prerequisite_source,
)


class BeginnerSupportTests(unittest.TestCase):
    def test_unrelated_claim_is_rejected_and_checks_are_concrete(self):
        question = "I know nothing. What is reflection?"
        evidence = prerequisite_source("light-reflection", question)
        with self.assertRaises(ValueError):
            conversational_check(
                "light-reflection",
                "hinglish",
                question,
                [],
                "Torch on a wall shows your image. Understood?",
                evidence,
                0,
            )
        question = "What is a ray?"
        evidence = prerequisite_source("light-reflection", question)
        reply = conversational_check(
            "light-reflection",
            "en",
            question,
            [],
            "A ray is a drawn arrow showing light moving away from a torch. Do you understand?",
            evidence,
            0,
        )
        self.assertNotIn("Do you understand", reply)
        self.assertIn("away from the torch", reply)
        self.assertEqual(reply.count("?"), 1)

    def test_questions_receive_distinct_specific_prerequisites_and_checks(self):
        questions = [
            "I know nothing. What is light and reflection?",
            "What is a ray? Can I touch it?",
            "Normal means ordinary?",
            "What does perpendicular or 90 degrees mean?",
            "I measure the angle from the mirror surface, right?",
        ]
        for language in ["en", "hi", "hinglish"]:
            replies = []
            for question in questions:
                evidence = prerequisite_source("light-reflection", question)
                result = beginner_fallback("light-reflection", language, question, [], evidence)
                self.assertIsNotNone(result)
                reply, cited, mode = result
                self.assertEqual(reply.count("?"), 1)
                self.assertEqual(mode, "source_guided")
                self.assertEqual(cited, evidence)
                replies.append(reply)
            self.assertEqual(len(set(replies)), len(questions))
            self.assertNotIn("30", replies[0])

    def test_confusion_uses_prior_student_question_and_changed_sources_do_not_match(self):
        history = [{"role": "user", "content": "What does perpendicular mean?"}]
        question = "I am still confused, give an example."
        evidence = prerequisite_source("light-reflection", question, history)
        self.assertTrue(evidence[0]["id"].endswith(":corner_retry"))
        self.assertIn(
            "front cover",
            beginner_fallback("light-reflection", "en", question, history, evidence)[0],
        )
        self.assertIsNone(beginner_fallback("light-reflection", "en", question, history, []))
        evidence[0]["excerpt"] = "Changed"
        self.assertIsNone(beginner_fallback("light-reflection", "en", question, history, evidence))
