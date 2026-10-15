"""Frozen draft teaching benchmark; runs the real app against local Ollama only."""

import argparse
import csv
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SUITE = ROOT / "ml/benchmarks/class10-pilot-v1.json"


def load_suite(path=DEFAULT_SUITE):
    path = Path(path)
    raw = path.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if digest != path.with_suffix(".sha256").read_text().strip():
        raise ValueError("Benchmark checksum mismatch. Create a new version instead of editing v1.")
    suite = json.loads(raw)
    ids = set()
    coverage = Counter()
    for case in suite["cases"]:
        if case["id"] in ids or case["language"] not in {"en", "hi", "hinglish"}:
            raise ValueError("Duplicate case or invalid language.")
        if (
            case["topic_id"] not in suite["corpus"]
            or not case["expected_facts"]
            or not case["question"].strip()
        ):
            raise ValueError("Incomplete benchmark case.")
        ids.add(case["id"])
        coverage[(case["topic_id"], case["language"])] += 1
    if (
        len(suite["corpus"]) != 7
        or len(coverage) != 21
        or any(value != 2 for value in coverage.values())
    ):
        raise ValueError("Expected two cases per topic/language across seven topics.")
    return suite, digest


def automatic_checks(reply, sources, allowed_ids, language):
    """Mechanical indicators only; never a factual score or a fluency grade."""
    letters = [char for char in reply if char.isalpha()]
    devanagari = sum("\u0900" <= char <= "\u097f" for char in letters)
    ratio = devanagari / max(1, len(letters))
    hindi_words = set(
        re.findall(
            r"\b(?:hai|hain|nahi|kyun|kyunki|kaise|kya|hota|hoti|banta|karna|karo|samjho|aap|tum|yeh|mein)\b",
            reply.lower(),
        )
    )
    language_signal = (
        ratio >= 0.25
        if language == "hi"
        else ratio < 0.1 and (len(hindi_words) >= 2 if language == "hinglish" else not hindi_words)
    )
    return {
        "citation_ids_valid": bool(sources) and set(sources).issubset(allowed_ids),
        "language_signal": language_signal,
        "one_question_mark": reply.count("?") + reply.count("？") == 1,
        "devanagari_letter_ratio": round(ratio, 3),
        "roman_hindi_markers": sorted(hindi_words),
    }


def validate_holdout(records, suite):
    case_ids = {case["id"] for case in suite["cases"]}
    groups = {case["split_group"] for case in suite["cases"]}

    def normalize(text):
        return " ".join(text.lower().split())

    questions = {normalize(case["question"]) for case in suite["cases"]}
    for record in records:
        if record["id"] in case_ids or record["split_group"] in groups:
            raise ValueError(
                "Training data overlaps the frozen benchmark IDs or question families."
            )
        if any(
            normalize(message["content"]) in questions
            for message in record["messages"]
            if message["role"] == "user"
        ):
            raise ValueError("Training data contains a frozen benchmark question.")


def write_reports(output, metadata, results):
    output.mkdir(parents=True, exist_ok=True)
    expected = metadata.get("expected_cases", len(results))
    payload = {
        "metadata": metadata,
        "progress": {
            "completed": len(results),
            "expected": expected,
            "complete": len(results) == expected,
        },
        "results": results,
    }
    (output / "results.json").write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    with (output / "human-review.csv").open("w", encoding="utf-8-sig", newline="") as stream:
        writer = csv.writer(stream)
        writer.writerow(
            [
                "case_id",
                "language",
                "question",
                "expected_facts",
                "reply",
                "factual_0_2",
                "language_0_2",
                "teaching_0_2",
                "citation_support_0_2",
                "reviewer",
                "notes",
            ]
        )
        for result in results:
            values = [
                result["id"],
                result["language"],
                result["question"],
                " | ".join(result["expected_facts"]),
                result.get("reply", ""),
                "",
                "",
                "",
                "",
                "",
                "",
            ]
            # Model text is untrusted when the CSV is opened in a spreadsheet.
            writer.writerow(
                [
                    "'" + value
                    if isinstance(value, str)
                    and value.startswith(("=", "+", "-", "@", "\t", "\r", "\n"))
                    else value
                    for value in values
                ]
            )
    accepted = sum(row["status"] == 200 for row in results)
    lines = [
        "# Draft local teaching benchmark",
        "",
        f"Run: {metadata['started_utc']}",
        f"Model: `{metadata['model']}`",
        f"Suite SHA-256: `{metadata['suite_sha256']}`",
        f"Completed case requests: {len(results)}/{expected}.",
        "",
        f"App accepted {accepted}/{len(results)} replies. Factual grades: **not assessed; human review pending**.",
        "",
        "Mechanical flags are review aids, not correctness or fluency scores. One run is stochastic; repeat before comparing models.",
        "",
        "| Language | Accepted | Language signal | One question mark |",
        "|---|---:|---:|---:|",
    ]
    for language in ["en", "hi", "hinglish"]:
        rows = [row for row in results if row["language"] == language]
        lines.append(
            f"| {language} | {sum(row['status'] == 200 for row in rows)}/{len(rows)} | {sum(row.get('checks', {}).get('language_signal', False) for row in rows)} | {sum(row.get('checks', {}).get('one_question_mark', False) for row in rows)} |"
        )
    lines += ["", "## Replies for review", ""]
    for row in results:
        lines += [
            f"### {row['id']}",
            row["question"],
            "",
            "Expected: " + "; ".join(row["expected_facts"]),
            "",
            "Reply (untrusted model output):",
            "",
            "```text",
            row.get("reply", row.get("error", "No reply")).replace("```", "[code fence]"),
            "```",
            "",
        ]
    (output / "report.md").write_text("\n".join(lines), encoding="utf-8")


