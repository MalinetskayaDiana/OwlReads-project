## просмотр текущей миграции
docker-compose exec db psql -U OwlReads_reader_dairy -d OwlReads_reader_dairy_db -c "SELECT * FROM alembic_version;"

## Настройка текущей миграции вручную
docker-compose exec db psql -U OwlReads_reader_dairy -d OwlReads_reader_dairy_db -c "UPDATE alembic_version SET version_num='725b1d704ec7';"

## Создание миграции
docker-compose exec api alembic revision --autogenerate -m "create users_book_quotes"

## Применение миграции
docker-compose exec api alembic upgrade head

## Для очистки бд
docker-compose exec db psql -U OwlReads_reader_dairy -d OwlReads_reader_dairy_db -c "
>> TRUNCATE TABLE 
>>     users_personal_data, 
>>     literature_works, 
>>     books_editions, 
>>     users_book_review, 
>>     users_book_notes, 
>>     users_book_quotes, 
>>     users_book_rating,
>>     users_reading_records,
>>     users_top_characters,
>>     users_challenges,
>>     users_challenge_books_alphabet,
>>     users_challenge_book_of_year,
>>     users_statistics,
>>     users_book_review_genres
>> RESTART IDENTITY CASCADE;"







