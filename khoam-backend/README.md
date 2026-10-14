# Backend

Простой REST API для новостного проекта на Next.js.

Стек:

- Node.js 22+
- Express 5
- TypeScript
- MongoDB + Mongoose
- JWT Bearer authentication
- Zod
- Multer для локальной загрузки файлов

## 1. Структура проекта

```text
news-backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── validators/
│   ├── app.ts
│   └── server.ts
├── uploads/
├── docs/
├── test-frontend/
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 3. Требования

Нужны:

- Node.js 22+
- npm
- MongoDB. Для начала удобно использовать MongoDB Atlas.

Проверка:

```bash
node -v
npm -v
```

---

## 4. Установка

Перейти в backend:

```bash
cd news-backend
```

Установить зависимости:

```bash
npm install
```

Запуск разработки:

```bash
npm run dev
```

Backend будет доступен по адресу:

```text
http://localhost:5000
```

Проверка:

```text
GET http://localhost:5000/health
```

Ожидается:

```json
{
  "data": {
    "status": "ok"
  }
}
```

---

## 5. `.env`

Создайте `.env` на основе `.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/news
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE_MB=10
```

Для frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Важно: frontend уже отправляет JWT как:

```http
Authorization: Bearer YOUR_TOKEN
```

Поэтому backend использует именно Bearer JWT, а не cookies.

---

# 6. Роли

## `user`

Обычный пользователь:

- регистрация;
- login;
- профиль;
- удаление аккаунта;
- просмотр новостей;
- фильтрация по категориям;
- сохранение новостей.

## `editor`

Редакция/редактор:

- всё, что может `user`;
- создание draft новостей;
- редактирование своих новостей;
- удаление своих новостей;
- публикация своих новостей;
- снятие своих новостей с публикации;
- редактирование профиля своей редакции.

Если `isBlocked=true`:

- login разрешён;
- просмотр разрешён;
- создание и редактирование draft разрешено;
- публикация запрещена;
- уже опубликованные новости не изменяются автоматически.

## `admin`

Администратор:

- создаёт редакторов;
- получает список редакторов;
- блокирует/разблокирует редакторов;
- удаляет редакторов;
- получает список любых новостей;
- меняет статус любой новости;
- удаляет любую новость;
- управляет категориями.

---

# 7. MongoDB модели

## User

Основные поля:

```text
name
email
passwordHash
role
avatar
mustChangePassword
isBlocked
editorName
editorSlug
editorDescription
editorAvatar
createdAt
updatedAt
```

`editor*` поля используются только для пользователей с ролью `editor`.

Отдельной коллекции `Channel` больше нет.

## MediaAsset

Backend хранит отдельную запись для каждого локально загруженного файла. Она нужна, чтобы безопасно удалять физические файлы и проверять владельца.

Поля:

```text
owner
filename
type
url
createdAt
updatedAt
```

## News

```text
title
slug
excerpt
medias
content?
category
editor?
status
views
publishedAt
createdAt
updatedAt
```

### `excerpt`

Пока это не короткий excerpt, а основной текст статьи.

Максимум:

```text
5000 символов
```

### `medias`

Пример:

```json
[
  {
    "type": "image",
    "url": "https://example.com/photo.jpg"
  },
  {
    "type": "video",
    "url": "https://example.com/video.mp4"
  }
]
```

Максимум — 8 элементов.

### `content`

Сейчас необязательное поле.

Frontend его может вообще не отправлять:

```json
{
  "title": "News title",
  "excerpt": "Обычный текст статьи...",
  "medias": [],
  "category": "CATEGORY_ID"
}
```

Позже туда можно вернуть Editor.js JSON.

### `status`

```text
draft
published
```

---

# 8. Администратор

Создать первого admin:

```bash
npm run seed:admin
```

По умолчанию:

```text
email: admin@example.com
password: Admin12345!
```

Можно переопределить через environment variables:

```env
ADMIN_NAME=Site Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=VeryStrongPassword123!
```

---

# 9. Полный сценарий проверки через Postman

Готовая коллекция:

```text
docs/POSTMAN_COLLECTION.json
```

Импортируйте её в Postman.

Переменные коллекции:

```text
baseUrl
userToken
editorToken
adminToken
categoryId
newsId
newsSlug
editorId
```

## Шаг 1. Health

```http
GET /health
```

## Шаг 2. Регистрация user

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "John User",
  "email": "john@example.com",
  "password": "Password123!"
}
```

