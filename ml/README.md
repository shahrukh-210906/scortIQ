# ScortIQ tutor training

Training has not been run. No trained weights or production dataset exist yet. Do not publish the seed application notes as reviewed training data.

1. Confirm a base model's license and benchmark its language and science performance.
2. Produce teacher-reviewed, licensed multi-turn tutoring examples. Include misconceptions, graduated hints, valid JSON replies, and uncertainty responses.
3. Create separate training/validation/test JSONL files split by chapter or question family. Keep test data out of both training and model-selection validation.
4. Each record needs `id`, `split_group`, `source_id`, `license`, `reviewer`, `reviewed: true` and `messages` with `{role, content}` entries. A metadata string does not itself prove rights: conduct the rights review separately.
5. Validate first: `python ml/train.py --model MODEL_ID --revision COMMIT_SHA --train TRAIN.jsonl --validation VALIDATION.jsonl --validate-only`.
6. On a compatible CUDA machine, install `ml/requirements.txt`, pin the tested ML environment, and run the same command without `--validate-only`. Review memory use and bfloat16 support before starting. The configuration is an initial experiment, not validated for every base model.
7. Compare base+grounding against fine-tuned+grounding using the frozen test benchmark and educator rubrics. Check factual correctness, language quality, tutoring behavior, answer leakage and output structure. Evaluate the deployed/quantized artifact too.
8. Publish approved adapters or merged weights to a private Hugging Face repository with provenance, license and model card. Select a serving runtime supporting the model and `/v1/chat/completions` with JSON response formatting.
9. Configure the backend's `HF_ENDPOINT_URL`, `HF_TOKEN` and `HF_MODEL_ID`. Test in staging and keep the last approved release available for rollback.

Current application grounding retrieves versioned, topic-scoped passages using lexical ranking. Imported records require rights and review metadata; production excludes draft sources. Model replies must cite retrieved passage IDs. Identity validation does not prove a citation supports every factual claim. A reviewed textbook corpus, semantic/hybrid retrieval, factual-support evaluation, Hindi/Hinglish evaluation and a reproducible model benchmark remain required.
