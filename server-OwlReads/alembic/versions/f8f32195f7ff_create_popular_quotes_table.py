from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'f8f32195f7ff'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'popular_quotes',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('book_title', sa.String(length=255), nullable=False),
    )


def downgrade() -> None:
    op.drop_table('popular_quotes')
