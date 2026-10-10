"""Student/topic support scoped to a classroom."""

import sqlalchemy as sa
from alembic import op

revision = "0011"
down_revision = "0010"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "support_settings",
        sa.Column("classroom_id", sa.String(64), sa.ForeignKey("classrooms.id"), primary_key=True),
        sa.Column("user_id", sa.String(64), sa.ForeignKey("users.id"), primary_key=True),
        sa.Column("topic_id", sa.String(80), primary_key=True),
        sa.Column("simple_language", sa.Integer(), nullable=False),
        sa.Column("more_detail", sa.Integer(), nullable=False),
        sa.Column("extra_practice", sa.Integer(), nullable=False),
    )


def downgrade():
    op.drop_table("support_settings")
