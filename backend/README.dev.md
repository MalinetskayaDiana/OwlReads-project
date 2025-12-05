Инструкция для локального запуска dev-стека (Docker).

1. Скопировать .env.example в .env: cp .env.example .env
2. Запусти контейнеры: docker-compose -p owlread up -d
3. Проверить логи: docker-compose logs -f db
4. Открыть pgAdmin: http://localhost:8080 (логин из .env.example)
5. Подключиться к БД в pgAdmin:
   Host: localhost
   Port: 5432
   Username: owlreads_admin
   Password: D83xCEchx2C6YaU
   Database: owlreads_db
6. Остановить стек: docker-compose down
7. Полностью удалить с томами (очистить БД): docker-compose down -v
8. Делать дампы: docker exec -t $(docker-compose ps -q db) pg_dump -U owlreads_admin -d owlreads_db > dump.sql
9. Восстановить дамп: cat dump.sql | docker exec -i $(docker-compose ps -q db) psql -U owlreads_admin -d owlreads_db