В ответе будет `token`.

Сохраните его в `userToken`.

## Шаг 3. Login admin

```http
POST /api/auth/login
```

```json
{
  "email": "admin@example.com",
  "password": "Admin12345!"
}
```

Сохраните token в `adminToken`.

## Шаг 4. Создание категории

```http
POST /api/admin/categories
Authorization: Bearer ADMIN_TOKEN
```

```json
{
  "name": "Technology"
}
```

Backend сам создаст slug.

Сохраните `_id` категории в `categoryId`.

## Шаг 5. Создание редактора

```http
POST /api/admin/editors
Authorization: Bearer ADMIN_TOKEN
```

```json
{
  "name": "Editor Person",
  "email": "editor@example.com",
  "editorName": "Tech News",
  "editorDescription": "Technology news",
  "editorAvatar": "https://example.com/editor.jpg"
}
```

Backend вернёт временный пароль:

```json
{
  "data": {
    "editor": {},
    "temporaryPassword": "..."
  }
}
```

Скопируйте временный пароль.

## Шаг 6. Login editor

```http
POST /api/auth/login
```

```json
{
  "email": "editor@example.com",
  "password": "TEMPORARY_PASSWORD"
}
```

Сохраните token в `editorToken`.

## Шаг 7. Смена временного пароля

```http
PATCH /api/users/me/password
Authorization: Bearer EDITOR_TOKEN
```

```json
{
  "currentPassword": "TEMPORARY_PASSWORD",
  "newPassword": "EditorPassword123!"
}
```

После этого редактор может использовать новый пароль.

## Шаг 8. Получение профиля редакции

```http
GET /api/editors/me
Authorization: Bearer EDITOR_TOKEN
```

## Шаг 9. Обновление профиля редакции

```http
PATCH /api/editors/me
Authorization: Bearer EDITOR_TOKEN
```

```json
{
  "editorName": "Tech Daily",
  "editorDescription": "Новости технологий каждый день",
  "editorAvatar": "https://example.com/editor-new.jpg"
}
```

`editorSlug` будет создан/обновлён backend.

---

# 10. Создание новости

Editor.js для этого НЕ нужен.

```http
POST /api/news
Authorization: Bearer EDITOR_TOKEN
Content-Type: application/json
```

Body:

```json
{
  "title": "New technology announced",
  "excerpt": "Это обычный текст статьи. Здесь может находиться весь основной текст новости, пока frontend не использует Editor.js.",
  "medias": [
    {
      "type": "image",
      "url": "https://example.com/photo.jpg"
    },
    {
      "type": "video",
      "url": "https://example.com/video.mp4"
    }
  ],
  "category": "CATEGORY_ID"
}
```

`content` можно не передавать.

News автоматически получает:

```text
slug
editor = текущий editor
status = draft
views = 0
```

---

# 11. Ограничение medias

Допустимо максимум 8:

```json
"medias": [
  { "type": "image", "url": "..." },
  { "type": "image", "url": "..." },
  { "type": "video", "url": "..." }
]
```

9 элементов дадут ошибку валидации.

`type` может быть только:

```text
image
video
```

---

# 12. Draft → Published

Редактор публикует свою новость:

```http
PATCH /api/news/NEWS_ID/publish
Authorization: Bearer EDITOR_TOKEN
```

При публикации:

```text
status = published
publishedAt = текущая дата
```

Снять с публикации:

```http
PATCH /api/news/NEWS_ID/unpublish
Authorization: Bearer EDITOR_TOKEN
```

Получится:

