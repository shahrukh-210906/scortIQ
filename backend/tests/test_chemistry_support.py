import unittest

from backend.app.beginner_support import (
    beginner_fallback,
    conversational_check,
    prerequisite_source,
)
from backend.app.chemistry_support import checked_water_count, chemistry_focus, water_count


class ChemistryBeginnerTests(unittest.TestCase):
    def test_changing_formulas_is_not_affirmed_and_checks_match_the_example(self):
        question = "Can I change H2O into H2O2?"
        evidence = prerequisite_source("reactions-balance", question)
        with self.assertRaises(ValueError):
            conversational_check(
                "reactions-balance",
                "en",
                question,
                [],
                "Yes, change H2O into H2O2 before balancing.",
                evidence,
                0,
            )
        question = "What is a coefficient?"
        evidence = prerequisite_source("reactions-balance", question)
        with self.assertRaises(ValueError):
            conversational_check(
                "reactions-balance",
                "en",
                question,
                [],
                "A number counts apples. Understand?",
                evidence,
                0,
            )

    def test_distinct_basics_in_all_languages_are_grounded_and_do_not_solve_equation(self):
        questions = [
            "I know nothing. Start from the beginning.",
            "What is an atom?",
            "What is a molecule?",
            "What are the symbols H and O?",
            "What does the small number in H2O mean?",
            "What is a coefficient?",
            "Can I change H2O into H2O2 to balance it?",
            "What does the arrow mean?",
        ]
        for language in ("en", "hi", "hinglish"):
            replies = []
            for question in questions:
                evidence = prerequisite_source("reactions-balance", question)
                reply, cited, mode = beginner_fallback(
                    "reactions-balance", language, question, [], evidence
                )
                self.assertEqual(cited, evidence)
                self.assertEqual(reply.count("?"), 1)
                self.assertNotIn("2H₂ + O₂", reply)
                self.assertEqual(mode, "source_guided")
                replies.append(reply)
                self.assertIsNone(
                    beginner_fallback("reactions-balance", language, question, [], [])
                )
            self.assertEqual(len(set(replies)), len(questions))

    def test_confusion_changes_counting_example(self):
        history = [{"role": "user", "content": "What does the big number mean?"}]
        question = "I am still confused. Show me another example."
        self.assertEqual(chemistry_focus(question, history), "count_retry")
        evidence = prerequisite_source("reactions-balance", question, history)
        reply = beginner_fallback("reactions-balance", "en", question, history, evidence)[0]
        self.assertIn("[H H O] [H H O]", reply)

    def test_water_counts_use_arithmetic_for_unseen_coefficients(self):
        for n in (1, 3, 7, 19, 1000):
            question = f"How many H and O atoms are in {n}H2O?"
            self.assertEqual(water_count(question), n)
            for language in ("en", "hi", "hinglish"):
                evidence = prerequisite_source("reactions-balance", question)
                reply, cited, mode = beginner_fallback(
                    "reactions-balance", language, question, [], evidence
                )
                self.assertIn(f"{n} × 2 = {2 * n}", reply)
                self.assertIn(f"{n} × 1 = {n}", reply)
                self.assertEqual(mode, "checked_calculation")
                self.assertTrue(cited)
        for question in (
            "0H2O",
            "1001H2O",
            "-3H2O",
            "0.5H2O",
            "3H2O2",
            "2H2O + O2",
            "2H2O and 3H2O",
            "3H2O and CO2",
        ):
            self.assertIsNone(water_count(question), question)
        self.assertIsNone(checked_water_count("What is water?", "en"))
