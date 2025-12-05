## просмотр текущей миграции
docker-compose exec db psql -U OwlReads_reader_dairy -d OwlReads_reader_dairy_db -c "SELECT * FROM alembic_version;"

## Настройка текущей миграции вручную
docker-compose exec db psql -U OwlReads_reader_dairy -d OwlReads_reader_dairy_db -c "UPDATE alembic_version SET version_num='725b1d704ec7';"

## Создание миграции
docker-compose exec api alembic revision --autogenerate -m "create users_book_quotes"

## Применение миграции
docker-compose exec api alembic upgrade head








