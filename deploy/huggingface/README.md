---
title: ScortIQ private tutor pilot
emoji: 📚
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 5.49.1
python_version: '3.10'
app_file: app.py
suggested_hardware: zero-a10g
---

Experimental Gemma 3 4B text-only QLoRA adapter trained on attributed public Dolly/IndicInstruct and original examples. Teacher review remains pending. Factual model errors remain; the application separately validates sources and supplies source-guided explanations.

Base revision: `unsloth/gemma-3-4b-it-bnb-4bit@eb03c885bc2cc913fe792994bc766006f14ad72d`.
Model use is subject to [Gemma Terms](https://ai.google.dev/gemma/terms). Data attribution and changes are in `DATA_ATTRIBUTION.md`. No student chats were used for training. Keep this Space private; authenticate server-side requests with a read-scoped Hugging Face token.

ZeroGPU is quota-limited and requires an eligible account. A suggested hardware field does not allocate a GPU. The deployment script explicitly requests only the free ZeroGPU flavor and never falls back to paid hardware. Cloud compatibility must be verified after the Space builds; this is a prepared candidate, not a claim of successful cloud deployment.
