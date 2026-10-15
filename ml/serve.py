"""Local-only quantized Transformers/PEFT inference with an authenticated compatible API."""

import argparse
import hashlib
import json
import re
import secrets
import threading
from contextlib import asynccontextmanager, nullcontext
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, ConfigDict, Field


def validated_json(output, source_ids):
    text = output.strip()
    if text.startswith("```json\n") and text.endswith("```"):
        text = text[8:-3].strip()
    value = json.loads(text)
    if not isinstance(value, dict) or set(value) != {"reply", "citations"}:
        raise ValueError("Unexpected tutor JSON fields.")
    reply, citations = value["reply"], value["citations"]
    if not isinstance(reply, str) or not 1 <= len(reply.strip()) <= 6000:
        raise ValueError("Invalid tutor reply.")
    if (
        not isinstance(citations, list)
        or not 1 <= len(citations) <= 3
        or not all(isinstance(item, str) for item in citations)
    ):
        raise ValueError("Invalid citations.")
    if len(set(citations)) != len(citations) or (
        source_ids and any(item not in source_ids for item in citations)
    ):
        raise ValueError("Unknown or repeated citations.")
    value["reply"] = reply.strip()
    return json.dumps(value, ensure_ascii=False)


class ChatInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    model: str
    messages: list[dict[str, str]] = Field(min_length=1, max_length=30)
    max_tokens: int = Field(default=400, ge=1, le=600)
    temperature: float = Field(default=0.0, ge=0, le=2)
    response_format: dict | None = None


def create_app(adapter: Path, token_file: Path, base_only=False):
    token = token_file.read_text().strip()
    if len(token) < 24:
        raise ValueError("Use a random local access token with at least 24 characters.")
    metadata = json.loads((adapter / "training_metadata.json").read_text())
    model_name = "scortiq-qwen3-base" if base_only else "scortiq-socratic-v1"
    digest = hashlib.sha256((adapter / "adapter_model.safetensors").read_bytes()).hexdigest()
    lock = threading.Lock()
    runtime = {}

    @asynccontextmanager
    async def lifespan(app):
        import torch
        from peft import PeftModel
        from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig

        tokenizer = AutoTokenizer.from_pretrained(adapter, local_files_only=True)
        base = AutoModelForCausalLM.from_pretrained(
            metadata["base_model"],
            revision=metadata["revision"],
            local_files_only=True,
            device_map={"": 0},
            torch_dtype=torch.bfloat16,
            quantization_config=BitsAndBytesConfig(
                load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.bfloat16
            ),
        )
        model = (
            base if base_only else PeftModel.from_pretrained(base, adapter, local_files_only=True)
        )
        model.eval()
        model.config.use_cache = True
        runtime.update(model=model, tokenizer=tokenizer)
        yield
        runtime.clear()

    app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)

    @app.get("/health")
    def health():
        return {"ready": bool(runtime), "model": model_name, "adapter": not base_only}

    @app.get("/api/version")
    def version():
        return {
            "version": "local-transformers-4.52.4-peft-0.15.2",
            "decoding": "greedy",
            "json_constrained": False,
            "json_validated": True,
            "context_tokens": 4096,
        }

    @app.get("/api/tags")
    def tags():
        items = [{"name": model_name, "digest": metadata["revision"] if base_only else digest}]
        if not base_only:
            items.append({"name": "scortiq-qwen3-base", "digest": metadata["revision"]})
        return {"models": items}

    @app.post("/api/generate")
    def warm():
        # Compatibility readiness probe; model is already loaded by lifespan.
        return {"model": model_name, "done": True, "response": "", "loaded": bool(runtime)}

    @app.post("/v1/chat/completions")
    def chat(body: ChatInput, authorization: str = Header(default="")):
        if not secrets.compare_digest(authorization, "Bearer " + token):
            raise HTTPException(401, "Invalid local tutor token.")
        if body.model not in {model_name, "scortiq-qwen3-base"}:
            raise HTTPException(404, "Model is not loaded.")
        if any(
            set(m) != {"role", "content"} or m["role"] not in {"system", "user", "assistant"}
            for m in body.messages
        ):
            raise HTTPException(422, "Use text-only system/user/assistant messages.")
        if sum(len(m["content"]) for m in body.messages) > 24000:
            raise HTTPException(413, "Conversation is too long for this local tutor.")
        if not lock.acquire(blocking=False):
            raise HTTPException(429, "The local GPU tutor is busy. Please retry shortly.")
        try:
            import torch

            tokenizer, model = runtime["tokenizer"], runtime["model"]
            inputs = tokenizer.apply_chat_template(
                body.messages, add_generation_prompt=True, return_tensors="pt", return_dict=True
            ).to(model.device)
            if inputs["input_ids"].shape[1] + body.max_tokens > 4096:
                raise HTTPException(413, "Conversation exceeds the local context window.")
            context = (
                model.disable_adapter()
                if body.model == "scortiq-qwen3-base" and not base_only
                else nullcontext()
            )
            with context, torch.inference_mode():
                result = model.generate(
                    **inputs,
                    do_sample=False,
                    max_new_tokens=body.max_tokens,
                    pad_token_id=tokenizer.eos_token_id,
                )
            output = tokenizer.decode(
                result[0, inputs["input_ids"].shape[1] :], skip_special_tokens=True
            )
            if body.response_format == {"type": "json_object"}:
                source_ids = set(
                    re.findall(
                        r'"id"\s*:\s*"([^"\\]+)"',
                        " ".join(m["content"] for m in body.messages if m["role"] == "system"),
                    )
                )
                try:
                    output = validated_json(output, source_ids)
                except (ValueError, TypeError):
                    raise HTTPException(
                        503, "The model did not return a valid grounded JSON reply."
                    )
            return {
                "model": body.model,
                "choices": [
                    {
                        "message": {"role": "assistant", "content": output},
                        "finish_reason": "stop"
                        if result[0, -1].item() == tokenizer.eos_token_id
                        else "length",
                    }
                ],
            }
        finally:
            lock.release()

    return app


def main():
    import uvicorn

    parser = argparse.ArgumentParser()
    parser.add_argument("--adapter", type=Path, required=True)
    parser.add_argument("--token-file", type=Path, required=True)
    parser.add_argument("--base-only", action="store_true")
    parser.add_argument("--port", type=int, default=11435)
    args = parser.parse_args()
    uvicorn.run(
        create_app(args.adapter, args.token_file, args.base_only),
        host="127.0.0.1",
        port=args.port,
        access_log=False,
    )


if __name__ == "__main__":
    main()
