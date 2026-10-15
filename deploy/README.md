# Deployment handoff

## 1. Model: private Hugging Face ZeroGPU Space

The actual trained Gemma adapter is prepared by `python -m ml.deploy_space`. The script copies only allowlisted adapter/tokenizer files and provenance into ignored `.tmp/hf-space`; it does not upload `.env`, student data, checkpoints or the base model. The Space downloads the exact pinned training base at startup. The package uses PyTorch/PEFT instead of local llama.cpp, so cloud GPU compatibility and reply quality must be checked after build. A prepared package is not a deployed endpoint.

Free personal ZeroGPU hosting currently requires a verified account over 30 days old. It has GPU quotas and queue waits, so it is suitable for a limited pilot rather than guaranteed always-on classroom service. See [official eligibility and quota details](https://huggingface.co/docs/hub/spaces-zerogpu). No paid hardware is selected by this script.

Sign in using the local Hugging Face CLI in the training environment: `hf auth login`. Use the secure prompt; do not paste tokens into chat or commit them. Then run:

```text
python -m ml.deploy_space --output .tmp/hf-space-upload --repo YOUR_USERNAME/scortiq-tutor --publish
```

This creates a **private** Gradio Space requesting `zero-a10g` (the current API identifier for ZeroGPU), then uploads the allowlisted files. It refuses to overwrite an existing Space or switch to paid hardware. If eligibility is rejected, keep the local runtime connected. An account username alone cannot authorize an upload; a local authenticated session is required.

After the Space builds, use its displayed `https://...hf.space` app URL. Supply a read-scoped Hugging Face token as the backend hosting secret `HF_TOKEN`, `HF_API_MODE=gradio`, and that URL as `HF_ENDPOINT_URL`. Never expose the token to the frontend. Requests use the authenticated Gradio queue API and have a 90-second overall wait limit. Quota or invalid-response failures can use exact source guidance for existing pilot material; other material fails safely. The app does not claim a model-generated answer when it uses source guidance.

Before switching the live backend, verify one English, Hindi and Hinglish response against the lesson source, wrong-answer gating, and model quota/error recovery. Do not claim cloud deployment complete before those checks succeed. The local model remains configured until then.

## 2. Project: one application container

The root Dockerfile builds the React frontend and serves it alongside FastAPI on port 8000. Direct lesson links work, and missing API/asset URLs retain HTTP 404 responses. `.dockerignore` excludes secrets, model files and local databases. No model or GPU is bundled into this application container.

```text
docker build -t scortiq .
docker run --rm --env-file YOUR_PRIVATE_PRODUCTION_ENV -p 8000:8000 scortiq
```

Use `production.env.example` as a template for your hosting provider's secrets. The production database requires the Supabase PostgreSQL connection string, not its public project key. Obtain the connection string from Supabase Connect; URL-encode password special characters. Production uses verified Supabase email sign-in and a migrated persistent PostgreSQL database. Run `python -m alembic upgrade head` once through the hosting provider's release command before starting the service. Do not migrate the local SQLite preview into an exposed production service or enable local demo login there.

Production also requires reviewed imported lesson source records. Existing pilot sources are drafts and remain excluded by the production retrieval policy. Use the existing `python -m backend.import_sources REVIEWED.jsonl` workflow after genuine teacher review; do not mark draft data reviewed just to enable deployment. Set Supabase's Site URL and allowed redirects to the final HTTPS application domain. Use HTTPS ingress and keep the model Space private. Configure proxy trust for the actual hosting ingress rather than an arbitrary public client.

Current validation covers the backend transport, recovery and SPA routing, plus frontend build/browser journeys. Docker is not installed in the current workspace, so the container build and hosted GPU execution still require validation on the deployment host. No live cloud endpoint or public app URL has been created yet.
