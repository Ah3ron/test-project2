# Трекер проектов

Система для ведения проектов с отслеживанием изменений и комментариями.

## Стек технологий

**Backend:**

- Node.js + Express (TypeScript, ESM)
- Drizzle ORM + PostgreSQL
- better-auth (аутентификация с email/password)

**Frontend:**

- React + TypeScript (Vite)
- Tailwind CSS 4 + DaisyUI 5
- Zustand (state management)
- React Router DOM

## Запуск проекта

### Через Docker Compose

```bash
docker compose up --build
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>
- PostgreSQL: localhost:5432

### Локально (для разработки)

**Требования:** Node.js 22+, PostgreSQL 16+

1. Запустить PostgreSQL, создать базу `projects_db`
2. Backend:

```bash
cd backend
cp .env .env.local  # настроить DATABASE_URL и т.д.
npm install
npm run db:push     # создать таблицы
npm run dev
```

1. Frontend:

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/sign-up/email` | Нет | Регистрация |
| POST | `/api/auth/sign-in/email` | Нет | Вход |
| POST | `/api/auth/sign-out` | Да | Выход |
| GET | `/api/auth/get-session` | Cookie | Получить сессию |
| GET | `/api/projects` | Да | Список проектов |
| POST | `/api/projects` | Да | Создать проект |
| GET | `/api/projects/:id` | Да | Получить проект |
| PUT | `/api/projects/:id` | Да | Обновить проект (403 если завершён) |
| DELETE | `/api/projects/:id` | Да | Удалить проект |
| GET | `/api/projects/:id/changelog` | Да | История изменений |
| GET | `/api/comments/project/:projectId` | Да | Список комментариев |
| POST | `/api/comments/project/:projectId` | Да | Добавить комментарий |
| DELETE | `/api/comments/:id` | Да | Удалить комментарий |

## Бизнес-правила

- Проекты в статусе `completed` нельзя редактировать (403)
- Комментарии можно добавлять к проекту в любом статусе
- Проекты привязаны к пользователю (видны только свои)
- При обновлении проекта автоматически логируются изменённые поля в `project_change_logs`

## Масштабирование при 100 000+ проектов

При росте числа проектов до 100 000+ основные узкие места — это БД-запросы и объём данных. Первым шагом необходимо добавить индексы. Далее — разделение таблицы `project_change_logs` по дате (по месяцам/кварталам), так как она растёт быстрее всего. Так же добавить кэширование в Redis. На уровне приложения — горизонтальное масштабирование бэкенда.
