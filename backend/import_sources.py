"""Import a validated JSONL source file. Changes are committed atomically."""

import argparse
from pathlib import Path

from backend.app.database import SessionLocal
from backend.app.grounding import SourceImport, import_source


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("path", help="UTF-8 JSONL source records")
    args = parser.parse_args()
    text = Path(args.path).read_text(encoding="utf-8")
    if len(text) > 5_000_000:
        raise ValueError("Split source batches into files smaller than 5 MB.")
    sources = [SourceImport.model_validate_json(line) for line in text.splitlines() if line.strip()]
    if not sources:
        raise ValueError("No sources found.")
    with SessionLocal.begin() as db:
        for source in sources:
            import_source(db, source)
    print(f"Imported {len(sources)} versioned source records.")


if __name__ == "__main__":
    main()
