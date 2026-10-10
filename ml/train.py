"""Supervised LoRA training entry point. Requires reviewed, licensed data and a GPU."""

import argparse
import json
from pathlib import Path


def read_dataset(path: str):
    records = [
        json.loads(line)
        for line in Path(path).read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    if not records:
        raise ValueError("Dataset is empty.")
    ids = set()
    for record in records:
        for key in [
            "id",
            "split_group",
            "messages",
            "source_id",
            "license",
            "reviewer",
            "reviewed",
        ]:
            if key not in record:
                raise ValueError(f"Missing required field: {key}")
        if record["reviewed"] is not True or not all(
            record[key] for key in ["id", "split_group", "source_id", "license", "reviewer"]
        ):
            raise ValueError("Every record must have review and provenance metadata.")
        if record["id"] in ids:
            raise ValueError("Duplicate example ID.")
        ids.add(record["id"])
        messages = record["messages"]
        if (
            not isinstance(messages, list)
            or not messages
            or messages[-1].get("role") != "assistant"
        ):
            raise ValueError("Training conversations must end with an assistant response.")
        for message in messages:
            if (
                message.get("role") not in ["system", "user", "assistant"]
                or not isinstance(message.get("content"), str)
                or not message["content"].strip()
            ):
                raise ValueError("Invalid chat message.")
    return records


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--revision", required=True, help="Pinned base model revision")
    parser.add_argument("--train", required=True, help="Reviewed JSONL dataset")
    parser.add_argument("--validation", required=True)
    parser.add_argument("--output", default="ml/output/scortiq-tutor")
    parser.add_argument("--validate-only", action="store_true")
    args = parser.parse_args()
    train = read_dataset(args.train)
    validation = read_dataset(args.validation)
    if {r["split_group"] for r in train} & {r["split_group"] for r in validation}:
        raise ValueError("Training and validation contain overlapping question/chapter groups.")
    if {r["id"] for r in train} & {r["id"] for r in validation}:
        raise ValueError("Training and validation IDs overlap.")
    print(f"Validated {len(train)} training examples and {len(validation)} validation examples.")
    if args.validate_only:
        return
    import torch
    from datasets import Dataset
    from peft import LoraConfig
    from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
    from trl import SFTConfig, SFTTrainer

    if not torch.cuda.is_available():
        raise RuntimeError("This QLoRA training configuration requires a compatible CUDA GPU.")
    tokenizer = AutoTokenizer.from_pretrained(args.model, revision=args.revision)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    model = AutoModelForCausalLM.from_pretrained(
        args.model,
        revision=args.revision,
        quantization_config=BitsAndBytesConfig(
            load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.bfloat16
        ),
        device_map={"": 0},
    )
    config = SFTConfig(
        output_dir=args.output,
        num_train_epochs=2,
        per_device_train_batch_size=1,
        gradient_accumulation_steps=16,
        learning_rate=2e-4,
        max_length=2048,
        gradient_checkpointing=True,
        logging_steps=10,
        eval_strategy="epoch",
        save_strategy="epoch",
        report_to="none",
        seed=42,
        bf16=True,
    )
    trainer = SFTTrainer(
        model=model,
        processing_class=tokenizer,
        args=config,
        train_dataset=Dataset.from_list([{"messages": r["messages"]} for r in train]),
        eval_dataset=Dataset.from_list([{"messages": r["messages"]} for r in validation]),
        peft_config=LoraConfig(
            r=16,
            lora_alpha=32,
            lora_dropout=0.05,
            target_modules="all-linear",
            task_type="CAUSAL_LM",
        ),
    )
    trainer.train()
    trainer.save_model(args.output)
    tokenizer.save_pretrained(args.output)
    Path(args.output, "training_metadata.json").write_text(
        json.dumps(
            {
                "base_model": args.model,
                "revision": args.revision,
                "train_count": len(train),
                "validation_count": len(validation),
                "status": "requires independent evaluation",
            },
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
