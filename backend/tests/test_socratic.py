import unittest

from backend.app.content import CHAPTERS
from backend.app.socratic import CHECKPOINTS, PHASES, payload


class SocraticContentTests(unittest.TestCase):
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
