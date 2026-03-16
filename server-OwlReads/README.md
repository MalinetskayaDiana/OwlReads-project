## просмотр текущей миграции
docker-compose exec db psql -U OwlReads_reader_dairy -d OwlReads_reader_dairy_db -c "SELECT * FROM alembic_version;"

## Настройка текущей миграции вручную
docker-compose exec db psql -U OwlReads_reader_dairy -d OwlReads_reader_dairy_db -c "UPDATE alembic_version SET version_num='725b1d704ec7';"

## Создание миграции
docker-compose exec api alembic revision --autogenerate -m "create users_book_quotes"

## Применение миграции
docker-compose exec api alembic upgrade head

## Для очистки бд
-- 1. Очищаем таблицы, которые зависят от отзывов (самый нижний уровень)
TRUNCATE TABLE 
    users_book_notes, 
    users_book_quotes, 
    users_book_rating,
    users_reading_records,
    users_top_characters,
    users_book_review_genres,
    users_book_review_emotions,
    users_challenge_books_alphabet,
    users_challenge_book_of_year
RESTART IDENTITY CASCADE;

-- 2. Очищаем сами отзывы
TRUNCATE TABLE users_book_review RESTART IDENTITY CASCADE;

-- 3. Очищаем статистику и челленджи (они привязаны к пользователям)
TRUNCATE TABLE 
    users_statistics,
    users_challenges
RESTART IDENTITY CASCADE;

-- 4. Очищаем книги и произведения (если вы хотите удалить все добавленные книги)
TRUNCATE TABLE 
    books_editions, 
    literature_works 
RESTART IDENTITY CASCADE;







