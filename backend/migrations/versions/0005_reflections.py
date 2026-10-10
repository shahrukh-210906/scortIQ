"""Save learner-written lesson reflections."""

import sqlalchemy as sa
from alembic import op

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "reflections",
        sa.Column("lesson_id", sa.String(64), sa.ForeignKey("lessons.id"), primary_key=True),
        sa.Column("answer", sa.Text(), nullable=False),
        sa.Column("updated_at", sa.Integer(), nullable=False),
    )


def downgrade():
    op.drop_table("reflections")