```text
status = draft
publishedAt = undefined
```

---

### Управление загруженными файлами

Каждая загрузка через `/api/uploads/media` или `/api/uploads/image` получает `id` медиа-ресурса.

Пример ответа:

```json
{
  "data": {
    "id": "MEDIA_ASSET_ID",
    "type": "image",
    "url": "http://localhost:5000/uploads/uuid.jpg"
  }
}
```

Удалить загруженный файл:

```http
DELETE /api/uploads/media/MEDIA_ASSET_ID
Authorization: Bearer EDITOR_TOKEN
```

Удалить файл может его владелец-редактор или администратор.

Backend дополнительно защищает удаление:

- нельзя удалить чужой media asset;
- нельзя удалить файл, который всё ещё используется новостью;
- нельзя удалить файл за пределами `uploads/`;
- после удаления записи удаляется и физический файл с диска;
- если при обновлении новости media был убран из `medias[]`, backend автоматически удаляет локальный файл, если он больше нигде не используется;
- при удалении новости её локальные media также очищаются;
- внешние URL не удаляются, потому что backend ими не владеет.

Поэтому правильный сценарий для frontend:

1. загрузить файл;
2. получить `id` и `url`;
3. добавить media в `news.medias`;
4. если пользователь отменил загрузку до сохранения новости — вызвать `DELETE /api/uploads/media/:id`;
5. если media убрать из уже сохранённой новости — достаточно обновить `medias[]`; backend сам удалит больше не используемый локальный файл.

# 13. Блокировка редактора

Админ может заблокировать редактора:

```http
PATCH /api/admin/editors/EDITOR_ID/block
Authorization: Bearer ADMIN_TOKEN
```

```json
{
  "isBlocked": true
}
```

Разблокировать:

```json
{
  "isBlocked": false
}
```

## Что делает блокировка

Заблокированный редактор НЕ может выполнить:

```http
PATCH /api/news/NEWS_ID/publish
```

Backend вернёт:

```text
EDITOR_BLOCKED
```

При этом:

- уже опубликованные новости остаются published;
- новости не удаляются;
- редактор не удаляется;
- draft можно продолжать редактировать;
- после разблокировки публикация снова доступна.

---

# 14. Админ меняет статус новости

Админ может отправить опубликованную новость обратно в draft:

```http
PATCH /api/admin/news/NEWS_ID/status
Authorization: Bearer ADMIN_TOKEN
```

```json
{
  "status": "draft"
}
```

Опубликовать обратно:

```json
{
  "status": "published"
}
```

Backend при `published` выставляет `publishedAt`.

При `draft` очищает `publishedAt`.

Никакой дополнительной логики поверх этого нет. Например, backend не устанавливает специальный статус `needs_revision` и не запрещает редактору потом снова опубликовать новость.

---

# 15. Публичные новости

Токен НЕ нужен.

## Список

```http
GET /api/news
```

Параметры:

```text
?page=1&limit=12
```

Фильтр:

```text
?category=technology
```

Показываются только:

```text
status = published
```

## Детальная новость

```http
GET /api/news/NEWS_SLUG
```

Токен не нужен.

Каждое успешное открытие опубликованной новости увеличивает:

```text
views + 1
```

Это именно счётчик открытий страницы, а не уникальных пользователей.

---

# 16. Сохранение новости

Требует авторизацию.

```http
POST /api/news/NEWS_ID/save
Authorization: Bearer USER_TOKEN
```

Удалить из сохранённых:

```http
DELETE /api/news/NEWS_ID/save
Authorization: Bearer USER_TOKEN
```

Список:

```http
GET /api/news/saved
Authorization: Bearer USER_TOKEN
```

---

# 17. Категории

Список публичный:

```http
GET /api/categories
```

Создание только admin:

```http
POST /api/admin/categories
```

```json
{
  "name": "Technology"
}
```

Slug frontend не отправляет.

Backend создаёт его сам.

Удаление категории, используемой новостями, блокируется с ошибкой `CATEGORY_IN_USE`.

