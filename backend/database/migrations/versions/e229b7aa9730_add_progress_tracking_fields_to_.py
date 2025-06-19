"""Add progress tracking fields to DocumentAnalysis

Revision ID: e229b7aa9730
Revises: e15f758835cd
Create Date: 2025-06-19 13:32:30.636144

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e229b7aa9730'
down_revision = 'e15f758835cd'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add progress tracking fields to document_analyses table if they don't exist
    with op.batch_alter_table('document_analyses', schema='dev') as batch_op:
        batch_op.add_column(sa.Column('progress_step', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('progress_message', sa.Text(), nullable=True))


def downgrade() -> None:
    # Remove progress tracking fields from document_analyses table
    with op.batch_alter_table('document_analyses', schema='dev') as batch_op:
        batch_op.drop_column('progress_message')
        batch_op.drop_column('progress_step')