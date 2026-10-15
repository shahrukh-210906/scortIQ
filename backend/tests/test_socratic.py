import unittest

from backend.app.content import CHAPTERS
from backend.app.language_support import RENDERINGS, language_support
from backend.app.socratic import CHECKPOINTS, PHASES, payload


class SocraticContentTests(unittest.TestCase):
    def test_language_support_is_limited_to_exact_retrieved_versioned_passages(self):
        topics = {topic["id"] for chapter in CHAPTERS for topic in chapter["topics"]}
        self.assertEqual(set(RENDERINGS["hi"]), topics)
        self.assertEqual(set(RENDERINGS["hinglish"]), topics)
        topic = CHAPTERS[1]["topics"][0]
        source = {"id": "pilot-light-reflection-v1:0", "excerpt": topic["explanation"]}
        self.assertIn("परावर्तन", language_support("light-reflection", "hi", [source]))
        self.assertIn("Reflection", language_support("light-reflection", "hinglish", [source]))
        self.assertEqual(language_support("light-reflection", "en", [source]), "")
        self.assertEqual(
            language_support("light-reflection", "hi", [{**source, "excerpt": "changed source"}]),
            "",
        )
        self.assertEqual(
            language_support("light-reflection", "hi", [{**source, "id": "reviewed-import:0"}]), ""
        )
        for language in RENDERINGS.values():
            self.assertTrue(all(len(passages) == 3 for passages in language.values()))

    def test_each_live_topic_has_four_valid_server_checked_questions(self):
        topics = {topic["id"] for chapter in CHAPTERS for topic in chapter["topics"]}
        self.assertEqual(set(CHECKPOINTS), topics)
        for topic in topics:
            self.assertEqual(len(CHECKPOINTS[topic]), len(PHASES))
            for question, options, expected, hint in CHECKPOINTS[topic]:
                self.assertTrue(question and hint)
                self.assertEqual(len(set(options)), 3)
                self.assertIn(expected, range(3))
                public = payload(None, topic)
                self.assertNotIn("answer", public)
                self.assertNotIn("expected", public)


if __name__ == "__main__":
    unittest.main()
