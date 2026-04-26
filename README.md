# Project Tracker

Mini-система для ведения проектов с отслеживанием изменений и комментариями.

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

**Infrastructure:**
- Docker Compose (PostgreSQL + Backend + Frontend)

## Запуск проекта

### Через Docker Compose

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
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

3. Frontend:
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/sign-up/email` | No | Register |
| POST | `/api/auth/sign-in/email` | No | Login |
| POST | `/api/auth/sign-out` | Yes | Logout |
| GET | `/api/auth/get-session` | Cookie | Get session |
| GET | `/api/projects` | Yes | List projects |
| POST | `/api/projects` | Yes | Create project |
| GET | `/api/projects/:id` | Yes | Get project |
| PUT | `/api/projects/:id` | Yes | Update project (403 if completed) |
| DELETE | `/api/projects/:id` | Yes | Delete project |
| GET | `/api/projects/:id/changelog` | Yes | Change history |
| GET | `/api/comments/project/:projectId` | Yes | List comments |
| POST | `/api/comments/project/:projectId` | Yes | Add comment |
| DELETE | `/api/comments/:id` | Yes | Delete comment |

## Бизнес-правила

- Проекты в статусе `completed` нельзя редактировать (403)
- Комментарии можно добавлять к проекту в любом статусе
- Проекты привязаны к пользователю (видны только свои)
- При обновлении проекта автоматически логируются изменённые поля в `project_change_logs`

## Масштабирование при 100 000+ проектов

При росте числа проектов до 100 000+ основные узкие места — это БД-запросы и объём данных. Первым шагом необходимо добавить индексы: составной индекс `(user_id, updated_at)` на таблице `projects` для быстрой сортировки по дате обновления, и индекс на `project_id` в таблицах `project_change_logs` и `project_comments`. Далее — партиционирование таблицы `project_change_logs` по дате (по месяцам/кварталам), так как она растёт быстрее всего. Для API списков необходимо реализовать курсорную пагинацию вместо OFFSET, которая деградирует на больших выборках. Для чтения можно вынести реплики PostgreSQL (read replicas), а тяжёлые агрегации кэшировать в Redis. На уровне приложения — горизонтальное масштабирование stateless-бэкенда за load balancer'ом.
