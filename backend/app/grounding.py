"""Versioned source import and bounded lexical retrieval for the pilot."""

import hashlib
import json
import math
import re
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .content import CHAPTERS, topic_by_id
from .database import SourceChunk, SourceDocument


class SourceImport(BaseModel):
    model_config = ConfigDict(extra="forbid", strict=True)
    id: str = Field(pattern=r"^[a-zA-Z0-9_-]{1,120}$")
    title: str = Field(min_length=1, max_length=200)
    topic_id: str = Field(min_length=1, max_length=80)
    class_level: int = Field(ge=9, le=12)
    language: Literal["en"] = "en"
    version: str = Field(min_length=1, max_length=50)
    rights: str = Field(min_length=1, max_length=300)
    rights_confirmed: bool
    review_status: Literal["draft", "reviewed"]
    reviewer: str | None = Field(default=None, max_length=120)
    passages: list[str] = Field(min_length=1, max_length=100)

    @model_validator(mode="after")
    def verify(self):
        if not self.rights_confirmed:
            raise ValueError("Confirm permitted use before importing source material.")
        if self.class_level != 10 or not topic_by_id(self.topic_id):
            raise ValueError("This pilot only accepts known Class 10 topics.")
        if self.review_status == "reviewed" and not (self.reviewer and self.reviewer.strip()):
            raise ValueError("Reviewed sources need a named reviewer.")
        if any(not text.strip() or len(text) > 2000 for text in self.passages):
            raise ValueError("Each passage must contain 1–2000 characters.")
        if any(not value.strip() for value in [self.title, self.version, self.rights]):
            raise ValueError("Source metadata cannot be whitespace.")
        return self


def import_source(db: Session, source: SourceImport):
    payload = source.model_dump()
    content_hash = hashlib.sha256(json.dumps(payload, sort_keys=True).encode()).hexdigest()
    existing = db.get(SourceDocument, source.id)
    if existing:
        if existing.content_hash != content_hash:
            raise ValueError("Source IDs are immutable. Import changes under a new versioned ID.")
        return existing
    chapter, _ = topic_by_id(source.topic_id)
    document = SourceDocument(
        id=source.id,
        title=source.title,
        topic_id=source.topic_id,
        chapter_id=chapter["id"],
        class_level=source.class_level,
        language=source.language,
        version=source.version,
        rights=source.rights,
        review_status=source.review_status,
        reviewer=source.reviewer,
        content_hash=content_hash,
    )
    db.add(document)
    db.flush()
    for index, passage in enumerate(source.passages):
        db.add(SourceChunk(id=f"{source.id}:{index}", document_id=source.id, text=passage.strip()))
    return document


def seed_pilot_sources(db: Session):
    for chapter in CHAPTERS:
        for topic in chapter["topics"]:
            source = SourceImport(
                id=f"pilot-{topic['id']}-v1",
                title=topic["title"],
                topic_id=topic["id"],
                class_level=10,
                version="pilot-1",
                rights="Original ScortIQ project notes; internal pilot only",
                rights_confirmed=True,
                review_status="draft",
                passages=[
                    topic["explanation"],
                    topic["example"],
                    topic["question"] + " " + topic["answer"],
                ],
            )
            try:
                import_source(db, source)
                db.commit()
            except IntegrityError:
                db.rollback()  # Another local worker may have seeded the same immutable document.


def source_ref(document: SourceDocument, chunk: SourceChunk | None = None):
    return {
        "id": chunk.id if chunk else document.id,
        "title": document.title,
        "version": document.version,
        "review_status": document.review_status,
        "reviewer": document.reviewer,
        "rights": document.rights,
        **({"excerpt": chunk.text} if chunk else {}),
    }


def topic_sources(db: Session, topic_id: str, reviewed_only: bool = False):
    query = select(SourceDocument).where(
        SourceDocument.topic_id == topic_id,
        SourceDocument.class_level == 10,
        SourceDocument.language == "en",
    )
    if reviewed_only:
        query = query.where(SourceDocument.review_status == "reviewed")
    return [source_ref(document) for document in db.scalars(query.order_by(SourceDocument.id))]


def retrieve(
    db: Session, topic_id: str, question: str, reviewed_only: bool = False, limit: int = 3
):
    query = (
        select(SourceChunk, SourceDocument)
        .join(SourceDocument)
        .where(
            SourceDocument.topic_id == topic_id,
            SourceDocument.class_level == 10,
            SourceDocument.language == "en",
        )
    )
    if reviewed_only:
        query = query.where(SourceDocument.review_status == "reviewed")
    rows = db.execute(query.order_by(SourceChunk.id)).all()
    if not rows:
        return []
    terms = set(re.findall(r"[a-z0-9]+", question.lower()))
    tokenized = [re.findall(r"[a-z0-9]+", chunk.text.lower()) for chunk, _ in rows]

    # Topic-bounded lexical ranking. Zero-overlap requests retain lesson context; this is
    # not a semantic relevance or factual-confidence score.
    def score(index):
        tokens = tokenized[index]
        value = 0.0
        for term in terms:
            frequency = tokens.count(term)
            if frequency:
                document_frequency = sum(term in passage for passage in tokenized)
                value += (
                    frequency
                    / (frequency + 1.2)
                    * math.log(1 + len(rows) / (1 + document_frequency))
                )
        return value

    ranked = sorted(range(len(rows)), key=lambda i: (-score(i), rows[i][0].id))[:limit]
    return [source_ref(rows[index][1], rows[index][0]) for index in ranked]
