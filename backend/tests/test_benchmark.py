import io
import json
import tempfile
import unittest
from contextlib import redirect_stdout
from pathlib import Path
from unittest.mock import patch

from ml.benchmark import (
    DEFAULT_SUITE,
    automatic_checks,
    load_suite,
    validate_holdout,
    write_reports,
)


class BenchmarkTests(unittest.TestCase):
    def test_behavior_experiment_requires_explicit_unreviewed_opt_in(self):
        from ml.train import read_dataset

        root = Path(__file__).resolve().parents[2] / "ml/data/behavior-experiment-v1"
        with self.assertRaisesRegex(ValueError, "review and provenance"):
            read_dataset(str(root / "train.jsonl"))
        train = read_dataset(str(root / "train.jsonl"), allow_unreviewed=True)
        validation = read_dataset(str(root / "validation.jsonl"), allow_unreviewed=True)
        self.assertEqual((len(train), len(validation)), (72, 24))
        self.assertFalse({r["split_group"] for r in train} & {r["split_group"] for r in validation})
        self.assertTrue(all(row["reviewed"] is False for row in train + validation))
        suite, _ = load_suite()
        validate_holdout(train + validation, suite)

    def test_frozen_coverage_and_tamper_detection(self):
        suite, digest = load_suite()
        self.assertEqual(len(suite["cases"]), 42)
        self.assertEqual(len(digest), 64)
        self.assertIsNone(suite["reviewer"])
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "suite.json"
            path.write_bytes(DEFAULT_SUITE.read_bytes() + b" ")
            path.with_suffix(".sha256").write_text(digest)
            with self.assertRaisesRegex(ValueError, "checksum"):
                load_suite(path)

    def test_mechanical_flags_never_claim_factual_grades(self):
        checks = automatic_checks("The angle is 20 degrees. Why?", ["p:1"], {"p:1"}, "en")
        self.assertTrue(checks["citation_ids_valid"])
        self.assertTrue(checks["one_question_mark"])
        self.assertNotIn("factual_score", checks)
        self.assertFalse(
            automatic_checks("An answer", ["invented"], {"p:1"}, "en")["citation_ids_valid"]
        )
        self.assertFalse(
            automatic_checks("An English answer?", ["p:1"], {"p:1"}, "hi")["language_signal"]
        )
        self.assertTrue(
            automatic_checks("बर्फ पिघलने पर नया पदार्थ नहीं बनता। क्यों?", ["p:1"], {"p:1"}, "hi")[
                "language_signal"
            ]
        )
        self.assertTrue(
            automatic_checks("Kya yeh sahi hai?", ["p:1"], {"p:1"}, "hinglish")["language_signal"]
        )
        self.assertFalse(automatic_checks("Why? How?", ["p:1"], {"p:1"}, "en")["one_question_mark"])

    def test_holdout_guard_blocks_ids_families_and_exact_questions(self):
        suite, _ = load_suite()
        case = suite["cases"][0]
        safe = {
            "id": "training-example",
            "split_group": "separate-family",
            "messages": [{"role": "user", "content": "A different teaching question"}],
        }
        validate_holdout([safe], suite)
        for record in [
            {**safe, "id": case["id"]},
            {**safe, "split_group": case["split_group"]},
            {**safe, "messages": [{"role": "user", "content": case["question"].upper()}]},
        ]:
            with self.assertRaises(ValueError):
                validate_holdout([record], suite)

    def test_report_keeps_human_review_empty_and_failed_requests_visible(self):
        suite, digest = load_suite()
        case = suite["cases"][0]
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            write_reports(
                output,
                {"started_utc": "test", "model": "local", "suite_sha256": digest},
                [
                    {**case, "status": 503, "error": "Unavailable", "human_review": None},
                    {
                        **case,
                        "id": "formula-output",
                        "status": 200,
                        "reply": "=1+1",
                        "human_review": None,
                    },
                ],
            )
            payload = json.loads((output / "results.json").read_text())
            self.assertIsNone(payload["results"][0]["human_review"])
            self.assertIn("human review pending", (output / "report.md").read_text())
            self.assertIn("Unavailable", (output / "report.md").read_text())
            self.assertIn(
                "factual_0_2", (output / "human-review.csv").read_text(encoding="utf-8-sig")
            )
            self.assertIn("'=1+1", (output / "human-review.csv").read_text(encoding="utf-8-sig"))
            self.assertEqual(payload["results"][1]["reply"], "=1+1")

    def test_training_entry_point_enforces_benchmark_without_loading_gpu(self):
        from ml.train import main

        suite, _ = load_suite()
        record = {
            "id": "fixture-training",
            "split_group": suite["cases"][0]["split_group"],
            "source_id": "test-fixture",
            "license": "Original test fixture",
            "reviewer": "Test fixture",
            "reviewed": True,
            "messages": [
                {"role": "user", "content": "A separate synthetic example"},
                {"role": "assistant", "content": "A synthetic response"},
            ],
        }
        with tempfile.TemporaryDirectory() as directory:
            train = Path(directory) / "train.jsonl"
            validation = Path(directory) / "validation.jsonl"
            train.write_text(json.dumps(record) + "\n")
            validation.write_text(
                json.dumps(
                    {**record, "id": "fixture-validation", "split_group": "independent-validation"}
                )
                + "\n"
            )
            args = [
                "train.py",
                "--model",
                "test-only",
                "--revision",
                "test-only",
                "--train",
                str(train),
                "--validation",
                str(validation),
                "--validate-only",
            ]
            with patch("sys.argv", args), self.assertRaisesRegex(ValueError, "benchmark"):
                main()
            train.write_text(json.dumps({**record, "split_group": "independent-training"}) + "\n")
            output = io.StringIO()
            with patch("sys.argv", args), redirect_stdout(output):
                main()
            self.assertIn(
                "Validated 1 training examples and 1 validation examples", output.getvalue()
            )


if __name__ == "__main__":
    unittest.main()
