import json
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

from ml.serve import create_app, validated_json


class LocalServingTests(unittest.TestCase):
    def test_hindi_and_scientific_symbols_roundtrip_and_bad_citations_are_rejected(self):
        reply = "पानी रासायनिक H₂O 70° → ± ₹ θ"
        output = json.dumps({"reply": reply, "citations": ["source:0"]}, ensure_ascii=False)
        self.assertEqual(json.loads(validated_json(output, {"source:0"}))["reply"], reply)
        with self.assertRaises(ValueError):
            validated_json(output, {"another:0"})
        with self.assertRaises(ValueError):
            validated_json('{"reply":"प', {"source:0"})

    def test_private_requests_require_token_and_metadata_does_not_claim_loaded_model(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / "training_metadata.json").write_text(
                json.dumps({"revision": "pinned", "base_model": "test"})
            )
            (root / "adapter_model.safetensors").write_bytes(b"fixture-only")
            token = root / "token"
            token.write_text("private-fixture-token-1234567890")
            # Do not enter lifespan: test routing/auth without loading weights or GPU libraries.
            client = TestClient(create_app(root, token))
            self.assertFalse(client.get("/health").json()["ready"])
            self.assertEqual(len(client.get("/api/tags").json()["models"]), 2)
            body = {"model": "scortiq-socratic-v1", "messages": [{"role": "user", "content": "Hi"}]}
            self.assertEqual(client.post("/v1/chat/completions", json=body).status_code, 401)
            self.assertEqual(
                client.post(
                    "/v1/chat/completions",
                    json={**body, "model": "unknown"},
                    headers={"Authorization": "Bearer " + token.read_text()},
                ).status_code,
                404,
            )
            self.assertEqual(
                client.post(
                    "/v1/chat/completions", json={**body, "max_tokens": 100000}
                ).status_code,
                422,
            )


if __name__ == "__main__":
    unittest.main()
