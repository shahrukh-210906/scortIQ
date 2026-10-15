"""Export floating-point LoRA tensors using pinned llama.cpp and architecture-only metadata."""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--adapter", required=True, type=Path)
    parser.add_argument("--base", required=True, type=Path)
    parser.add_argument(
        "--converter", type=Path, default=Path(".tmp/llama.cpp/convert_lora_to_gguf.py")
    )
    args = parser.parse_args()
    output = args.adapter / "adapter-f16.gguf"
    if output.exists():
        raise ValueError("Preserve the existing export; use a new adapter directory.")
    config = json.loads((args.base / "config.json").read_text(encoding="utf-8"))
    # The adapter is floating-point. Base quantization metadata must not make the
    # converter attempt to dequantize these tensors. Base checkpoint stays unchanged.
    config.pop("quantization_config", None)
    if "text_config" in config:
        config["text_config"].pop("quantization_config", None)
    scratch = Path(".tmp") / (args.adapter.name + "-lora-export-config")
    scratch.mkdir(parents=True, exist_ok=True)
    (scratch / "config.json").write_text(json.dumps(config, indent=2), encoding="utf-8")
    subprocess.run(
        [
            sys.executable,
            str(args.converter),
            "--base",
            str(scratch),
            "--outtype",
            "f16",
            "--outfile",
            str(output),
            str(args.adapter),
        ],
        check=True,
    )


if __name__ == "__main__":
    main()
