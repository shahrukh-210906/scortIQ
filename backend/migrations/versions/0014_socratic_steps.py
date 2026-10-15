"""Persist comprehension-gated teaching phases."""

import sqlalchemy as sa
from alembic import op

revision = "0014"
down_revision = "0013"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "socratic_states",
        sa.Column("lesson_id", sa.String(64), sa.ForeignKey("lessons.id"), primary_key=True),
        sa.Column("phase", sa.Integer(), nullable=False),
        sa.Column("taught_phase", sa.Integer(), nullable=False),
        sa.Column("last_wrong", sa.Integer(), nullable=True),
    )


def downgrade():
    op.drop_table("socratic_states")
