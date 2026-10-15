"""Prepare an allowlisted private Space; publish only with explicit --publish."""

import argparse
import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = (
    "adapter_config.json",
    "adapter_model.safetensors",
    "tokenizer.json",
    "tokenizer_config.json",
    "special_tokens_map.json",
    "chat_template.jinja",
    "training_metadata.json",
)


def prepare(output):
    adapter = ROOT / "ml/output/gemma-tutor-v1"
    metadata = json.loads((adapter / "training_metadata.json").read_text())
    if metadata["revision"] != "eb03c885bc2cc913fe792994bc766006f14ad72d":
        raise ValueError("Unexpected trained model revision")
    output.mkdir(parents=True, exist_ok=False)
    (output / "adapter").mkdir()
    for name in ("app.py", "requirements.txt", "README.md"):
        shutil.copyfile(ROOT / "deploy/huggingface" / name, output / name)
    hashes = {}
    for name in FILES:
        source = adapter / name
        shutil.copyfile(source, output / "adapter" / name)
        hashes[name] = hashlib.sha256(source.read_bytes()).hexdigest()
    shutil.copyfile(ROOT / "ml/data/public-tutor-v1/ATTRIBUTION.md", output / "DATA_ATTRIBUTION.md")
    (output / "artifact_hashes.json").write_text(json.dumps(hashes, indent=2) + "\n")
    return output


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT / ".tmp/hf-space")
    parser.add_argument("--repo", help="Your exact username/Space name")
    parser.add_argument("--publish", action="store_true")
    args = parser.parse_args()
    output = prepare(args.output)
    print(f"Prepared allowlisted model deployment in {output}")
    if not args.publish:
        return
    if not args.repo or args.repo.count("/") != 1:
        raise ValueError("Provide --repo USERNAME/SPACE-NAME")
    from huggingface_hub import HfApi, get_token

    if not get_token():
        raise RuntimeError("Sign in locally using hf auth login; do not paste tokens into chat.")
    api = HfApi()
    username = api.whoami()["name"]
    if args.repo.split("/")[0] != username:
        raise ValueError("Publish only into your authenticated personal account")
    # No updates to existing Spaces, no paid hardware fallback, no public upload.
    api.create_repo(
        args.repo,
        repo_type="space",
        private=True,
        space_sdk="gradio",
        space_hardware="zero-a10g",
        exist_ok=False,
    )
    api.upload_folder(repo_id=args.repo, repo_type="space", folder_path=output)
    print(f"Uploaded private candidate: https://huggingface.co/spaces/{args.repo}")
    print("Wait for build and GPU smoke validation before changing the live backend endpoint.")


if __name__ == "__main__":
    main()
