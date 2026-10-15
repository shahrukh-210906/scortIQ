import os
from pathlib import Path

from sqlalchemy import (
    BigInteger,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    create_engine,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./backend/.data/scortiq.db")
if DATABASE_URL.startswith("sqlite"):
    Path("backend/.data").mkdir(parents=True, exist_ok=True)
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    identity: Mapped[str] = mapped_column(String(255), unique=True)
    name: Mapped[str] = mapped_column(String(80))


class Teacher(Base):
    __tablename__ = "teachers"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)


class Classroom(Base):
    __tablename__ = "classrooms"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    teacher_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(80))
    code_hash: Mapped[str] = mapped_column(String(64), unique=True)
    code_expires: Mapped[int] = mapped_column(Integer)


class SupportSetting(Base):
    __tablename__ = "support_settings"
    classroom_id: Mapped[str] = mapped_column(ForeignKey("classrooms.id"), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    topic_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    simple_language: Mapped[int] = mapped_column(Integer)
    more_detail: Mapped[int] = mapped_column(Integer)
    extra_practice: Mapped[int] = mapped_column(Integer)


class Assignment(Base):
    __tablename__ = "assignments"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    classroom_id: Mapped[str] = mapped_column(ForeignKey("classrooms.id"), index=True)
    topic_id: Mapped[str] = mapped_column(String(80))
    study_date: Mapped[str] = mapped_column(String(10))
    instructions: Mapped[str] = mapped_column(Text)
    created_at: Mapped[int] = mapped_column(Integer)
    archived: Mapped[int] = mapped_column(Integer, default=0)


class Membership(Base):
    __tablename__ = "memberships"
    classroom_id: Mapped[str] = mapped_column(ForeignKey("classrooms.id"), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)


class LearnerMemory(Base):
    __tablename__ = "learner_memory"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    enabled: Mapped[int] = mapped_column(Integer, default=0)


class SocraticState(Base):
    __tablename__ = "socratic_states"
    lesson_id: Mapped[str] = mapped_column(ForeignKey("lessons.id"), primary_key=True)
    phase: Mapped[int] = mapped_column(Integer, default=0)
    taught_phase: Mapped[int] = mapped_column(Integer, default=-1)
    last_wrong: Mapped[int | None] = mapped_column(Integer, nullable=True)


class TeachingArm(Base):
    __tablename__ = "teaching_arms"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    topic_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    style: Mapped[str] = mapped_column(String(30), primary_key=True)
    helpful: Mapped[int] = mapped_column(Integer, default=0)
    unhelpful: Mapped[int] = mapped_column(Integer, default=0)


class TutorRating(Base):
    __tablename__ = "tutor_ratings"
    lesson_id: Mapped[str] = mapped_column(ForeignKey("lessons.id"), primary_key=True)
    turn_index: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    style: Mapped[str] = mapped_column(String(30))
    helpful: Mapped[int] = mapped_column(Integer)


class Preferences(Base):
    __tablename__ = "preferences"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    teaching_language: Mapped[str] = mapped_column(String(10), default="en")
    exam_language: Mapped[str] = mapped_column(String(10), default="en")


class Session(Base):
    __tablename__ = "sessions"
    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    expires: Mapped[int] = mapped_column(Integer)


class AuthChallenge(Base):
    __tablename__ = "auth_challenges"
    token_hash: Mapped[str] = mapped_column(String(64), primary_key=True)
    email_hash: Mapped[str] = mapped_column(String(64), index=True)
    created_at: Mapped[int] = mapped_column(Integer)
    expires: Mapped[int] = mapped_column(Integer)
    attempts: Mapped[int] = mapped_column(Integer, default=0)


class Bookmark(Base):
    __tablename__ = "bookmarks"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    topic_id: Mapped[str] = mapped_column(String(80), primary_key=True)
    created_at: Mapped[int] = mapped_column(Integer)


class Feedback(Base):
    __tablename__ = "feedback"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    topic_id: Mapped[str] = mapped_column(String(80))
    category: Mapped[str] = mapped_column(String(30))
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[int] = mapped_column(Integer)


class Lesson(Base):
    __tablename__ = "lessons"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    topic_id: Mapped[str] = mapped_column(String(80))
    messages: Mapped[str] = mapped_column(Text, default="[]")
    created_at: Mapped[int] = mapped_column(Integer)
    __table_args__ = (UniqueConstraint("user_id", "topic_id"),)


class WritingExam(Base):
    __tablename__ = "writing_exams"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    topic_id: Mapped[str] = mapped_column(String(80))
    exam_language: Mapped[str] = mapped_column(String(10))
    paper: Mapped[str] = mapped_column(Text)
    answer: Mapped[str] = mapped_column(Text, default="")
    revision: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[int] = mapped_column(Integer)
    submitted_at: Mapped[int | None] = mapped_column(Integer, nullable=True)


class Reflection(Base):
    __tablename__ = "reflections"
    lesson_id: Mapped[str] = mapped_column(ForeignKey("lessons.id"), primary_key=True)
    answer: Mapped[str] = mapped_column(Text)
    updated_at: Mapped[int] = mapped_column(Integer)


class Journey(Base):
    __tablename__ = "journeys"
    lesson_id: Mapped[str] = mapped_column(ForeignKey("lessons.id"), primary_key=True)
    active_stage: Mapped[str] = mapped_column(String(20), default="understand")
    activity_completed: Mapped[int] = mapped_column(Integer, default=0)


class RecallAttempt(Base):
    __tablename__ = "recall_attempts"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    lesson_id: Mapped[str] = mapped_column(ForeignKey("lessons.id"), index=True)
    answers: Mapped[str | None] = mapped_column(Text, nullable=True)
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[int] = mapped_column(BigInteger)


class Attempt(Base):
    __tablename__ = "attempts"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), index=True)
    chapter_id: Mapped[str] = mapped_column(String(80))
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    total: Mapped[int] = mapped_column(Integer)
    answers: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[int] = mapped_column(Integer)


class Usage(Base):
    __tablename__ = "inference_usage"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    day: Mapped[str] = mapped_column(String(10), primary_key=True)
    requests: Mapped[int] = mapped_column(Integer, default=0)


class LessonStep(Base):
    __tablename__ = "lesson_steps"
    lesson_id: Mapped[str] = mapped_column(ForeignKey("lessons.id"), primary_key=True)
    step: Mapped[str] = mapped_column(String(20), primary_key=True)
    completed_at: Mapped[int] = mapped_column(Integer)


class SourceDocument(Base):
    __tablename__ = "source_documents"
    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    topic_id: Mapped[str] = mapped_column(String(80), index=True)
    chapter_id: Mapped[str] = mapped_column(String(80))
    class_level: Mapped[int] = mapped_column(Integer)
    language: Mapped[str] = mapped_column(String(20))
    version: Mapped[str] = mapped_column(String(50))
    rights: Mapped[str] = mapped_column(String(300))
    review_status: Mapped[str] = mapped_column(String(20))
    reviewer: Mapped[str | None] = mapped_column(String(120), nullable=True)
    content_hash: Mapped[str] = mapped_column(String(64))


class SourceChunk(Base):
    __tablename__ = "source_chunks"
    id: Mapped[str] = mapped_column(String(160), primary_key=True)
    document_id: Mapped[str] = mapped_column(ForeignKey("source_documents.id"), index=True)
    text: Mapped[str] = mapped_column(Text)


def get_db():
    with SessionLocal() as db:
        yield db
