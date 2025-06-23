"""Add user background questionnaire table

Revision ID: 9aab36dace77
Revises: e229b7aa9730
Create Date: 2025-06-22 11:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from config.settings import settings


# revision identifiers, used by Alembic.
revision = '9aab36dace77'
down_revision = 'e229b7aa9730'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create user_background_questionnaires table
    op.create_table('user_background_questionnaires',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('responses', sa.JSON(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('completed_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], [f'{settings.db_schema}.users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    schema=settings.db_schema
    )
    op.create_index(op.f(f'ix_{settings.db_schema}_user_background_questionnaires_id'), 'user_background_questionnaires', ['id'], unique=False, schema=settings.db_schema)
    
    # Add background_questionnaire_id column to document_analyses table
    op.add_column('document_analyses', 
        sa.Column('background_questionnaire_id', sa.Integer(), nullable=True),
        schema=settings.db_schema
    )
    
    # Add foreign key constraint
    op.create_foreign_key(
        'fk_document_analyses_background_questionnaire',
        'document_analyses', 
        'user_background_questionnaires',
        ['background_questionnaire_id'], 
        ['id'],
        source_schema=settings.db_schema,
        referent_schema=settings.db_schema
    )


def downgrade() -> None:
    # Drop foreign key constraint
    op.drop_constraint('fk_document_analyses_background_questionnaire', 'document_analyses', type_='foreignkey', schema=settings.db_schema)
    
    # Drop column from document_analyses
    op.drop_column('document_analyses', 'background_questionnaire_id', schema=settings.db_schema)
    
    # Drop index and table
    op.drop_index(op.f(f'ix_{settings.db_schema}_user_background_questionnaires_id'), table_name='user_background_questionnaires', schema=settings.db_schema)
    op.drop_table('user_background_questionnaires', schema=settings.db_schema)