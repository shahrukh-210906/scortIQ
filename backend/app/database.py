import os
from pathlib import Path

from sqlalchemy import ForeignKey, Integer, String, Text, UniqueConstraint, create_engine
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


class Reflection(Base):
    __tablename__ = "reflections"
    lesson_id: Mapped[str] = mapped_column(ForeignKey("lessons.id"), primary_key=True)
    answer: Mapped[str] = mapped_column(Text)
    updated_at: Mapped[int] = mapped_column(Integer)


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
