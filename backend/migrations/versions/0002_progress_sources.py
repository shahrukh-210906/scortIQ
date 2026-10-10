"""Persist lesson checklist steps and versioned source passages."""

import sqlalchemy as sa
from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "lesson_steps",
        sa.Column("lesson_id", sa.String(64), sa.ForeignKey("lessons.id"), primary_key=True),
        sa.Column("step", sa.String(20), primary_key=True),
        sa.Column("completed_at", sa.Integer, nullable=False),
    )
    op.create_table(
        "source_documents",
        sa.Column("id", sa.String(120), primary_key=True),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("topic_id", sa.String(80), nullable=False),
        sa.Column("chapter_id", sa.String(80), nullable=False),
        sa.Column("class_level", sa.Integer, nullable=False),
        sa.Column("language", sa.String(20), nullable=False),
        sa.Column("version", sa.String(50), nullable=False),
        sa.Column("rights", sa.String(300), nullable=False),
        sa.Column("review_status", sa.String(20), nullable=False),
        sa.Column("reviewer", sa.String(120), nullable=True),
        sa.Column("content_hash", sa.String(64), nullable=False),
    )
    op.create_index("ix_source_documents_topic_id", "source_documents", ["topic_id"])
    op.create_table(
        "source_chunks",
        sa.Column("id", sa.String(160), primary_key=True),
        sa.Column(
            "document_id", sa.String(120), sa.ForeignKey("source_documents.id"), nullable=False
        ),
        sa.Column("text", sa.Text, nullable=False),
    )
    op.create_index("ix_source_chunks_document_id", "source_chunks", ["document_id"])


def downgrade():
    op.drop_table("source_chunks")
    op.drop_table("source_documents")
    op.drop_table("lesson_steps")
