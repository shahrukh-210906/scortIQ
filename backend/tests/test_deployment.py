import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import httpx
from fastapi import FastAPI
from fastapi.testclient import TestClient

from backend.app.frontend import FrontendFiles
from backend.app.tutor_provider import gradio_reply


class HostedProviderTests(unittest.IsolatedAsyncioTestCase):
    async def test_private_queue_submission_and_completed_output(self):
        output = '{"reply":"A source explanation","citations":["source:0"]}'

        def handler(request):
            self.assertEqual(request.headers["authorization"], "Bearer test-secret")
            if request.method == "POST":
                self.assertEqual(
                    json.loads(request.content)["data"], ['[{"role": "user", "content": "Why?"}]']
                )
                return httpx.Response(200, json={"event_id": "abc123"})
            self.assertTrue(str(request.url).endswith("/generate/abc123"))
            return httpx.Response(
                200,
                text="event: heartbeat\ndata: null\n\nevent: complete\ndata: "
                + json.dumps([output])
                + "\n\n",
            )

        client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
        with patch("backend.app.tutor_provider.httpx.AsyncClient", return_value=client):
            result = await gradio_reply(
                "https://private.hf.space", "test-secret", [{"role": "user", "content": "Why?"}]
            )
        self.assertEqual(result, output)

    async def test_queue_errors_and_missing_completion_are_rejected(self):
        for stream in (
            'event: error\ndata: "quota exceeded"\n\n',
            "event: heartbeat\ndata: null\n\n",
        ):

            def handler(request):
                return (
                    httpx.Response(200, json={"event_id": "id"})
                    if request.method == "POST"
                    else httpx.Response(200, text=stream)
                )

            client = httpx.AsyncClient(transport=httpx.MockTransport(handler))
            with patch("backend.app.tutor_provider.httpx.AsyncClient", return_value=client):
                with self.assertRaises(ValueError):
                    await gradio_reply("https://private.hf.space", "test-secret", [])


class FrontendDeploymentTests(unittest.TestCase):
    def test_direct_lesson_links_work_without_hiding_missing_api_or_asset_errors(self):
        with tempfile.TemporaryDirectory() as folder:
            Path(folder, "index.html").write_text("<h1>ScortIQ</h1>")
            app = FastAPI()
            app.mount("/", FrontendFiles(directory=folder, html=True))
            with TestClient(app) as client:
                self.assertEqual(client.get("/lesson/reactions-balance").status_code, 200)
                for path in ("/api", "/api/unknown", "/assets/missing.js"):
                    self.assertEqual(client.get(path).status_code, 404)
