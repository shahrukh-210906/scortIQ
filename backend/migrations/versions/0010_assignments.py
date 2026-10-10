"""Classroom topic assignments."""

import sqlalchemy as sa
from alembic import op

revision = "0010"
down_revision = "0009"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "assignments",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("classroom_id", sa.String(64), sa.ForeignKey("classrooms.id"), nullable=False),
        sa.Column("topic_id", sa.String(80), nullable=False),
        sa.Column("study_date", sa.String(10), nullable=False),
        sa.Column("instructions", sa.Text(), nullable=False),
        sa.Column("created_at", sa.Integer(), nullable=False),
        sa.Column("archived", sa.Integer(), nullable=False),
    )
    op.create_index("ix_assignments_classroom_id", "assignments", ["classroom_id"])


def downgrade():
    op.drop_table("assignments")
