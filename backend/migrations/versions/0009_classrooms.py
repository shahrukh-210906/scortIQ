"""Approved teachers and private classrooms."""

import sqlalchemy as sa
from alembic import op

revision = "0009"
down_revision = "0008"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "teachers", sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), primary_key=True)
    )
    op.create_table(
        "classrooms",
        sa.Column("id", sa.String(64), primary_key=True),
        sa.Column("teacher_id", sa.String(64), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("name", sa.String(80), nullable=False),
        sa.Column("code_hash", sa.String(64), nullable=False, unique=True),
        sa.Column("code_expires", sa.Integer(), nullable=False),
    )
    op.create_table(
        "memberships",
        sa.Column("classroom_id", sa.String(64), sa.ForeignKey("classrooms.id"), primary_key=True),
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), primary_key=True),
    )


def downgrade():
    op.drop_table("memberships")
    op.drop_table("classrooms")
    op.drop_table("teachers")
