"""Opt-in private teaching-style feedback."""

import sqlalchemy as sa
from alembic import op

revision = "0013"
down_revision = "0012"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "learner_memory",
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column("enabled", sa.Integer(), nullable=False),
    )
    op.create_table(
        "teaching_arms",
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column("topic_id", sa.String(80), primary_key=True),
        sa.Column("style", sa.String(30), primary_key=True),
        sa.Column("helpful", sa.Integer(), nullable=False),
        sa.Column("unhelpful", sa.Integer(), nullable=False),
    )
    op.create_table(
        "tutor_ratings",
        sa.Column("lesson_id", sa.String(64), sa.ForeignKey("lessons.id"), primary_key=True),
        sa.Column("turn_index", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("style", sa.String(30), nullable=False),
        sa.Column("helpful", sa.Integer(), nullable=False),
    )
    op.create_index("ix_tutor_ratings_user_id", "tutor_ratings", ["user_id"])


def downgrade():
    op.drop_table("tutor_ratings")
    op.drop_table("teaching_arms")
    op.drop_table("learner_memory")
