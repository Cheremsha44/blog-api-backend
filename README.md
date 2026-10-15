# Express API Template

Шаблон бэкенда: Express + Prisma 7 + PostgreSQL (ESM).

## Стек

- Node.js (ESM, `"type": "module"`)
- Express
- Prisma 7 + `@prisma/adapter-pg`
- PostgreSQL
- ESLint + Prettier

## Структура

```
prisma/
  schema.prisma        # схема БД
  migrations/          # миграции (создаются автоматически)
src/
  controllers/
  lib/prisma.js        # PrismaClient (рантайм)
  middleware/
  routes/
  index.js             # точка входа
prisma.config.js       # конфиг Prisma CLI
```

## Запуск

### 1. Установить зависимости

```bash
npm install
```
e
```bash
npx prisma generate
```
### 2. Настроить окружение

```bash
cp .env.example .env
```

Открой `.env` и укажи строку подключения к своей базе:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

База должна существовать и быть запущена.

### 3. Сгенерировать клиент и применить миграции

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Команды создадут таблицы по `schema.prisma` и сгенерируют Prisma Client.

### 4. Запустить серверы

```bash
npm run dev     # разработка (nodemon)
npm start       # прод
```

## Работа с БД

После изменения `schema.prisma`:

```bash
npx prisma migrate dev --name название_миграции
```

Остальные команды:

```bash
npx prisma generate        # перегенерировать клиент
npx prisma studio          # GUI для просмотра данных
npx prisma migrate deploy  # применить миграции на проде
npx prisma migrate reset   # снести БД и накатить заново (только dev!)
```

## Переменные окружения

| Переменная     | Описание                    |
| -------------- | --------------------------- |
| `DATABASE_URL` | Строка подключения к Postgres |
