import unittest
from decimal import Decimal

from backend.app.content import CHAPTERS, topic_by_id
from backend.app.source_guidance import reflection_measurement, source_guidance


def sources(topic_id):
    _, topic = topic_by_id(topic_id)
    return [
        {"id": f"pilot-{topic_id}-v1:{index}", "excerpt": text}
        for index, text in enumerate(
            [topic["explanation"], topic["example"], topic["question"] + " " + topic["answer"]]
        )
    ]


class SourceGuidanceTests(unittest.TestCase):
    def test_geometry_handles_unseen_values_and_reference_lines(self):
        self.assertEqual(
            reflection_measurement("A ray makes 25 degrees with the mirror surface."),
            ("surface", Decimal(25)),
        )
        self.assertEqual(
            reflection_measurement("A ray arrives at 34.5° to the normal."),
            ("normal", Decimal("34.5")),
        )
        self.assertIsNone(reflection_measurement("What is reflection?"))
        self.assertIsNone(reflection_measurement("A ray makes 120 degrees with the surface."))
        for language in ["en", "hi", "hinglish"]:
            reply, cited, mode = source_guidance(
                "light-reflection",
                language,
                sources("light-reflection"),
                4,
                None,
                "A ray makes 25 degrees with the mirror surface.",
            )
            self.assertIn("65°", reply)
            self.assertIn("90°", reply)
            self.assertEqual(mode, "checked_calculation")
            self.assertEqual(len(cited), 1)

    def test_sources_are_required_and_steps_remain_bounded(self):
        evidence = sources("reactions-balance")
        first = source_guidance("reactions-balance", "hi", evidence, 0, None, "Explain")
        worked = source_guidance("reactions-balance", "hi", evidence, 1, None, "Explain")
        self.assertNotIn("2H₂ + O₂", first[0])
        self.assertIn("चार हाइड्रोजन परमाणु", worked[0])
        altered = [{**row, "excerpt": "Modified"} for row in evidence]
        self.assertIsNone(source_guidance("reactions-balance", "hi", altered, 1, None, "Explain"))
        self.assertIsNone(
            source_guidance("reactions-balance", "hi", evidence[:1], 1, None, "Explain")
        )

    def test_all_topics_and_languages_have_one_check_and_known_sources(self):
        for chapter in CHAPTERS:
            for topic in chapter["topics"]:
                for language in ["en", "hi", "hinglish"]:
                    for phase in range(5):
                        reply, cited, mode = source_guidance(
                            topic["id"],
                            language,
                            sources(topic["id"]),
                            phase,
                            "step_by_step",
                            "Explain",
                        )
                        self.assertEqual(reply.count("?"), 1)
                        self.assertEqual(mode, "source_guided")
                        self.assertTrue(cited)
                        self.assertTrue(all(row in sources(topic["id"]) for row in cited))


if __name__ == "__main__":
    unittest.main()