---

# 18. Загрузка файлов

Файлы сейчас сохраняются локально:

```text
uploads/
```

Это сделано просто для разработки.

## Изображение

```http
POST /api/uploads/image
Authorization: Bearer EDITOR_TOKEN
Content-Type: multipart/form-data
```

Поле:

```text
image
```

Этот endpoint сохранён также как будущая точка интеграции Editor.js Image Tool.

## Универсальное media

Для обычного frontend можно использовать:

```http
POST /api/uploads/media
Authorization: Bearer EDITOR_TOKEN
Content-Type: multipart/form-data
```

Поле:

```text
media
```

Поддерживаются изображения и видео. Максимальный размер задаётся `MAX_FILE_SIZE_MB`.

После загрузки URL можно положить в `medias[]`.

Пример:

```json
{
  "type": "image",
  "url": "http://localhost:5000/uploads/....jpg"
}
```

Для production локальное хранилище лучше заменить на S3-compatible/object storage. Логика API при этом может остаться прежней.

---

# 19. Editor.js — пока отключён

Сейчас frontend **не обязан устанавливать Editor.js**.

То есть не нужны:

```bash
npm install @editorjs/editorjs @editorjs/header @editorjs/image @editorjs/list
```

Для текущего сценария достаточно обычного `<textarea>` / React Hook Form.

Backend при этом оставляет:

- необязательное поле `content`;
- TypeScript-типы Editor.js в `src/types/news.ts`;
- image upload endpoint `/api/uploads/image`.

Когда команда решит вернуть Editor.js, можно будет:

1. установить Editor.js на frontend;
2. сделать `content` обязательным только на frontend/при необходимости backend;
3. отправлять Editor.js Output Data в `content`;
4. использовать `/api/uploads/image` для Image Tool.

Подробнее: `docs/FUTURE_EDITORJS.md`.

---

# 20. Frontend integration

Для текущего Next.js frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Axios:

```ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
```

Перед авторизованным запросом:

```http
Authorization: Bearer TOKEN
```

Публичные endpoints можно вызывать без токена.

---

# 21. Минимальный frontend flow

### Главная

```text
GET /api/news?page=1&limit=12
```

### Фильтр категории

```text
GET /api/news?category=technology&page=1&limit=12
```

### Открытие новости

```text
GET /api/news/news-slug
```

### Login

```text
POST /api/auth/login
```

### Сохранить

```text
POST /api/news/NEWS_ID/save
```

### Личный кабинет

```text
GET /api/auth/me
```

### Редактор

```text
GET /api/editors/me
PATCH /api/editors/me
GET /api/news/my
POST /api/news
PATCH /api/news/NEWS_ID
PATCH /api/news/NEWS_ID/publish
PATCH /api/news/NEWS_ID/unpublish
```

---

# 22. Тестовый frontend

В проекте есть:

```text
test-frontend/
```

Он нужен только для smoke test backend.

Запуск:

```bash
cd test-frontend
npm install
```

Создать `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Запуск:

```bash
npm run dev
```

Открыть:

```text
http://localhost:3000
```

Тестовый frontend сейчас использует обычный текст новости и `medias[]`. Editor.js в него специально не включён.

---

# 23. Проверка TypeScript

```bash
npm run check
```

Сборка:

```bash
npm run build
```

Production запуск:

```bash
npm start
```

---

# 24. Что намеренно НЕ реализовано

Пока не добавляем:

- likes;
- comments;
- Redis;
- WebSocket;
- уникальные просмотры;
- IP analytics;
- cookie analytics;
- поиск по тексту;
- microservices;
- сложную модерацию;
- отдельную коллекцию Channel;
- обязательный Editor.js.

Это сознательное упрощение текущего проекта.

---

# 25. Что можно добавить позже

Без серьёзной переделки API можно добавить:

- Editor.js в `content`;
- likes;
- comments;
- object storage для media;
- полноценную аналитику просмотров;
- поиск;
- дополнительные media-типы;
- более сложную модерацию.
