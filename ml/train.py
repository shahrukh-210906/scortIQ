"""Supervised LoRA training entry point. Requires reviewed, licensed data and a GPU."""

import argparse
import hashlib
import json
import sys
from pathlib import Path


def read_dataset(path: str, allow_unreviewed=False):
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
        if (
            not all(record[key] for key in ["id", "split_group", "source_id", "license"])
            or (record["reviewed"] is not True and not allow_unreviewed)
            or (record["reviewed"] is True and not record["reviewer"])
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
    # Support both `python ml/train.py` and importing the module for validation.
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from ml.benchmark import DEFAULT_SUITE, load_suite, validate_holdout

    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--revision", required=True, help="Pinned base model revision")
    parser.add_argument("--train", required=True, help="Reviewed JSONL dataset")
    parser.add_argument("--validation", required=True)
    parser.add_argument("--output", default="ml/output/scortiq-tutor")
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--benchmark", type=Path, default=DEFAULT_SUITE)
    parser.add_argument(
        "--experimental-unreviewed",
        action="store_true",
        help="Experimental local adapter only; never approved for deployment.",
    )
    parser.add_argument("--epochs", type=float, default=2)
    parser.add_argument("--max-length", type=int, default=2048)
    parser.add_argument("--max-steps", type=int, default=-1)
    parser.add_argument("--learning-rate", type=float, default=2e-4)
    parser.add_argument("--accumulation", type=int, default=16)
    parser.add_argument("--completion-only", action="store_true")
    parser.add_argument("--rank", type=int, default=8)
    parser.add_argument("--target-modules", default="all-linear")
    parser.add_argument("--no-thinking", action="store_true")
    parser.add_argument(
        "--vision-text",
        action="store_true",
        help="Text-only training through a multimodal causal model",
    )
    parser.add_argument("--target-regex", help="Optional exact PEFT module-name regex")
    args = parser.parse_args()
    if args.accumulation < 1 or not 0 < args.learning_rate < 1:
        parser.error("Use positive accumulation and learning-rate between 0 and 1.")
    if args.epochs <= 0 or args.max_length < 128 or args.max_steps == 0 or args.max_steps < -1:
        parser.error(
            "Use positive epochs, max-length >=128, and max-steps -1 or a positive integer."
        )
    train = read_dataset(args.train, args.experimental_unreviewed)
    validation = read_dataset(args.validation, args.experimental_unreviewed)
    benchmark, _ = load_suite(args.benchmark)
    validate_holdout(train + validation, benchmark)
    if {r["split_group"] for r in train} & {r["split_group"] for r in validation}:
        raise ValueError("Training and validation contain overlapping question/chapter groups.")
    if {r["id"] for r in train} & {r["id"] for r in validation}:
        raise ValueError("Training and validation IDs overlap.")
    print(f"Validated {len(train)} training examples and {len(validation)} validation examples.")
    if args.validate_only:
        return
    if Path(args.output).exists():
        raise ValueError(
            "Output already exists; preserve the previous adapter and use a new directory."
        )
    import torch
    from datasets import Dataset
    from peft import LoraConfig
    from transformers import (
        AutoModelForCausalLM,
        AutoModelForImageTextToText,
        AutoTokenizer,
        BitsAndBytesConfig,
    )
    from trl import SFTConfig, SFTTrainer

    if not torch.cuda.is_available():
        raise RuntimeError("This QLoRA training configuration requires a compatible CUDA GPU.")
    tokenizer = AutoTokenizer.from_pretrained(args.model, revision=args.revision)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    model_class = AutoModelForImageTextToText if args.vision_text else AutoModelForCausalLM
    model = model_class.from_pretrained(
        args.model,
        revision=args.revision,
        quantization_config=BitsAndBytesConfig(
            load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.bfloat16
        ),
        device_map={"": 0},
    )
    model.config.use_cache = False
    if args.completion_only:
        for row in train + validation:
            tokens = tokenizer.apply_chat_template(
                row["messages"],
                tokenize=True,
                **({"enable_thinking": False} if args.no_thinking else {}),
            )
            if len(tokens) > args.max_length:
                raise ValueError(f"Example {row['id']} would be truncated ({len(tokens)} tokens).")
    config = SFTConfig(
        output_dir=args.output,
        num_train_epochs=args.epochs,
        max_steps=args.max_steps,
        per_device_train_batch_size=1,
        per_device_eval_batch_size=1,
        gradient_accumulation_steps=args.accumulation,
        learning_rate=args.learning_rate,
        max_length=args.max_length,
        gradient_checkpointing=True,
        logging_steps=10,
        eval_strategy="epoch",
        save_strategy="epoch",
        report_to="none",
        seed=42,
        bf16=True,
        dataloader_num_workers=0,
        dataset_num_proc=1,
        gradient_checkpointing_kwargs={"use_reentrant": False},
        completion_only_loss=args.completion_only,
        save_total_limit=2,
    )
    trainer = SFTTrainer(
        model=model,
        processing_class=tokenizer,
        args=config,
        train_dataset=Dataset.from_list(
            [
                {
                    "prompt": r["messages"][:-1],
                    "completion": r["messages"][-1:],
                    **(
                        {"chat_template_kwargs": {"enable_thinking": False}}
                        if args.no_thinking
                        else {}
                    ),
                }
                if args.completion_only
                else {"messages": r["messages"]}
                for r in train
            ]
        ),
        eval_dataset=Dataset.from_list(
            [
                {
                    "prompt": r["messages"][:-1],
                    "completion": r["messages"][-1:],
                    **(
                        {"chat_template_kwargs": {"enable_thinking": False}}
                        if args.no_thinking
                        else {}
                    ),
                }
                if args.completion_only
                else {"messages": r["messages"]}
                for r in validation
            ]
        ),
        peft_config=LoraConfig(
            r=args.rank,
            lora_alpha=args.rank * 2,
            lora_dropout=0.05,
            target_modules=args.target_regex
            or (
                "all-linear"
                if args.target_modules == "all-linear"
                else args.target_modules.split(",")
            ),
            task_type="CAUSAL_LM",
        ),
    )
    baseline_metrics = trainer.evaluate()
    training_result = trainer.train()
    adapter_metrics = trainer.evaluate()
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
                "method": "QLoRA supervised fine-tuning; not reinforcement learning",
                "approved_for_app": False,
                "experimental_unreviewed": args.experimental_unreviewed,
                "train_sha256": hashlib.sha256(Path(args.train).read_bytes()).hexdigest(),
                "validation_sha256": hashlib.sha256(Path(args.validation).read_bytes()).hexdigest(),
                "baseline_validation": baseline_metrics,
                "adapter_validation": adapter_metrics,
                "training_metrics": training_result.metrics,
                "max_length": args.max_length,
                "epochs": args.epochs,
                "max_steps": args.max_steps,
                "completed_steps": trainer.state.global_step,
                "completed_epochs": trainer.state.epoch,
                "seed": config.seed,
                "learning_rate": args.learning_rate,
                "completion_only_loss": args.completion_only,
                "gradient_accumulation_steps": args.accumulation,
                "rank": args.rank,
                "target_modules": args.target_modules,
                "enable_thinking": not args.no_thinking,
                "vision_text": args.vision_text,
                "target_regex": args.target_regex,
                "gpu": torch.cuda.get_device_name(0),
            },
            indent=2,
        ),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
