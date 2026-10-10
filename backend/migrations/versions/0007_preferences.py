"""Persist separate teaching and exam-answer language preferences."""

import sqlalchemy as sa
from alembic import op

revision = "0007"
down_revision = "0006"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "preferences",
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column("teaching_language", sa.String(10), nullable=False),
        sa.Column("exam_language", sa.String(10), nullable=False),
    )


def downgrade():
    op.drop_table("preferences")
