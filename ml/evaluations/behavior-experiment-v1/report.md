# Local behavior fine-tuning experiment — 15 October 2026

Completed a real 12-update QLoRA supervised fine-tuning run on an RTX 4060 Laptop GPU (8 GB). This is an experimental adapter, not a trained NCERT curriculum or reinforcement learning of language-model weights.

- Base: `Qwen/Qwen2.5-1.5B-Instruct`, pinned revision `989aa7980e4cf806f80c7fef2b1adb7bc71aa306`.
- Data: 72 original synthetic arithmetic/format examples; 24 validation examples from separate double/half question families. Examples are explicitly unreviewed, contain no student conversations and do not overlap frozen benchmark IDs, families or exact questions.
- Configuration: 4-bit NF4 base, bfloat16 compute; all-linear LoRA rank 8, alpha 16, dropout 0.05; batch 1, accumulation 16, max length 384, learning rate 0.0002, seed 42, max steps 12 (actual 2.44 epochs), gradient checkpointing. Training took 98.35 seconds, excluding downloads and validation.
- Validation loss: base 3.088336 → adapter 1.223845. This is whole-sequence prediction loss on a tiny synthetic set; repeated prompt/evidence tokens contribute. It is not factual accuracy or evidence of improved student learning.
- Local adapter: `ml/output/behavior-experiment-v1/adapter_model.safetensors`; weights and downloaded base remain ignored rather than pushed to GitHub. Reproducible code, data, package versions, metadata and samples are tracked.

## Qualitative result and deployment decision

The three deterministic validation samples in `samples.json` use the same arithmetic question in English, Hindi and Hinglish. The base returned prose rather than requested JSON. The adapter returned valid JSON with the supplied citation, but all three replies were English and omitted the requested guiding question. The Hindi/Hinglish instruction-following problem remains. These three examples are inspection samples, not an independent factual benchmark.

**Do not deploy this adapter.** The live app continues using its configured Llama model. Next: educator-reviewed, licensed Class 10 examples with explicit multilingual instructions, broader independent factual evaluation, then evaluation of the actual serving artifact. No shared-model update consumes student feedback automatically.

## Reproduce

Use Python 3.12 and a separate `.venv-ml`; install `torch==2.7.1` from the official CUDA 12.8 PyTorch index, then `ml/requirements-local.lock.txt`. Actual package versions are in `environment.txt`. Set `HF_HOME` to `ml/cache` and `HF_HUB_DISABLE_XET=1` for this workspace.

```text
python -m ml.make_behavior_data
python ml/train.py --model Qwen/Qwen2.5-1.5B-Instruct --revision 989aa7980e4cf806f80c7fef2b1adb7bc71aa306 --train ml/data/behavior-experiment-v1/train.jsonl --validation ml/data/behavior-experiment-v1/validation.jsonl --experimental-unreviewed --max-length 384 --max-steps 12 --output ml/output/NEW-RUN
python ml/sample_adapter.py --adapter ml/output/NEW-RUN --validation ml/data/behavior-experiment-v1/validation.jsonl --output ml/evaluations/NEW-RUN/samples.json
```

Default training still requires reviewed records; the explicit experimental flag permits only clearly labelled local experiments. Re-runs require new output directories. CUDA kernels and environment differences can prevent bit-for-bit reproducibility.