def main():
    sys.path.insert(0, str(ROOT))
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--suite", type=Path, default=DEFAULT_SUITE)
    parser.add_argument("--model", default="llama3.1:latest")
    parser.add_argument("--runtime", choices=["ollama", "llama-cpp"], default="ollama")
    parser.add_argument("--adapter-scale", type=float, choices=[0.0, 1.0])
    parser.add_argument("--label", help="Candidate label, separate from the provider's model alias")
    parser.add_argument(
        "--artifact", type=Path, help="Local evaluated artifact for SHA-256 identity"
    )
    parser.add_argument("--endpoint", default="http://127.0.0.1:11434")
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument(
        "--token-file", type=Path, help="Private local provider token; never saved in results"
    )
    parser.add_argument(
        "--complete-guided",
        action="store_true",
        help="Evaluate final follow-up answers after all four guided checks",
    )
    args = parser.parse_args()
    suite, digest = load_suite(args.suite)
    from backend.app.content import CHAPTERS

    corpus = {
        topic["id"]: [
            topic["explanation"],
            topic["example"],
            topic["question"] + " " + topic["answer"],
        ]
        for chapter in CHAPTERS
        for topic in chapter["topics"]
    }
    if corpus != suite["corpus"]:
        raise ValueError("Pilot source text changed. Create a new benchmark corpus version.")
    if args.validate_only:
        print(
            f"Validated {len(suite['cases'])} draft cases, seven topics, three languages. SHA-256 {digest}"
        )
        return
    parsed = urlparse(args.endpoint)
    if (
        parsed.scheme != "http"
        or parsed.hostname not in {"127.0.0.1", "localhost", "::1"}
        or parsed.username
        or parsed.password
        or parsed.path not in {"", "/"}
        or parsed.query
        or parsed.fragment
    ):
        raise ValueError("This runner permits only a loopback HTTP Ollama server.")
    if args.output.exists():
        raise ValueError(
            "Output already exists; choose a new directory to preserve the previous run."
        )
    import httpx

    endpoint = args.endpoint.rstrip("/")
    token = args.token_file.read_text().strip() if args.token_file else "local-ollama"
    with httpx.Client(
        timeout=180, trust_env=False, headers={"Authorization": "Bearer " + token}
    ) as provider:
        if args.runtime == "ollama":
            version = provider.get(endpoint + "/api/version")
            version.raise_for_status()
            runtime_settings = version.json()
            tags = provider.get(endpoint + "/api/tags")
            tags.raise_for_status()
            model = next(
                (item for item in tags.json()["models"] if item["name"] == args.model), None
            )
            if not model:
                raise ValueError("Model is not installed. This runner will not download one.")
            print("Warming the installed model…", flush=True)
            warm = provider.post(
                endpoint + "/api/generate",
                json={
                    "model": args.model,
                    "prompt": "Hello",
                    "stream": False,
                    "options": {"num_predict": 1},
                },
            )
        else:
            provider.get(endpoint + "/health").raise_for_status()
            if args.adapter_scale is not None:
                provider.post(
                    endpoint + "/lora-adapters", json=[{"id": 0, "scale": args.adapter_scale}]
                ).raise_for_status()
            settings = provider.get(endpoint + "/props")
            settings.raise_for_status()
            adapters = provider.get(endpoint + "/lora-adapters")
            adapters.raise_for_status()
            runtime_settings = {
                "version": "llama.cpp-b11640",
                "props": settings.json(),
                "adapters": adapters.json(),
            }
            if not args.artifact:
                raise ValueError("Specify the evaluated GGUF artifact for reproducible identity.")
            with args.artifact.open("rb") as stream:
                model = {"digest": hashlib.file_digest(stream, "sha256").hexdigest()}
            print("Warming the local GGUF model…", flush=True)
            warm = provider.post(
                endpoint + "/v1/chat/completions",
                json={
                    "model": args.model,
                    "messages": [{"role": "user", "content": "Hello"}],
                    "max_tokens": 1,
                    "temperature": 0,
                },
            )
        warm.raise_for_status()
    metadata = {
        "started_utc": datetime.now(timezone.utc).isoformat(),
        "model": args.label or args.model,
        "provider_model_alias": args.model,
        "model_digest": model["digest"],
        "runtime_version": runtime_settings["version"],
        "runtime_settings": runtime_settings,
        "suite_sha256": digest,
        "suite_version": suite["version"],
        "expected_cases": len(suite["cases"]),
        "runner_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
        "review_status": "draft; human review pending",
        "temperature": 0.3,
        "max_tokens": 600,
        "guided_phase": "completed-follow-up" if args.complete_guided else "initial-problem",
        "app_source_sha256": hashlib.sha256(
            (ROOT / "backend/app/main.py").read_bytes()
        ).hexdigest(),
        "language_support_sha256": hashlib.sha256(
            (ROOT / "backend/app/language_support.py").read_bytes()
        ).hexdigest(),
        "source_guidance_sha256": hashlib.sha256(
            (ROOT / "backend/app/source_guidance.py").read_bytes()
        ).hexdigest(),
        "git_commit": subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=ROOT, text=True
        ).strip(),
    }
    scratch = ROOT / ".tmp"
    scratch.mkdir(exist_ok=True)
    results = []
    with tempfile.TemporaryDirectory(prefix="benchmark-", dir=scratch) as temporary:
        os.environ.update(
            APP_ENV="test",
            DATABASE_URL="sqlite:///" + str(Path(temporary) / "benchmark.db").replace("\\", "/"),
            HF_ENDPOINT_URL=endpoint,
            HF_TOKEN=token,
            HF_MODEL_ID=args.model,
            SUPABASE_URL="",
            SUPABASE_PUBLISHABLE_KEY="",
        )
        from fastapi.testclient import TestClient

        from backend.app import main as application
        from backend.app.database import SessionLocal, SocraticState, engine
        from backend.app.grounding import retrieve

        try:
            with TestClient(application.app) as client:
                for index, case in enumerate(suite["cases"], 1):
                    client.cookies.clear()
                    client.post(
                        "/api/auth/local",
                        json={"name": "Benchmark learner", "teaching_language": case["language"]},
                    ).raise_for_status()
                    lesson = client.post(f"/api/lessons/{case['topic_id']}")
                    lesson.raise_for_status()
                    with SessionLocal() as db:
                        if args.complete_guided:
                            db.add(
                                SocraticState(
                                    lesson_id=lesson.json()["id"], phase=4, taught_phase=-1
                                )
                            )
                            db.commit()
                        evidence = retrieve(db, case["topic_id"], case["question"])
                    started = time.monotonic()
                    response = client.post(
                        f"/api/lessons/{lesson.json()['id']}/turn",
                        json={"message": case["question"]},
                    )
                    result = {
                        **case,
                        "status": response.status_code,
                        "seconds": round(time.monotonic() - started, 2),
                        "retrieved_evidence": evidence,
                        "human_review": None,
                    }
                    if response.status_code == 200:
                        body = response.json()
                        result.update(
                            reply=body["reply"],
                            citations=[source["id"] for source in body["sources"]],
                            response_mode=body["messages"][-1].get("response_mode", "model"),
                        )
                        result["checks"] = automatic_checks(
                            body["reply"],
                            result["citations"],
                            {source["id"] for source in evidence},
                            case["language"],
                        )
                    else:
                        result["error"] = str(response.json().get("detail", "Request failed"))
                    results.append(result)
                    write_reports(args.output, metadata, results)
                    print(
                        f"{index}/{len(suite['cases'])} {case['id']}: HTTP {response.status_code}",
                        flush=True,
                    )
        finally:
            engine.dispose()
    print(
        f"Saved {len(results)} replies and blank human-review sheets to {args.output}", flush=True
    )


if __name__ == "__main__":
    main()
