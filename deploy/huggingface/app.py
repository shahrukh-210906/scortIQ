"""Private ZeroGPU candidate. Cloud GPU smoke validation is required after upload."""

# ruff: noqa: I001
# spaces must initialize CUDA emulation before importing GPU libraries.

import json
from pathlib import Path

import spaces
import gradio as gr
import torch
from peft import PeftModel
from transformers import AutoModelForImageTextToText, AutoTokenizer

ROOT = Path(__file__).parent
metadata = json.loads((ROOT / "adapter/training_metadata.json").read_text())
tokenizer = AutoTokenizer.from_pretrained(ROOT / "adapter")
# Match the actual training base, revision and quantization. No remote custom code.
base = AutoModelForImageTextToText.from_pretrained(
    metadata["base_model"],
    revision=metadata["revision"],
    torch_dtype=torch.bfloat16,
    device_map={"": "cuda:0"},
)
model = PeftModel.from_pretrained(base, ROOT / "adapter").eval()
model.config.use_cache = True


@spaces.GPU(duration=60)
def generate(payload):
    if not isinstance(payload, str) or len(payload) > 32000:
        raise gr.Error("Conversation is too large.")
    messages = json.loads(payload)
    if not isinstance(messages, list) or not 1 <= len(messages) <= 15:
        raise gr.Error("Invalid conversation.")
    for message in messages:
        if (
            not isinstance(message, dict)
            or set(message) != {"role", "content"}
            or message["role"] not in {"system", "user", "assistant"}
            or not isinstance(message["content"], str)
        ):
            raise gr.Error("Use text-only conversation messages.")
    inputs = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        return_tensors="pt",
        return_dict=True,
    ).to(model.device)
    if inputs["input_ids"].shape[1] > 3496:
        raise gr.Error("Please start a shorter conversation.")
    with torch.inference_mode():
        result = model.generate(
            **inputs,
            do_sample=False,
            max_new_tokens=600,
            pad_token_id=tokenizer.eos_token_id,
        )
    return tokenizer.decode(result[0, inputs["input_ids"].shape[1] :], skip_special_tokens=True)


with gr.Blocks(analytics_enabled=False) as demo:
    gr.Markdown(
        "# ScortIQ private model endpoint\nExperimental trained adapter; factual checking happens in the app."
    )
    payload = gr.Textbox(label="Text conversation JSON")
    output = gr.Textbox(label="Model output")
    gr.Button("Generate").click(generate, payload, output, api_name="generate", concurrency_limit=1)

if __name__ == "__main__":
    demo.queue(max_size=8).launch(show_error=False)
