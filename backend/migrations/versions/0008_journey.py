"""Save topic navigation, activity evidence and recall attempts."""

import sqlalchemy as sa
from alembic import op

revision = "0008"
down_revision = "0007"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "journeys",
        sa.Column("lesson_id", sa.String(64), sa.ForeignKey("lessons.id"), primary_key=True),
        sa.Column("active_stage", sa.String(20), nullable=False),
        sa.Column("activity_completed", sa.Integer(), nullable=False),
    )
    op.create_table(
        "recall_attempts",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("lesson_id", sa.String(64), sa.ForeignKey("lessons.id"), nullable=False),
        sa.Column("answers", sa.Text(), nullable=True),
        sa.Column("score", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.BigInteger(), nullable=False),
    )
    op.create_index("ix_recall_attempts_lesson_id", "recall_attempts", ["lesson_id"])


def downgrade():
    op.drop_table("recall_attempts")
    op.drop_table("journeys")
