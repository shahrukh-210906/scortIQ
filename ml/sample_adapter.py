"""Offline qualitative comparison; writes raw samples, never a quality approval."""

import argparse
import json
from pathlib import Path


def main():
    import torch
    from peft import PeftModel
    from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

    parser = argparse.ArgumentParser()
    parser.add_argument("--adapter", required=True, type=Path)
    parser.add_argument("--validation", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    if args.output.exists():
        raise ValueError("Preserve prior samples; choose a new output file.")
    metadata = json.loads((args.adapter / "training_metadata.json").read_text())
    tokenizer = AutoTokenizer.from_pretrained(args.adapter, local_files_only=True)
    base = AutoModelForCausalLM.from_pretrained(
        metadata["base_model"],
        revision=metadata["revision"],
        local_files_only=True,
        device_map={"": 0},
        quantization_config=BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.bfloat16,
        ),
    )
    model = PeftModel.from_pretrained(base, args.adapter, local_files_only=True)
    model.eval()
    rows = [json.loads(line) for line in args.validation.read_text(encoding="utf-8").splitlines()]
    samples = []
    for row in rows[:3]:
        inputs = tokenizer.apply_chat_template(
            row["messages"][:-1], add_generation_prompt=True, return_tensors="pt", return_dict=True
        ).to(model.device)
        item = {"id": row["id"], "reference": row["messages"][-1]["content"]}
        for mode in ["base", "adapter"]:
            if mode == "base":
                with model.disable_adapter(), torch.inference_mode():
                    generated = model.generate(
                        **inputs,
                        max_new_tokens=180,
                        do_sample=False,
                        pad_token_id=tokenizer.eos_token_id,
                    )
            else:
                with torch.inference_mode():
                    generated = model.generate(
                        **inputs,
                        max_new_tokens=180,
                        do_sample=False,
                        pad_token_id=tokenizer.eos_token_id,
                    )
            item[mode] = tokenizer.decode(
                generated[0, inputs["input_ids"].shape[1] :], skip_special_tokens=True
            )
        samples.append(item)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(
            {"status": "unreviewed qualitative samples, not benchmark scores", "samples": samples},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
