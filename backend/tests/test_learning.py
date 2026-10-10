import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import AsyncMock, Mock, patch

test_dir = tempfile.TemporaryDirectory()
os.environ["DATABASE_URL"] = "sqlite:///" + str(Path(test_dir.name) / "test.db").replace("\\", "/")
os.environ["APP_ENV"] = "test"
from fastapi.testclient import TestClient

from backend.app import main
from backend.app.database import AuthChallenge, Base, Feedback, SessionLocal, engine


class LearningTests(unittest.TestCase):
    @classmethod
    def tearDownClass(cls):
        engine.dispose()
        test_dir.cleanup()

    def setUp(self):
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
        self.client = TestClient(main.app)
        self.client.__enter__()
        result = self.client.post("/api/auth/local", json={"name": "Asha"})
        self.assertEqual(result.status_code, 200)
        self.user_id = result.json()["id"]

    def tearDown(self):
        self.client.__exit__(None, None, None)

    def quiz(self):
        response = self.client.post("/api/quizzes/chemical-reactions")
        self.assertEqual(response.status_code, 200)
        return response.json()

    def test_content_feedback_validation_ownership_and_limits(self):
        from sqlalchemy import select

        from backend.app.content import CHAPTERS

        topic_id = CHAPTERS[0]["topics"][0]["id"]
        body = {
            "topic_id": topic_id,
            "category": "confusing",
            "message": "Please explain this example more clearly.",
        }
        for _ in range(10):
            self.assertEqual(self.client.post("/api/feedback", json=body).status_code, 201)
        self.assertEqual(self.client.post("/api/feedback", json=body).status_code, 429)
        with SessionLocal() as db:
            reports = list(db.scalars(select(Feedback)))
            self.assertEqual(len(reports), 10)
            self.assertTrue(all(report.user_id == self.user_id for report in reports))
        self.assertEqual(
            self.client.post("/api/feedback", json={**body, "topic_id": "missing"}).status_code, 404
        )
        self.assertEqual(
            self.client.post("/api/feedback", json={**body, "message": " " * 20}).status_code, 422
        )
        self.assertEqual(
            self.client.post(
                "/api/feedback", json=body, headers={"origin": "https://other.test"}
            ).status_code,
            403,
        )
        self.client.post("/api/auth/logout")
        self.assertEqual(self.client.post("/api/feedback", json=body).status_code, 401)

    def test_reflection_is_saved_editable_and_account_owned(self):
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        endpoint = f"/api/lessons/{lesson['id']}/reflection"
        self.assertEqual(lesson["reflection"], "")
        for answer in ["My first explanation", "My revised explanation"]:
            self.assertEqual(self.client.post(endpoint, json={"answer": answer}).status_code, 200)
            resumed = self.client.post("/api/lessons/reactions-signs").json()
            self.assertEqual(resumed["reflection"], answer)
            self.assertEqual(resumed["completed_steps"], [])
        self.assertEqual(self.client.post(endpoint, json={"answer": "   "}).status_code, 422)
        self.assertEqual(self.client.post(endpoint, json={"answer": "x" * 4001}).status_code, 422)
        self.client.post("/api/auth/local", json={"name": "Another learner"})
        self.assertEqual(
            self.client.post(endpoint, json={"answer": "Overwrite attempt"}).status_code, 404
        )
        self.assertEqual(self.client.post("/api/lessons/reactions-signs").json()["reflection"], "")

    def test_bookmarks_are_idempotent_and_account_owned(self):
        endpoint = "/api/bookmarks/reactions-signs"
        for _ in range(2):
            self.assertEqual(self.client.post(endpoint, json={"saved": True}).status_code, 200)
        progress = self.client.get("/api/progress").json()
        self.assertEqual(progress["bookmarked_topics"], ["reactions-signs"])
        self.assertEqual(progress["started_topics"], [])
        self.assertEqual(
            self.client.post("/api/bookmarks/missing", json={"saved": True}).status_code, 404
        )
        self.assertEqual(self.client.post(endpoint, json={"saved": "false"}).status_code, 422)
        self.assertEqual(
            self.client.post(
                endpoint, json={"saved": False}, headers={"origin": "https://other.test"}
            ).status_code,
            403,
        )
        self.client.post("/api/auth/local", json={"name": "Other learner"})
        self.assertEqual(self.client.get("/api/progress").json()["bookmarked_topics"], [])
        self.client.post(endpoint, json={"saved": False})
        from sqlalchemy import select

        from backend.app.database import Bookmark

        with SessionLocal() as db:
            self.assertIsNotNone(db.get(Bookmark, (self.user_id, "reactions-signs")))
        for _ in range(2):
            self.client.post(endpoint, json={"saved": True})
            self.assertEqual(self.client.post(endpoint, json={"saved": False}).status_code, 200)
        self.assertEqual(self.client.get("/api/progress").json()["bookmarked_topics"], [])
        with SessionLocal() as db:
            self.assertEqual(len(list(db.scalars(select(Bookmark)))), 1)
        self.client.post("/api/auth/logout")
        self.assertEqual(self.client.post(endpoint, json={"saved": True}).status_code, 401)

    def test_language_preferences_validate_persist_and_preserve_learning(self):
        self.client.post("/api/lessons/reactions-signs")
        original = self.client.get("/api/progress").json()
        self.assertEqual(self.client.get("/api/me").json()["teaching_language"], "en")
        updated = self.client.patch(
            "/api/me", json={"name": "Asha", "teaching_language": "hinglish", "exam_language": "hi"}
        )
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.json()["teaching_language"], "hinglish")
        self.assertEqual(self.client.get("/api/me").json()["exam_language"], "hi")
        self.client.patch("/api/me", json={"name": "Asha renamed"})
        self.assertEqual(self.client.get("/api/me").json()["teaching_language"], "hinglish")
        self.assertEqual(self.client.get("/api/progress").json(), original)
        self.assertEqual(
            self.client.patch(
                "/api/me", json={"name": "Asha", "exam_language": "hinglish"}
            ).status_code,
            422,
        )
        self.assertEqual(
            self.client.patch(
                "/api/me", json={"name": "Asha", "teaching_language": "invalid"}
            ).status_code,
            422,
        )
        other = self.client.post(
            "/api/auth/local",
            json={"name": "Other", "teaching_language": "hi", "exam_language": "en"},
        )
        self.assertEqual(other.json()["teaching_language"], "hi")
        self.assertEqual(other.json()["exam_language"], "en")

    def test_catalogue_has_four_subjects_and_only_planned_topics(self):
        response = self.client.get("/api/catalogue")
        self.assertEqual(response.status_code, 200)
        catalogue = response.json()
        self.assertEqual(catalogue["class_level"], 10)
        self.assertEqual(
            {s["title"] for s in catalogue["subjects"]},
            {"Maths", "Chemistry", "Biology", "Physics"},
        )
        topics = [t for s in catalogue["subjects"] for c in s["chapters"] for t in c["topics"]]
        self.assertEqual(len(topics), 185)
        self.assertTrue(all(t["availability"] == "planned" for t in topics))

    def test_topic_journey_language_stage_activity_and_ownership(self):
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        self.assertEqual(lesson["active_stage"], "understand")
        lesson_id = lesson["id"]
        self.client.patch("/api/me", json={"name": "Asha", "exam_language": "hi"})
        content = self.client.get(f"/api/lessons/{lesson_id}/journey").json()
        self.assertEqual(content["notes"]["language"], "hi")
        self.assertEqual(content["notes"]["status"], "draft")
        self.assertNotIn("atoms", content["activity"])
        self.assertEqual(
            self.client.post(
                f"/api/lessons/{lesson_id}/stage", json={"stage": "notes"}
            ).status_code,
            200,
        )
        self.assertEqual(
            self.client.post("/api/lessons/reactions-signs").json()["active_stage"], "notes"
        )
        endpoint = f"/api/lessons/{lesson_id}/activity"
        self.assertFalse(
            self.client.post(endpoint, json={"coefficients": [1, 1, 1]}).json()["correct"]
        )
        self.assertFalse(
            self.client.post(endpoint, json={"coefficients": [4, 2, 4]}).json()["correct"]
        )
        self.assertTrue(
            self.client.post(endpoint, json={"coefficients": [2, 1, 2]}).json()["correct"]
        )
        self.assertTrue(
            self.client.post("/api/lessons/reactions-signs").json()["activity_completed"]
        )
        for invalid in [[0, 1, 2], [True, 1, 2], [21, 1, 2], [1, 2]]:
            self.assertEqual(
                self.client.post(endpoint, json={"coefficients": invalid}).status_code, 422
            )
        other_topic = self.client.post("/api/lessons/light-reflection").json()["id"]
        self.assertEqual(
            self.client.post(
                f"/api/lessons/{other_topic}/stage", json={"stage": "activity"}
            ).status_code,
            422,
        )
        self.assertIsNone(self.client.get(f"/api/lessons/{other_topic}/journey").json()["activity"])
        self.client.post("/api/auth/local", json={"name": "Other learner"})
        self.assertEqual(self.client.get(f"/api/lessons/{lesson_id}/journey").status_code, 404)
        self.assertEqual(
            self.client.post(endpoint, json={"coefficients": [2, 1, 2]}).status_code, 404
        )
        self.assertEqual(
            self.client.post(
                f"/api/lessons/{lesson_id}/stage", json={"stage": "recall"}
            ).status_code,
            404,
        )

    def test_topic_recall_keys_grading_resume_and_isolation(self):
        from backend.app.journey_content import TOPIC_QUESTIONS

        lesson_id = self.client.post("/api/lessons/reactions-signs").json()["id"]
        endpoint = f"/api/lessons/{lesson_id}/recall"
        self.assertIsNone(self.client.get(endpoint).json()["result"])
        quiz = self.client.post(endpoint).json()
        self.assertEqual({q["id"] for q in quiz["questions"]}, {"cr1", "signs-physical"})
        self.assertTrue(all("correct" not in q and "reason" not in q for q in quiz["questions"]))
        submission = f"/api/recall/{quiz['id']}/submit"
        self.assertEqual(
            self.client.post(submission, json={"answers": {"cr1": 2}}).status_code, 422
        )
        self.assertIsNone(self.client.get(endpoint).json()["result"])
        answers = {q["id"]: q["correct"] for q in TOPIC_QUESTIONS["reactions-signs"]}
        result = self.client.post(submission, json={"answers": answers})
        self.assertEqual(result.json()["score"], 2)
        self.assertEqual(
            self.client.post(submission, json={"answers": answers}).json(), result.json()
        )
        self.assertEqual(
            self.client.post(submission, json={"answers": {**answers, "cr1": 0}}).status_code, 409
        )
        self.assertEqual(self.client.get(endpoint).json()["result"], result.json())
        next_quiz = self.client.post(endpoint).json()
        self.client.post(
            f"/api/recall/{next_quiz['id']}/submit",
            json={"answers": {"cr1": 0, "signs-physical": 0}},
        )
        self.assertEqual(self.client.get(endpoint).json()["result"]["score"], 0)
        self.client.post("/api/auth/local", json={"name": "Other learner"})
        self.assertEqual(self.client.get(endpoint).status_code, 404)
        self.assertEqual(self.client.post(submission, json={"answers": answers}).status_code, 404)

    def test_email_signin_recovery_rotation_and_replay(self):
        original_cookie = self.client.cookies.get("scortiq_session")
        account = {
            "id": "provider-user",
            "email": "asha@example.com",
            "email_confirmed_at": "2026-10-08",
        }
        with (
            patch.object(main, "SUPABASE_URL", "https://example.supabase.co"),
            patch.object(main, "SUPABASE_KEY", "public-key"),
            patch.object(main, "supabase_request", new_callable=AsyncMock) as provider,
        ):
            provider.side_effect = [{}, {"access_token": "server-only"}, account]
            self.assertEqual(
                self.client.post(
                    "/api/auth/email/start", json={"email": "asha@example.com"}
                ).status_code,
                200,
            )
            result = self.client.post(
                "/api/auth/email/verify", json={"email": "asha@example.com", "code": "123456"}
            )
            self.assertEqual(result.status_code, 200)
            self.assertTrue(result.json()["verified"])
            verified_id = result.json()["id"]
            self.assertNotEqual(verified_id, self.user_id)
            self.assertNotIn("server-only", result.text)
            self.assertIn("HttpOnly", result.headers["set-cookie"])
            self.assertEqual(
                self.client.post(
                    "/api/auth/email/verify", json={"email": "asha@example.com", "code": "123456"}
                ).status_code,
                400,
            )
            self.client.post("/api/lessons/reactions-signs")
            self.client.patch(
                "/api/me",
                json={"name": "Asha", "teaching_language": "hinglish", "exam_language": "hi"},
            )
            self.client.cookies.set("scortiq_session", original_cookie)
            self.assertEqual(self.client.get("/api/me").status_code, 401)
            # A new browser recovers the same provider identity and saved progress.
            with SessionLocal() as db:
                for challenge in db.query(AuthChallenge).all():
                    challenge.created_at -= 61
                db.commit()
            other = TestClient(main.app)
            provider.side_effect = [{}, {"access_token": "server-only"}, account]
            other.post("/api/auth/email/start", json={"email": "asha@example.com"})
            recovered = other.post(
                "/api/auth/email/verify", json={"email": "asha@example.com", "code": "123456"}
            )
            self.assertEqual(recovered.json()["id"], verified_id)
            self.assertEqual(recovered.json()["teaching_language"], "hinglish")
            self.assertEqual(recovered.json()["exam_language"], "hi")
            self.assertIn("reactions-signs", other.get("/api/progress").json()["started_topics"])
            with patch.object(main, "PRODUCTION", True):
                self.assertEqual(other.get("/api/me").status_code, 200)
            other.post("/api/auth/logout")
            self.assertEqual(other.get("/api/me").status_code, 401)

    def test_email_challenge_attempt_limit_expiry_and_binding(self):
        with (
            patch.object(main, "SUPABASE_URL", "https://example.supabase.co"),
            patch.object(main, "SUPABASE_KEY", "public-key"),
            patch.object(main, "supabase_request", new_callable=AsyncMock) as provider,
        ):
            provider.return_value = {}
            self.client.post("/api/auth/email/start", json={"email": "asha@example.com"})
            self.assertEqual(
                self.client.post(
                    "/api/auth/email/start", json={"email": "asha@example.com"}
                ).status_code,
                429,
            )
            self.assertEqual(
                self.client.post(
                    "/api/auth/email/verify", json={"email": "other@example.com", "code": "123456"}
                ).status_code,
                400,
            )
            provider.side_effect = main.HTTPException(400, "Invalid code")
            for _ in range(5):
                self.assertEqual(
                    self.client.post(
                        "/api/auth/email/verify",
                        json={"email": "asha@example.com", "code": "123456"},
                    ).status_code,
                    400,
                )
            count = provider.call_count
            self.client.post(
                "/api/auth/email/verify", json={"email": "asha@example.com", "code": "123456"}
            )
            self.assertEqual(provider.call_count, count)
            with SessionLocal() as db:
                for challenge in db.query(AuthChallenge).all():
                    challenge.attempts = 0
                    challenge.expires = 0
                db.commit()
            self.assertEqual(
                self.client.post(
                    "/api/auth/email/verify", json={"email": "asha@example.com", "code": "123456"}
                ).status_code,
                400,
            )
            self.assertEqual(provider.call_count, count)

    def test_unverified_provider_account_is_rejected(self):
        with (
            patch.object(main, "SUPABASE_URL", "https://example.supabase.co"),
            patch.object(main, "SUPABASE_KEY", "public-key"),
            patch.object(main, "supabase_request", new_callable=AsyncMock) as provider,
        ):
            provider.side_effect = [
                {},
                {"access_token": "token"},
                {"id": "user", "email": "asha@example.com"},
            ]
            self.client.post("/api/auth/email/start", json={"email": "asha@example.com"})
            self.assertEqual(
                self.client.post(
                    "/api/auth/email/verify", json={"email": "asha@example.com", "code": "123456"}
                ).status_code,
                401,
            )
            self.assertEqual(self.client.get("/api/me").json()["id"], self.user_id)

    def test_supabase_transport_does_not_expose_provider_errors(self):
        result = Mock(status_code=400)
        result.json.return_value = {"message": "private provider diagnostic"}
        transport = AsyncMock()
        transport.request.return_value = result
        with (
            patch.object(main, "SUPABASE_URL", "https://example.supabase.co"),
            patch.object(main, "SUPABASE_KEY", "public-key"),
            patch("backend.app.main.httpx.AsyncClient") as client,
        ):
            client.return_value.__aenter__.return_value = transport
            response = self.client.post("/api/auth/email/start", json={"email": "asha@example.com"})
            self.assertEqual(response.status_code, 400)
            self.assertNotIn("private provider diagnostic", response.text)
            self.assertEqual(transport.request.call_args.kwargs["headers"]["apikey"], "public-key")

    def test_answer_keys_hidden_and_server_grading(self):
        quiz = self.quiz()
        self.assertEqual(len(quiz["questions"]), 3)
        for question in quiz["questions"]:
            self.assertNotIn("correct", question)
            self.assertNotIn("reason", question)
        answers = {"cr1": 2, "cr2": 1, "cr3": 2}
        result = self.client.post(f"/api/attempts/{quiz['id']}/submit", json={"answers": answers})
        self.assertEqual(result.status_code, 200)
        self.assertEqual(result.json()["score"], 3)
        self.assertEqual(len(result.json()["review"]), 3)
        # Retrying a completed request must not create a second result.
        repeated = self.client.post(f"/api/attempts/{quiz['id']}/submit", json={"answers": answers})
        self.assertEqual(repeated.status_code, 200)
        self.assertEqual(len(self.client.get("/api/progress").json()["attempts"]), 1)
        changed = self.client.post(
            f"/api/attempts/{quiz['id']}/submit", json={"answers": {"cr1": 0, "cr2": 0, "cr3": 0}}
        )
        self.assertEqual(changed.status_code, 409)

    def test_invalid_and_abandoned_quizzes_do_not_change_progress(self):
        quiz = self.quiz()
        self.assertEqual(self.client.get("/api/progress").json()["attempts"], [])
        for answers in [
            {"cr1": 2},
            {"cr1": 99, "cr2": 1, "cr3": 2},
            {"cr1": True, "cr2": 1, "cr3": 2},
            {"cr1": "2", "cr2": 1, "cr3": 2},
        ]:
            response = self.client.post(
                f"/api/attempts/{quiz['id']}/submit", json={"answers": answers}
            )
            self.assertEqual(response.status_code, 422)
        self.assertEqual(self.client.get("/api/progress").json()["attempts"], [])

    def test_account_isolation(self):
        quiz = self.quiz()
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        with TestClient(main.app) as second:
            self.assertEqual(second.get("/api/me").status_code, 401)
            second.post("/api/auth/local", json={"name": "Another learner"})
            self.assertEqual(second.get("/api/progress").json()["started_topics"], [])
            self.assertEqual(
                second.post(
                    f"/api/attempts/{quiz['id']}/submit",
                    json={"answers": {"cr1": 2, "cr2": 1, "cr3": 2}},
                ).status_code,
                404,
            )
            self.assertEqual(
                second.post(
                    f"/api/lessons/{lesson['id']}/turn", json={"message": "Hello"}
                ).status_code,
                404,
            )

    def test_lesson_resume_and_inference_outage(self):
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        reopened = self.client.post("/api/lessons/reactions-signs").json()
        self.assertEqual(lesson["id"], reopened["id"])
        with patch.object(main, "HF_URL", ""):
            result = self.client.post(
                f"/api/lessons/{lesson['id']}/turn", json={"message": "Explain this"}
            )
        self.assertEqual(result.status_code, 503)
        self.assertEqual(self.client.post("/api/lessons/reactions-signs").json()["messages"], [])
        progress = self.client.get("/api/progress").json()
        self.assertEqual(progress["started_topics"], ["reactions-signs"])
        self.assertEqual(progress["attempts"], [])

    def test_logout_invalidates_session(self):
        token = self.client.cookies.get("scortiq_session")
        self.assertEqual(self.client.post("/api/auth/logout").status_code, 200)
        self.client.cookies.set("scortiq_session", token)
        self.assertEqual(self.client.get("/api/me").status_code, 401)

    def test_cross_site_writes_rejected(self):
        response = self.client.post(
            "/api/auth/local",
            json={"name": "Intruder"},
            headers={"Origin": "https://other.example"},
        )
        self.assertEqual(response.status_code, 403)
        response = self.client.patch(
            "/api/me", json={"name": "Intruder"}, headers={"Sec-Fetch-Site": "cross-site"}
        )
        self.assertEqual(response.status_code, 403)

    def test_production_disables_local_profiles(self):
        with patch.object(main, "PRODUCTION", True):
            self.assertEqual(
                self.client.post("/api/auth/local", json={"name": "Asha"}).status_code, 404
            )
            self.assertEqual(self.client.get("/api/me").status_code, 401)

    def test_production_startup_refuses_development_configuration(self):
        with patch.object(main, "PRODUCTION", True):
            with self.assertRaises(RuntimeError):
                with TestClient(main.app):
                    pass

    def test_profile_persists_and_whitespace_is_rejected(self):
        self.assertEqual(self.client.patch("/api/me", json={"name": "   "}).status_code, 422)
        self.assertEqual(
            self.client.patch("/api/me", json={"name": " Asha Rao "}).json()["name"], "Asha Rao"
        )
        self.assertEqual(self.client.get("/api/me").json()["name"], "Asha Rao")

    def test_valid_tutor_reply_persists_and_quota_is_enforced(self):
        self.client.patch(
            "/api/me", json={"name": "Asha", "teaching_language": "hinglish", "exam_language": "hi"}
        )
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        provider_response = Mock()
        provider_response.raise_for_status.return_value = None
        provider_response.json.return_value = {
            "choices": [
                {
                    "message": {
                        "content": '{"reply":"What new substance do you think forms?","citations":["pilot-reactions-signs-v1:0"]}'
                    }
                }
            ]
        }
        provider = AsyncMock()
        provider.post.return_value = provider_response
        with (
            patch.object(main, "HF_URL", "https://test.endpoint"),
            patch.object(main, "HF_TOKEN", "test-only-token"),
            patch.object(main, "DAILY_TUTOR_LIMIT", 1),
            patch.object(main.httpx, "AsyncClient") as factory,
        ):
            factory.return_value.__aenter__.return_value = provider
            response = self.client.post(
                f"/api/lessons/{lesson['id']}/turn", json={"message": "I think the gas is new."}
            )
            self.assertEqual(response.status_code, 200)
            self.assertEqual(len(response.json()["messages"]), 2)
            limited = self.client.post(
                f"/api/lessons/{lesson['id']}/turn", json={"message": "Another question"}
            )
            self.assertEqual(limited.status_code, 429)
            self.assertEqual(provider.post.await_count, 1)
            prompt = provider.post.call_args.kwargs["json"]["messages"][0]["content"]
            self.assertIn("Teach in simple conversational Hinglish", prompt)
        resumed = self.client.post("/api/lessons/reactions-signs").json()
        self.assertEqual(
            resumed["messages"][1]["content"], "What new substance do you think forms?"
        )

    def test_invalid_model_reply_does_not_pollute_history(self):
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        provider_response = Mock()
        provider_response.raise_for_status.return_value = None
        provider_response.json.return_value = {
            "choices": [{"message": {"content": '{"reply":"Hello","score":100}'}}]
        }
        provider = AsyncMock()
        provider.post.return_value = provider_response
        with (
            patch.object(main, "HF_URL", "https://test.endpoint"),
            patch.object(main, "HF_TOKEN", "test-only-token"),
            patch.object(main.httpx, "AsyncClient") as factory,
        ):
            factory.return_value.__aenter__.return_value = provider
            response = self.client.post(
                f"/api/lessons/{lesson['id']}/turn", json={"message": "Explain this"}
            )
            self.assertEqual(response.status_code, 503)
        self.assertEqual(self.client.post("/api/lessons/reactions-signs").json()["messages"], [])

    def test_progress_checklist_is_ordered_idempotent_and_saved(self):
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        endpoint = f"/api/lessons/{lesson['id']}/steps"
        self.assertEqual(self.client.post(endpoint, json={"step": "reflect"}).status_code, 409)
        self.assertEqual(self.client.post(endpoint, json={"step": "unknown"}).status_code, 422)
        for step in ["read", "example", "reflect"]:
            self.assertEqual(self.client.post(endpoint, json={"step": step}).status_code, 200)
        self.assertEqual(
            self.client.post(endpoint, json={"step": "read"}).json()["completed_steps"],
            ["read", "example", "reflect"],
        )
        self.assertEqual(
            self.client.post("/api/lessons/reactions-signs").json()["completed_steps"],
            ["read", "example", "reflect"],
        )
        self.assertEqual(
            self.client.get("/api/progress").json()["completed_steps_by_topic"]["reactions-signs"],
            ["read", "example", "reflect"],
        )
        self.assertEqual(self.client.get("/api/progress").json()["attempts"], [])
        with TestClient(main.app) as second:
            second.post("/api/auth/local", json={"name": "Another learner"})
            self.assertEqual(second.post(endpoint, json={"step": "read"}).status_code, 404)

    def test_unknown_model_citation_is_rejected(self):
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        provider_response = Mock()
        provider_response.raise_for_status.return_value = None
        provider_response.json.return_value = {
            "choices": [
                {
                    "message": {
                        "content": '{"reply":"An explanation","citations":["invented-source"]}'
                    }
                }
            ]
        }
        provider = AsyncMock()
        provider.post.return_value = provider_response
        with (
            patch.object(main, "HF_URL", "https://test.endpoint"),
            patch.object(main, "HF_TOKEN", "test-only-token"),
            patch.object(main.httpx, "AsyncClient") as factory,
        ):
            factory.return_value.__aenter__.return_value = provider
            self.assertEqual(
                self.client.post(
                    f"/api/lessons/{lesson['id']}/turn", json={"message": "Explain reactions"}
                ).status_code,
                503,
            )
        self.assertEqual(self.client.post("/api/lessons/reactions-signs").json()["messages"], [])

    def test_retrieval_is_topic_scoped_and_drafts_are_excluded_in_production(self):
        from backend.app.database import SessionLocal
        from backend.app.grounding import retrieve

        with SessionLocal() as db:
            passages = retrieve(db, "reactions-signs", "magnesium burns")
            self.assertTrue(passages)
            self.assertTrue(all(p["id"].startswith("pilot-reactions-signs-v1:") for p in passages))
            self.assertEqual(retrieve(db, "reactions-signs", "magnesium", reviewed_only=True), [])
            self.assertEqual(retrieve(db, "not-a-topic", "magnesium"), [])

    def test_source_import_requires_rights_review_and_immutable_versions(self):
        from pydantic import ValidationError

        from backend.app.database import SessionLocal
        from backend.app.grounding import SourceImport, import_source, retrieve

        data = {
            "id": "reviewed-reactions-v1",
            "title": "Reviewed reaction note",
            "topic_id": "reactions-signs",
            "class_level": 10,
            "version": "v1",
            "rights": "Original test material",
            "rights_confirmed": True,
            "review_status": "reviewed",
            "reviewer": "Test educator",
            "passages": ["A reaction forms new substances."],
        }
        with self.assertRaises(ValidationError):
            SourceImport.model_validate({**data, "rights_confirmed": False})
        with self.assertRaises(ValidationError):
            SourceImport.model_validate({**data, "reviewer": None})
        with SessionLocal.begin() as db:
            import_source(db, SourceImport.model_validate(data))
        with SessionLocal() as db:
            self.assertEqual(
                len(retrieve(db, "reactions-signs", "reaction", reviewed_only=True)), 1
            )
            import_source(db, SourceImport.model_validate(data))
            with self.assertRaises(ValueError):
                import_source(
                    db, SourceImport.model_validate({**data, "passages": ["A changed passage."]})
                )


if __name__ == "__main__":
    unittest.main()
