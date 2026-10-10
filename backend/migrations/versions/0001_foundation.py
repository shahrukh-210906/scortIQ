"""Initial account, learning and quota schema."""

import sqlalchemy as sa
from alembic import op

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("identity", sa.String(255), nullable=False, unique=True),
        sa.Column("name", sa.String(80), nullable=False),
    )
    op.create_table(
        "sessions",
        sa.Column("token_hash", sa.String(64), primary_key=True),
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("expires", sa.Integer, nullable=False),
    )
    op.create_table(
        "lessons",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("topic_id", sa.String(80), nullable=False),
        sa.Column("messages", sa.Text, nullable=False),
        sa.Column("created_at", sa.Integer, nullable=False),
        sa.UniqueConstraint("user_id", "topic_id"),
    )
    op.create_index("ix_lessons_user_id", "lessons", ["user_id"])
    op.create_table(
        "attempts",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("chapter_id", sa.String(80), nullable=False),
        sa.Column("score", sa.Integer, nullable=True),
        sa.Column("total", sa.Integer, nullable=False),
        sa.Column("answers", sa.Text, nullable=True),
        sa.Column("created_at", sa.Integer, nullable=False),
    )
    op.create_index("ix_attempts_user_id", "attempts", ["user_id"])
    op.create_table(
        "inference_usage",
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column("day", sa.String(10), primary_key=True),
        sa.Column("requests", sa.Integer, nullable=False),
    )


def downgrade():
    op.drop_table("inference_usage")
    op.drop_table("attempts")
    op.drop_table("lessons")
    op.drop_table("sessions")
    op.drop_table("users")
