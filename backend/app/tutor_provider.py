"""Transport for an OpenAI-compatible server or queued Gradio ZeroGPU Space."""

import asyncio
import json
import re

import httpx


async def gradio_reply(url, token, messages):
    # Queue waits and cold starts must not hold a web request indefinitely.
    async with asyncio.timeout(90), httpx.AsyncClient(timeout=85) as client:
        headers = {"Authorization": f"Bearer {token}"}
        base = url.rstrip("/") + "/gradio_api/call/generate"
        submitted = await client.post(base, headers=headers, json={"data": [json.dumps(messages)]})
        submitted.raise_for_status()
        event_id = submitted.json()["event_id"]
        if not isinstance(event_id, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,128}", event_id):
            raise ValueError("Invalid queue event ID")
        async with client.stream("GET", base + "/" + event_id, headers=headers) as result:
            result.raise_for_status()
            event, size = "", 0
            async for line in result.aiter_lines():
                size += len(line)
                if size > 64000:
                    raise ValueError("Queue response is too large")
                if line.startswith("event:"):
                    event = line[6:].strip()
                elif line.startswith("data:"):
                    if event == "error":
                        raise ValueError("Hosted model is unavailable")
                    if event == "complete":
                        output = json.loads(line[5:])
                        if (
                            not isinstance(output, list)
                            or len(output) != 1
                            or not isinstance(output[0], str)
                        ):
                            raise ValueError("Invalid hosted output")
                        return output[0]
        raise ValueError("Hosted request ended before completion")
