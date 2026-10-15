"""Small balanced style-tuning subset, preserving the larger model's pretrained abilities."""

import argparse
import json
import random
from collections import Counter
from pathlib import Path

MODEL = "unsloth/Qwen3-8B-bnb-4bit"
REVISION = "1deaf68f694c40dbce295da300851729d759b21a"


def main():
    from transformers import AutoTokenizer

    from ml.prepare_public_tutor import LANGUAGES

    parser = argparse.ArgumentParser()
    parser.add_argument("--model", default=MODEL)
    parser.add_argument("--revision", default=REVISION)
    parser.add_argument("--output", default="ml/data/light-tutor-v1")
    args = parser.parse_args()
    tokenizer = AutoTokenizer.from_pretrained(
        args.model, revision=args.revision, local_files_only=True
    )
    source = Path("ml/data/public-tutor-v1")
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    counts = {}
    for split, maximum in [("train", 40), ("validation", 6)]:
        rows = [
            json.loads(line)
            for line in (source / (split + ".jsonl")).read_text(encoding="utf-8").splitlines()
        ]
        random.Random(71).shuffle(rows)
        selected, languages = [], Counter()
        for row in rows:
            lang = row["language"]
            if languages[lang] >= maximum:
                continue
            original = row["messages"][0]["content"]
            evidence = original.split(" Evidence: ", 1)[1]
            phase = row["id"].rsplit("-", 1)[1]
            row["messages"][0]["content"] = (
                "You are ScortIQ, a Class 10 tutor. Explain the current step clearly, then ask one meaningful understanding-check question. "
                "Do not move to another step when the student is confused. Do not repeat sentences or claim mastery. "
                "Use only the evidence. Return only JSON with reply and citations (supporting evidence IDs). "
                + LANGUAGES[lang]
                + f" Current step: {phase}. Evidence: "
                + evidence
            )
            if (
                len(
                    tokenizer.apply_chat_template(
                        row["messages"], tokenize=True, enable_thinking=False
                    )
                )
                > 384
            ):
                continue
            row["id"] = "light-" + row["id"]
            selected.append(row)
            languages[lang] += 1
        (output / (split + ".jsonl")).write_text(
            "".join(json.dumps(row, ensure_ascii=False) + "\n" for row in selected),
            encoding="utf-8",
        )
        counts[split] = {"total": len(selected), "languages": dict(languages)}
    (output / "manifest.json").write_text(
        json.dumps(
            {
                "model": args.model,
                "model_revision": args.revision,
                "counts": counts,
                "source": "../public-tutor-v1",
                "seed": 71,
                "max_tokens": 384,
                "status": "unreviewed experimental light style tuning; not educator approval",
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    (output / "ATTRIBUTION.md").write_text(
        "This is a further subset of ../public-tutor-v1. Its full ATTRIBUTION.md and per-row licenses apply: public Dolly/AI4Bharat derivatives CC BY-SA 3.0, original ScortIQ dialogues CC0 1.0. Changes: shorter system instructions, balanced language counts and length filtering. No student data. See ../public-tutor-v1/ATTRIBUTION.md for source credits and caveats.\n",
        encoding="utf-8",
    )
    print(json.dumps(counts, indent=2))


if __name__ == "__main__":
    main()
