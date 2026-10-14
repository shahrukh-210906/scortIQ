"""Saved and submitted written practice answers."""

import sqlalchemy as sa
from alembic import op

revision = "0012"
down_revision = "0011"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "writing_exams",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("topic_id", sa.String(80), nullable=False),
        sa.Column("exam_language", sa.String(10), nullable=False),
        sa.Column("paper", sa.Text(), nullable=False),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column("revision", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.Integer(), nullable=False),
        sa.Column("submitted_at", sa.Integer(), nullable=True),
    )
    op.create_index("ix_writing_exams_user_id", "writing_exams", ["user_id"])


def downgrade():
    op.drop_table("writing_exams")
