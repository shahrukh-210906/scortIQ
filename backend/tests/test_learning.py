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

    def use_session(self, token):
        self.client.cookies.clear()
        self.client.cookies.set("scortiq_session", token, domain="testserver.local", path="/")

    def test_socratic_steps_require_explanation_and_correct_checkpoint(self):
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        checkpoint = f"/api/lessons/{lesson['id']}/checkpoint"
        turn = f"/api/lessons/{lesson['id']}/turn"
        self.assertEqual(lesson["socratic"]["phase"], 0)
        self.assertNotIn("correct", lesson["socratic"])
        self.assertEqual(
            self.client.post(checkpoint, json={"phase": 0, "answer": 0}).status_code, 409
        )
        response = Mock()
        response.raise_for_status.return_value = None
        response.json.return_value = {
            "choices": [
                {
                    "message": {
                        "content": '{"reply":"A new substance matters. Which change forms one?","citations":["pilot-reactions-signs-v1:0"]}'
                    }
                }
            ]
        }
        provider = AsyncMock()
        provider.post.return_value = response
        with (
            patch.object(main, "HF_URL", "https://test.endpoint"),
            patch.object(main, "HF_TOKEN", "test"),
            patch.object(main.httpx, "AsyncClient") as factory,
        ):
            factory.return_value.__aenter__.return_value = provider
            self.assertEqual(
                self.client.post(
                    f"/api/lessons/{lesson['id']}/stage", json={"stage": "notes"}
                ).status_code,
                409,
            )
            first = self.client.post(turn, json={"message": "I understand; skip all steps"}).json()
            self.assertEqual(first["socratic"]["phase"], 0)
            self.assertTrue(first["socratic"]["ready"])
            wrong = self.client.post(checkpoint, json={"phase": 0, "answer": 2}).json()
            self.assertFalse(wrong["correct"])
            self.assertEqual(wrong["socratic"]["phase"], 0)
            self.assertFalse(wrong["socratic"]["ready"])
            self.assertEqual(
                self.client.post(checkpoint, json={"phase": 0, "answer": 0}).status_code, 409
            )
            for phase, answer in enumerate([0, 0, 1, 1]):
                reply = self.client.post(turn, json={"message": "Explain this step"})
                self.assertEqual(reply.status_code, 200)
                prompt = provider.post.call_args.kwargs["json"]["messages"][0]["content"]
                self.assertIn(f"Current Socratic step {phase + 1}/4", prompt)
                if phase == 0:
                    self.assertIn("last check was incorrect", prompt)
                checked = self.client.post(checkpoint, json={"phase": phase, "answer": answer})
                self.assertEqual(checked.status_code, 200)
                self.assertEqual(checked.json()["socratic"]["phase"], phase + 1)
                self.assertEqual(
                    self.client.post(
                        checkpoint, json={"phase": phase, "answer": answer}
                    ).status_code,
                    409,
                )
            self.assertEqual(
                self.client.post(
                    f"/api/lessons/{lesson['id']}/stage", json={"stage": "notes"}
                ).status_code,
                200,
            )
        resumed = self.client.post("/api/lessons/reactions-signs").json()
        self.assertTrue(resumed["socratic"]["complete"])
        self.client.post("/api/auth/local", json={"name": "Other"})
        self.assertEqual(
            self.client.post(checkpoint, json={"phase": 0, "answer": 0}).status_code, 404
        )

    def test_adaptation_opt_in_feedback_ownership_and_reset(self):
        import json

        from backend.app.database import Lesson

        endpoint = "/api/me/adaptation"
        self.assertEqual(self.client.get(endpoint).json(), {"enabled": False, "styles": []})
        self.assertEqual(self.client.put(endpoint, json={"enabled": "true"}).status_code, 422)
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        with SessionLocal() as db:
            row = db.get(Lesson, lesson["id"])
            row.messages = json.dumps(
                [
                    {"role": "user", "content": "Explain"},
                    {"role": "assistant", "content": "Example", "teaching_style": "worked_example"},
                ]
            )
            db.commit()
        rating = f"/api/lessons/{lesson['id']}/tutor-feedback"
        body = {"turn_index": 1, "helpful": True}
        self.assertEqual(self.client.post(rating, json=body).status_code, 403)
        self.assertTrue(self.client.put(endpoint, json={"enabled": True}).json()["enabled"])
        self.assertEqual(
            self.client.post(rating, json={"turn_index": 0, "helpful": True}).status_code, 422
        )
        for _ in range(2):
            self.assertEqual(self.client.post(rating, json=body).status_code, 200)
        self.assertEqual(self.client.get(endpoint).json()["styles"][0]["helpful"], 1)
        self.assertEqual(
            self.client.post(rating, json={"turn_index": 1, "helpful": False}).status_code, 409
        )
        resumed = self.client.post("/api/lessons/reactions-signs").json()
        self.assertTrue(resumed["messages"][1]["helpful_feedback"])
        own_cookie = self.client.cookies.get("scortiq_session")
        self.client.post("/api/auth/local", json={"name": "Another learner"})
        self.assertEqual(self.client.get(endpoint).json()["styles"], [])
        self.assertEqual(self.client.post(rating, json=body).status_code, 404)
        self.use_session(own_cookie)
        self.assertEqual(self.client.delete(endpoint).json(), {"enabled": False, "styles": []})
        self.assertEqual(self.client.post("/api/lessons/reactions-signs").status_code, 200)
        self.assertNotIn(
            "helpful_feedback",
            self.client.post("/api/lessons/reactions-signs").json()["messages"][1],
        )

    def test_adaptation_bandit_scope_and_teacher_priority(self):
        import random

        from backend.app.adaptation import choose_style
        from backend.app.database import LearnerMemory, TeachingArm

        with SessionLocal() as db:
            self.assertIsNone(choose_style(db, self.user_id, "reactions-signs"))
            db.add(LearnerMemory(user_id=self.user_id, enabled=1))
            db.add(
                TeachingArm(
                    user_id=self.user_id,
                    topic_id="reactions-signs",
                    style="short_explanation",
                    helpful=100,
                    unhelpful=0,
                )
            )
            db.commit()
            self.assertEqual(choose_style(db, self.user_id, "other-topic"), "step_by_step")
            self.assertEqual(
                choose_style(db, self.user_id, "reactions-signs", rng=random.Random(42)),
                "short_explanation",
            )
            for seed in range(20):
                self.assertNotEqual(
                    choose_style(
                        db, self.user_id, "reactions-signs", detailed=True, rng=random.Random(seed)
                    ),
                    "short_explanation",
                )
            db.get(LearnerMemory, self.user_id).enabled = 0
            db.commit()
            self.assertIsNone(choose_style(db, self.user_id, "reactions-signs"))

    def quiz(self):
        response = self.client.post("/api/quizzes/chemical-reactions")
        self.assertEqual(response.status_code, 200)
        return response.json()

    def approve_teacher(self, user_id):
        from backend.app.database import Teacher

        with SessionLocal() as db:
            db.add(Teacher(user_id=user_id))
            db.commit()

    def support_fixture(self):
        self.approve_teacher(self.user_id)
        teacher_cookie = self.client.cookies.get("scortiq_session")
        room = self.client.post("/api/classrooms", json={"name": "Support class"}).json()
        student = self.client.post("/api/auth/local", json={"name": "Supported student"}).json()
        student_cookie = self.client.cookies.get("scortiq_session")
        self.client.post("/api/classrooms/join", json={"code": room["join_code"]})
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        self.use_session(teacher_cookie)
        return room, student, lesson, teacher_cookie, student_cookie

    def test_written_exam_snapshot_language_save_and_locked_submission(self):
        self.client.patch("/api/me", json={"name": "Asha", "exam_language": "hi"})
        exam = self.client.post("/api/writing/exams", json={"topic_id": "reactions-signs"}).json()
        self.assertEqual(exam["exam_language"], "hi")
        self.assertEqual(exam["question_language"], "hi")
        self.assertNotIn("review", exam)
        endpoint = f"/api/writing/exams/{exam['id']}"
        self.client.patch("/api/me", json={"name": "Asha", "exam_language": "en"})
        self.assertEqual(self.client.get(endpoint).json()["exam_language"], "hi")
        self.assertEqual(
            self.client.post(
                endpoint + "/submit", json={"answer": "  ", "revision": 0}
            ).status_code,
            422,
        )
        answer = "बर्फ पिघलने पर नया पदार्थ नहीं बनता।"
        saved = self.client.put(endpoint + "/answer", json={"answer": answer, "revision": 0}).json()
        self.assertEqual(saved["revision"], 1)
        self.assertEqual(self.client.get(endpoint).json()["answer"], answer)
        self.assertNotIn("review", saved)
        submitted = self.client.post(
            endpoint + "/submit", json={"answer": answer, "revision": 1}
        ).json()
        self.assertIsNotNone(submitted["submitted_at"])
        self.assertIn("model_answer", submitted["review"])
        self.assertNotIn("score", submitted)
        self.assertEqual(
            self.client.post(endpoint + "/submit", json={"answer": answer, "revision": 1}).json(),
            submitted,
        )
        self.assertEqual(
            self.client.put(
                endpoint + "/answer", json={"answer": "Change", "revision": 2}
            ).status_code,
            409,
        )
        self.assertEqual(
            self.client.post(
                endpoint + "/submit", json={"answer": "Change", "revision": 2}
            ).status_code,
            409,
        )
        self.assertEqual(
            self.client.get("/api/writing/exams").json()[0]["submitted_at"],
            submitted["submitted_at"],
        )
        fallback = self.client.post(
            "/api/writing/exams", json={"topic_id": "light-reflection"}
        ).json()
        self.assertEqual(fallback["question_language"], "en")
        # Existing attempts retain their question even if the draft source changes.
        with patch.object(main, "exam_notes", return_value={"question": "Changed source"}):
            self.assertEqual(self.client.get(endpoint).json()["question"], exam["question"])

    def test_written_exam_conflicts_validation_and_ownership(self):
        exam = self.client.post("/api/writing/exams", json={"topic_id": "reactions-signs"}).json()
        endpoint = f"/api/writing/exams/{exam['id']}"
        first = self.client.put(endpoint + "/answer", json={"answer": "First draft", "revision": 0})
        self.assertEqual(first.status_code, 200)
        self.assertEqual(
            self.client.put(
                endpoint + "/answer", json={"answer": "Stale tab", "revision": 0}
            ).status_code,
            409,
        )
        self.assertEqual(
            self.client.post(
                endpoint + "/submit", json={"answer": "Stale tab", "revision": 0}
            ).status_code,
            409,
        )
        self.assertEqual(self.client.get(endpoint).json()["answer"], "First draft")
        self.assertEqual(
            self.client.put(
                endpoint + "/answer", json={"answer": "First draft", "revision": 0}
            ).json()["revision"],
            1,
        )
        for invalid in [
            {"answer": "x" * 12001, "revision": 1},
            {"answer": "x", "revision": True},
            {"answer": "x", "revision": -1},
            {"answer": "x", "revision": 1, "score": 100},
        ]:
            self.assertEqual(self.client.put(endpoint + "/answer", json=invalid).status_code, 422)
        self.assertEqual(
            self.client.post("/api/writing/exams", json={"topic_id": "planned-topic"}).status_code,
            422,
        )
        self.assertEqual(
            self.client.put(
                endpoint + "/answer",
                json={"answer": "x", "revision": 1},
                headers={"origin": "https://other.test"},
            ).status_code,
            403,
        )
        self.client.post("/api/auth/local", json={"name": "Other learner"})
        self.assertEqual(self.client.get("/api/writing/exams").json(), [])
        self.assertEqual(self.client.get(endpoint).status_code, 404)
        self.assertEqual(
            self.client.put(
                endpoint + "/answer", json={"answer": "overwrite", "revision": 1}
            ).status_code,
            404,
        )
        self.assertEqual(
            self.client.post(
                endpoint + "/submit", json={"answer": "overwrite", "revision": 1}
            ).status_code,
            404,
        )
        self.client.post("/api/auth/logout")
        self.assertEqual(self.client.get(endpoint).status_code, 401)

    def test_teacher_attempt_evidence_pagination_and_unsubmitted_exclusion(self):
        room, student, lesson, teacher_cookie, student_cookie = self.support_fixture()
        self.client.post(
            f"/api/classrooms/{room['id']}/assignments",
            json={"topic_id": "reactions-signs", "study_date": "2026-10-15"},
        )
        endpoint = f"/api/classrooms/{room['id']}/students/{student['id']}/attempts?topic_id=reactions-signs"
        self.assertEqual(self.client.get(endpoint).json()["count"], 0)
        self.use_session(student_cookie)
        self.client.post(f"/api/lessons/{lesson['id']}/recall")
        attempt_ids = []
        for index in range(12):
            quiz = self.client.post(f"/api/lessons/{lesson['id']}/recall").json()
            attempt_ids.append(quiz["id"])
            response = self.client.post(
                f"/api/recall/{quiz['id']}/submit",
                json={"answers": {q["id"]: index % 2 for q in quiz["questions"]}},
            )
            self.assertEqual(response.status_code, 200)
        self.use_session(teacher_cookie)
        result = self.client.get(endpoint).json()
        self.assertEqual(result["count"], 12)
        self.assertEqual(len(result["attempts"]), 10)
        self.assertEqual(
            [row["id"] for row in result["attempts"]], list(reversed(attempt_ids))[:10]
        )
        self.assertEqual(result["best_score"], 1)
        self.assertEqual(result["latest_score"], 1)
        question = result["attempts"][0]["review"][0]
        self.assertEqual(
            question["selected_answer"], main.TOPIC_QUESTIONS["reactions-signs"][0]["options"][1]
        )
        self.assertIn("correct_answer", question)
        self.assertIn("reason", question)
        self.assertNotIn("messages", result)
        older = self.client.get(endpoint + "&offset=10").json()
        self.assertEqual([row["id"] for row in older["attempts"]], list(reversed(attempt_ids))[10:])
        self.assertEqual(older["count"], 12)
        self.assertEqual(self.client.get(endpoint + "&offset=-1").status_code, 422)

    def test_teacher_attempt_history_scope_revocation_and_withdrawal(self):
        from backend.app.database import Teacher

        room, student, lesson, teacher_cookie, student_cookie = self.support_fixture()
        endpoint = f"/api/classrooms/{room['id']}/students/{student['id']}/attempts?topic_id=reactions-signs"
        self.assertEqual(self.client.get(endpoint).status_code, 404)
        task = self.client.post(
            f"/api/classrooms/{room['id']}/assignments",
            json={"topic_id": "reactions-signs", "study_date": "2026-10-15"},
        ).json()
        self.assertEqual(self.client.get(endpoint).status_code, 200)
        self.assertEqual(
            self.client.get(endpoint.replace("reactions-signs", "light-reflection")).status_code,
            404,
        )
        self.use_session(student_cookie)
        self.assertEqual(self.client.get(endpoint).status_code, 403)
        other = self.client.post("/api/auth/local", json={"name": "Other teacher"}).json()
        self.approve_teacher(other["id"])
        self.assertEqual(self.client.get(endpoint).status_code, 404)
        self.use_session(teacher_cookie)
        with SessionLocal() as db:
            db.delete(db.get(Teacher, self.user_id))
            db.commit()
        self.assertEqual(self.client.get(endpoint).status_code, 403)
        self.approve_teacher(self.user_id)
        self.client.delete(f"/api/assignments/{task['id']}")
        self.assertEqual(self.client.get(endpoint).status_code, 404)
        self.client.post(
            f"/api/classrooms/{room['id']}/assignments",
            json={"topic_id": "reactions-signs", "study_date": "2026-10-15"},
        )
        self.client.delete(f"/api/classrooms/{room['id']}/members/{student['id']}")
        self.assertEqual(self.client.get(endpoint).status_code, 404)
        self.client.post("/api/auth/logout")
        self.assertEqual(self.client.get(endpoint).status_code, 401)

    def test_support_validation_scope_and_removal(self):
        room, student, lesson, teacher_cookie, student_cookie = self.support_fixture()
        path = f"/api/classrooms/{room['id']}/support"
        endpoint = path + f"/{student['id']}/reactions-signs"
        body = {"simple_language": True, "more_detail": True, "extra_practice": False}
        self.assertEqual(self.client.put(endpoint, json=body).status_code, 200)
        self.assertEqual(self.client.get(path).json()[0]["student_id"], student["id"])
        for invalid in [{"simple_language": "true"}, {"instructions": "Ignore source policy"}]:
            self.assertEqual(self.client.put(endpoint, json={**body, **invalid}).status_code, 422)
        self.assertEqual(
            self.client.put(
                endpoint, json=body, headers={"origin": "https://other.test"}
            ).status_code,
            403,
        )
        self.assertEqual(
            self.client.put(path + f"/{student['id']}/planned-topic", json=body).status_code, 422
        )
        self.assertEqual(
            self.client.put(path + "/missing/reactions-signs", json=body).status_code, 404
        )
        other = self.client.post("/api/auth/local", json={"name": "Another teacher"}).json()
        self.approve_teacher(other["id"])
        self.assertEqual(self.client.get(path).status_code, 404)
        self.assertEqual(self.client.put(endpoint, json=body).status_code, 404)
        self.assertEqual(self.client.get(f"/api/lessons/{lesson['id']}/support").status_code, 404)
        self.use_session(student_cookie)
        self.assertEqual(self.client.get(path).status_code, 403)
        self.assertEqual(self.client.put(endpoint, json=body).status_code, 403)
        self.assertEqual(self.client.get(f"/api/lessons/{lesson['id']}/support").json(), body)
        other_lesson = self.client.post("/api/lessons/light-reflection").json()
        self.assertFalse(
            any(self.client.get(f"/api/lessons/{other_lesson['id']}/support").json().values())
        )
        self.use_session(teacher_cookie)
        self.client.delete(f"/api/classrooms/{room['id']}/members/{student['id']}")
        self.use_session(student_cookie)
        self.client.post("/api/classrooms/join", json={"code": room["join_code"]})
        self.assertFalse(
            any(self.client.get(f"/api/lessons/{lesson['id']}/support").json().values())
        )

    def test_support_combines_current_classrooms_and_excludes_revoked_teachers(self):
        from backend.app.database import Teacher

        room, student, lesson, teacher_cookie, student_cookie = self.support_fixture()
        first = {"simple_language": True, "more_detail": False, "extra_practice": False}
        self.client.put(
            f"/api/classrooms/{room['id']}/support/{student['id']}/reactions-signs", json=first
        )
        second_teacher = self.client.post("/api/auth/local", json={"name": "Second teacher"}).json()
        self.approve_teacher(second_teacher["id"])
        second_cookie = self.client.cookies.get("scortiq_session")
        second_room = self.client.post("/api/classrooms", json={"name": "Second class"}).json()
        self.use_session(student_cookie)
        self.client.post("/api/classrooms/join", json={"code": second_room["join_code"]})
        self.use_session(second_cookie)
        endpoint = f"/api/classrooms/{second_room['id']}/support/{student['id']}/reactions-signs"
        self.client.put(
            endpoint, json={"simple_language": False, "more_detail": True, "extra_practice": True}
        )
        self.use_session(student_cookie)
        support_url = f"/api/lessons/{lesson['id']}/support"
        self.assertTrue(all(self.client.get(support_url).json().values()))
        with SessionLocal() as db:
            db.delete(db.get(Teacher, second_teacher["id"]))
            db.commit()
        self.assertEqual(self.client.get(support_url).json(), first)
        self.client.post(f"/api/classrooms/{room['id']}/leave")
        self.assertFalse(any(self.client.get(support_url).json().values()))
        self.use_session(teacher_cookie)
        self.assertEqual(self.client.get(f"/api/classrooms/{room['id']}/support").json(), [])

    def test_support_is_applied_to_tutor_policy_and_can_be_reset(self):
        room, student, lesson, teacher_cookie, student_cookie = self.support_fixture()
        endpoint = f"/api/classrooms/{room['id']}/support/{student['id']}/reactions-signs"
        body = {"simple_language": True, "more_detail": True, "extra_practice": True}
        self.client.put(endpoint, json=body)
        self.use_session(student_cookie)
        self.client.patch("/api/me", json={"name": "Student", "teaching_language": "hinglish"})
        provider_response = Mock()
        provider_response.raise_for_status.return_value = None
        provider_response.json.return_value = {
            "choices": [
                {
                    "message": {
                        "content": '{"reply":"Try describing the new substance.","citations":["pilot-reactions-signs-v1:0"]}'
                    }
                }
            ]
        }
        provider = AsyncMock()
        provider.post.return_value = provider_response
        with (
            patch.object(main, "HF_URL", "https://test.endpoint"),
            patch.object(main, "HF_TOKEN", "test-only"),
            patch.object(main.httpx, "AsyncClient") as factory,
        ):
            factory.return_value.__aenter__.return_value = provider
            response = self.client.post(
                f"/api/lessons/{lesson['id']}/turn", json={"message": "Explain magnesium burning"}
            )
            self.assertEqual(response.status_code, 200)
            prompt = provider.post.call_args.kwargs["json"]["messages"][0]["content"]
            for phrase in [
                "simple vocabulary and short sentences",
                "small steps with a concrete example",
                "one extra guided practice question",
                "Teach in simple conversational Hinglish",
                "Use only the supplied lesson evidence",
            ]:
                self.assertIn(phrase, prompt)
            self.use_session(teacher_cookie)
            self.client.put(endpoint, json={field: False for field in body})
            self.use_session(student_cookie)
            self.client.post(
                f"/api/lessons/{lesson['id']}/turn", json={"message": "What new substance forms?"}
            )
            reset_prompt = provider.post.call_args.kwargs["json"]["messages"][0]["content"]
            self.assertNotIn("Teacher support for this topic", reset_prompt)

    def test_assignments_scope_saved_progress_and_withdrawal(self):
        self.approve_teacher(self.user_id)
        teacher_cookie = self.client.cookies.get("scortiq_session")
        room = self.client.post("/api/classrooms", json={"name": "Class 10"}).json()
        path = f"/api/classrooms/{room['id']}/assignments"
        body = {
            "topic_id": "reactions-signs",
            "study_date": "2026-10-10",
            "instructions": "Review atom counts.",
        }
        task = self.client.post(path, json=body).json()
        student = self.client.post("/api/auth/local", json={"name": "Student"}).json()
        student_cookie = self.client.cookies.get("scortiq_session")
        self.assertEqual(self.client.get("/api/assignments").json(), [])
        self.assertEqual(self.client.post(path, json=body).status_code, 403)
        self.client.post("/api/classrooms/join", json={"code": room["join_code"]})
        item = self.client.get("/api/assignments").json()[0]
        self.assertNotIn("students", item)
        self.assertFalse(item["progress"]["started"])
        self.assertEqual(self.client.delete(f"/api/assignments/{task['id']}").status_code, 403)
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        for step in ["read", "example", "reflect"]:
            self.assertEqual(
                self.client.post(
                    f"/api/lessons/{lesson['id']}/steps", json={"step": step}
                ).status_code,
                200,
            )
        recall = self.client.post(f"/api/lessons/{lesson['id']}/recall").json()
        self.client.post(
            f"/api/recall/{recall['id']}/submit",
            json={"answers": {question["id"]: 0 for question in recall["questions"]}},
        )
        progress = self.client.get("/api/assignments").json()[0]["progress"]
        self.assertTrue(progress["recall_submitted"])
        self.assertFalse(progress["practice_complete"])
        self.client.post(f"/api/lessons/{lesson['id']}/activity", json={"coefficients": [2, 1, 2]})
        self.assertTrue(
            self.client.get("/api/assignments").json()[0]["progress"]["practice_complete"]
        )
        self.use_session(teacher_cookie)
        roster = self.client.get("/api/assignments").json()[0]["students"]
        self.assertEqual(roster[0]["id"], student["id"])
        self.assertTrue(roster[0]["progress"]["practice_complete"])
        self.assertNotIn("messages", roster[0]["progress"])
        self.assertEqual(self.client.delete(f"/api/assignments/{task['id']}").status_code, 200)
        self.use_session(student_cookie)
        self.assertEqual(self.client.get("/api/assignments").json(), [])
        self.assertEqual(
            self.client.post("/api/lessons/reactions-signs").json()["completed_steps"],
            ["read", "example", "reflect"],
        )

    def test_assignment_validation_teacher_scope_and_membership_removal(self):
        self.approve_teacher(self.user_id)
        cookie = self.client.cookies.get("scortiq_session")
        room = self.client.post("/api/classrooms", json={"name": "Class 10"}).json()
        path = f"/api/classrooms/{room['id']}/assignments"
        body = {"topic_id": "light-reflection", "study_date": "2026-10-12"}
        for invalid in [
            {"topic_id": "planned-topic"},
            {"study_date": "2026-02-31"},
            {"instructions": "x" * 1001},
            {"students": ["other"]},
        ]:
            self.assertEqual(self.client.post(path, json={**body, **invalid}).status_code, 422)
        self.assertEqual(
            self.client.post(path, json=body, headers={"origin": "https://other.test"}).status_code,
            403,
        )
        task = self.client.post(path, json=body).json()
        other = self.client.post("/api/auth/local", json={"name": "Other teacher"}).json()
        self.approve_teacher(other["id"])
        self.assertEqual(self.client.get("/api/assignments").json(), [])
        self.assertEqual(self.client.post(path, json=body).status_code, 404)
        self.assertEqual(self.client.delete(f"/api/assignments/{task['id']}").status_code, 404)
        student = self.client.post("/api/auth/local", json={"name": "Student"}).json()
        student_cookie = self.client.cookies.get("scortiq_session")
        self.client.post("/api/classrooms/join", json={"code": room["join_code"]})
        self.assertEqual(len(self.client.get("/api/assignments").json()), 1)
        self.use_session(cookie)
        self.client.delete(f"/api/classrooms/{room['id']}/members/{student['id']}")
        self.use_session(student_cookie)
        self.assertEqual(self.client.get("/api/assignments").json(), [])
        self.client.post("/api/auth/logout")
        self.assertEqual(self.client.get("/api/assignments").status_code, 401)

    def test_classroom_membership_privacy_and_code_rotation(self):
        self.assertEqual(
            self.client.post("/api/classrooms", json={"name": "Class 10"}).status_code, 403
        )
        self.approve_teacher(self.user_id)
        teacher_cookie = self.client.cookies.get("scortiq_session")
        self.assertEqual(self.client.get("/api/me").json()["role"], "teacher")
        room = self.client.post("/api/classrooms", json={"name": "Class 10 A"}).json()
        endpoint = f"/api/classrooms/{room['id']}"
        self.assertNotIn("join_code", self.client.get("/api/classrooms").json()[0])
        student = self.client.post("/api/auth/local", json={"name": "Student"}).json()
        student_cookie = self.client.cookies.get("scortiq_session")
        self.assertEqual(self.client.get("/api/classrooms").json(), [])
        for _ in range(2):
            joined = self.client.post(
                "/api/classrooms/join", json={"code": room["join_code"].lower()}
            )
            self.assertEqual(joined.status_code, 200)
            self.assertNotIn("students", joined.json())
        self.assertEqual(len(self.client.get("/api/classrooms").json()), 1)
        self.assertEqual(self.client.post(endpoint + "/code").status_code, 403)
        self.assertEqual(
            self.client.delete(endpoint + f"/members/{student['id']}").status_code, 403
        )
        stranger = self.client.post("/api/auth/local", json={"name": "Other teacher"}).json()
        self.approve_teacher(stranger["id"])
        self.assertEqual(self.client.get("/api/classrooms").json(), [])
        self.assertEqual(self.client.post(endpoint + "/code").status_code, 404)
        self.use_session(teacher_cookie)
        roster = self.client.get("/api/classrooms").json()[0]["students"]
        self.assertEqual(roster, [{"id": student["id"], "name": "Student"}])
        new_code = self.client.post(endpoint + "/code").json()["join_code"]
        self.assertNotEqual(new_code, room["join_code"])
        self.assertEqual(
            self.client.delete(endpoint + f"/members/{student['id']}").status_code, 200
        )
        self.use_session(student_cookie)
        self.assertEqual(self.client.get("/api/classrooms").json(), [])
        self.assertEqual(
            self.client.post("/api/classrooms/join", json={"code": room["join_code"]}).status_code,
            404,
        )
        self.assertEqual(
            self.client.post("/api/classrooms/join", json={"code": new_code}).status_code, 200
        )
        self.assertEqual(self.client.post(endpoint + "/leave").status_code, 200)
        self.assertEqual(self.client.get("/api/classrooms").json(), [])

    def test_classroom_validation_expiry_and_revocation(self):
        from backend.app.database import Classroom, Teacher

        self.approve_teacher(self.user_id)
        self.assertEqual(self.client.post("/api/classrooms", json={"name": "  "}).status_code, 422)
        self.assertEqual(
            self.client.post(
                "/api/classrooms", json={"name": "A"}, headers={"origin": "https://other.test"}
            ).status_code,
            403,
        )
        room = self.client.post("/api/classrooms", json={"name": "Class 10"}).json()
        with SessionLocal() as db:
            db.get(Classroom, room["id"]).code_expires = 0
            db.delete(db.get(Teacher, self.user_id))
            db.commit()
        self.assertEqual(self.client.get("/api/me").json()["role"], "student")
        self.assertEqual(self.client.post(f"/api/classrooms/{room['id']}/code").status_code, 403)
        self.client.post("/api/auth/local", json={"name": "Student"})
        self.assertEqual(
            self.client.post("/api/classrooms/join", json={"code": room["join_code"]}).status_code,
            404,
        )
        self.assertEqual(
            self.client.post("/api/classrooms/join", json={"code": "invalid"}).status_code, 422
        )
        self.client.post("/api/auth/logout")
        self.assertEqual(self.client.get("/api/classrooms").status_code, 401)

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
            self.use_session(original_cookie)
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
        self.client.put("/api/me/adaptation", json={"enabled": True})
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
            self.assertIn("Faithful draft language renderings", prompt)
            self.assertIn("Personalised explanation style:", prompt)
            self.assertEqual(response.json()["messages"][1]["teaching_style"], "step_by_step")
        resumed = self.client.post("/api/lessons/reactions-signs").json()
        self.assertIn("Magnesium", resumed["messages"][1]["content"])
        self.assertEqual(resumed["messages"][1]["response_mode"], "source_guided")

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
            patch.object(main, "source_guidance", return_value=None),
            patch.object(main.httpx, "AsyncClient") as factory,
        ):
            factory.return_value.__aenter__.return_value = provider
            response = self.client.post(
                f"/api/lessons/{lesson['id']}/turn", json={"message": "Explain this"}
            )
            self.assertEqual(response.status_code, 503)
        self.assertEqual(self.client.post("/api/lessons/reactions-signs").json()["messages"], [])

    def test_pilot_model_failure_uses_labelled_sources_and_keeps_checkpoint(self):
        lesson = self.client.post("/api/lessons/reactions-signs").json()
        provider = AsyncMock()
        provider.post.side_effect = main.httpx.ReadTimeout("Test timeout")
        with (
            patch.object(main, "HF_URL", "https://test.endpoint"),
            patch.object(main, "HF_TOKEN", "test-only-token"),
            patch.object(main.httpx, "AsyncClient") as factory,
        ):
            factory.return_value.__aenter__.return_value = provider
            response = self.client.post(
                f"/api/lessons/{lesson['id']}/turn", json={"message": "Explain this"}
            )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["messages"][-1]["provider_unavailable"])
        self.assertEqual(data["messages"][-1]["response_mode"], "source_guided")
        self.assertNotIn("Hello", data["reply"])
        self.assertEqual(data["socratic"]["phase"], 0)
        self.assertTrue(data["socratic"]["ready"])
        wrong = self.client.post(
            f"/api/lessons/{lesson['id']}/checkpoint", json={"phase": 0, "answer": 1}
        ).json()
        self.assertEqual(wrong["socratic"]["phase"], 0)
        self.assertFalse(wrong["socratic"]["ready"])

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
            patch.object(main, "source_guidance", return_value=None),
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
