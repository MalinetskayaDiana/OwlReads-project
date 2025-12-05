"""create genres table

Revision ID: 316574416a9d
Revises: f8f32195f7ff
Create Date: 2025-11-29 20:21:30.042282

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '316574416a9d'
down_revision: Union[str, Sequence[str], None] = 'f8f32195f7ff'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'genres',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
    )
    op.create_unique_constraint('uq_genres_name', 'genres', ['name'])

    genres = [
        "Young adult",
        "Античная литература",
        "Белорусская литература",
        "Биография, мемуары",
        "Бизнес-книги",
        "Боевик",
        "Детектив",
        "Детская литература",
        "Журнал, газета, статья",
        "Зарубежная литература",
        "Здоровье, медицина",
        "Историческая литература",
        "Комедия",
        "Комикс, манга, манхва, вебтун",
        "Культура, искусство",
        "Мифы, легенды, эпос",
        "На иностранном языке",
        "Научно-популярная литература",
        "Научная фантастика",
        "Нон-фикшн",
        "Приключения",
        "Психология",
        "Пьеса",
        "Религия",
        "Роман",
        "Русская классика",
        "Стихи, поэзия",
        "Техническая литература",
        "Триллер",
        "Ужасы, мистика",
        "Учебная литература",
        "Фантастика",
        "Философия",
        "Фэнтези",
        "Энциклопедия, справочник",
        "18+"
    ]
    for g in genres:
        op.execute(
            sa.text("INSERT INTO genres (name) VALUES (:name) ON CONFLICT (name) DO NOTHING")
            .bindparams(name=g)
        )

def downgrade() -> None:
    op.drop_table('genres')
