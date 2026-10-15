# Local trained tutor

The connected development pilot uses **Gemma 3 4B**, with a text-only QLoRA adapter trained locally. No paid API is required. Run `./start-local-ai.ps1` from the project root, then start the usual backend and frontend.

The app controls four saved steps: problem, solution, topic, application. Every step requires an explanation and a correct comprehension check. Wrong answers keep the student on that step and require another explanation. These checks provide a limited comprehension signal, not proof of mastery.

## What produces the answers

Raw model tests still contained scientific errors after training. For the seven existing pilot topics, the app therefore assembles explanations from exact versioned lesson sources and authored English, Hindi and Hinglish renderings. The model helps order relevant sources. Reflection calculations use checked arithmetic. Chat labels disclose these responses as **From your lesson sources** or **Checked calculation**. Changed or unrelated material cannot reuse these renderings. This is a source-guided pilot, not a fully fine-tuned NCERT curriculum. Educator review remains pending.

Private student feedback adapts explanation-style selection separately. Student chats do not retrain model weights; the supervised adapter is not reinforcement learning.

## Runtime

Alias: `scortiq-socratic-gemma-v1`, llama.cpp b11640, loopback endpoint `127.0.0.1:11435`. The ignored backend environment contains `HF_ENDPOINT_URL`, `HF_MODEL_ID` and private `HF_TOKEN`, matching ignored `.tmp/local-tutor-token`. Never commit either secret file.

Artifacts: `.tmp/llama-runtime/llama-server.exe`, `ml/cache/gemma3-4b.gguf`, `ml/output/gemma-tutor-v1/adapter-f16.gguf`. Keep these local artifacts when moving the project; Git contains provenance and training code rather than large weights. The helper checks the expected alias and adapter at scale 1 before reusing a service.

Gemma uses `--no-jinja --chat-template gemma --no-prefill-assistant`, a 4096-token context and one request slot. The backend validates model JSON and citations; invalid responses return a retryable error. The optional `ml/serve.py` Python experiment is not the selected runtime.

Base GGUF SHA-256: `f06e91e18fc74295d0c781bf91622508c75655e2c18ed869d52447ffe1e667e1`.
Official llama.cpp CUDA archive SHA-256: `bc10674a5ff7b9049fd90517557b2d428f60b0b8fd2cd72e20165bc98ff4d1ac`.
CUDA runtime archive SHA-256: `8c79a9b226de4b3cacfd1f83d24f962d0773be79f1e7b75c6af4ded7e32ae1d6`.
Adapter converter source commit: `6e66cb5d4e9a2b4f02820a9f3053422b92ec4d51`.

## Training

Use the CUDA environment recorded in `evaluations/gemma-tutor-v1/environment.txt`. Prepare the pinned public dataset with `python -m ml.prepare_public_tutor`, then use `python -m ml.prepare_light_tutor --help` to create the compact Gemma subset. Attribution and split manifests accompany the data. No student conversations were used.

Selected model: `unsloth/gemma-3-4b-it-bnb-4bit`, revision `eb03c885bc2cc913fe792994bc766006f14ad72d`. Training arguments: 120 train/17 validation, max length 384, one epoch, learning rate 0.00001, accumulation 4, rank 4, target regex `(?:model\.)?language_model.*(q_proj|v_proj)`, completion-only, vision-text loader, explicit experimental-unreviewed flag. Vision weights remain frozen. Exact parameters and data hashes are in `evaluations/gemma-tutor-v1/training_metadata.json`.

Export with `python -m ml.export_adapter --adapter ml/output/NEW-RUN --base PATH_TO_CACHED_BASE_CONFIG`. Existing output artifacts are preserved rather than overwritten.

Model terms: [Gemma Terms](https://ai.google.dev/gemma/terms), [upstream model](https://huggingface.co/google/gemma-3-4b-it), [training mirror](https://huggingface.co/unsloth/gemma-3-4b-it-bnb-4bit). Public Dolly derivatives retain CC BY-SA 3.0 attribution; see `data/public-tutor-v1/ATTRIBUTION.md`. No model weights are redistributed in Git.

See [the result report](evaluations/gemma-tutor-v1/REPORT.md) for measurements and limitations.
