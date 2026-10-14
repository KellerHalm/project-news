# API Examples

Base URL:

```text
http://localhost:5000/api
```

## Auth

### Register

```http
POST /auth/register
Content-Type: application/json
```

```json
{
  "name": "John User",
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "editor@example.com",
  "password": "PASSWORD"
}
```

### Me

```http
GET /auth/me
Authorization: Bearer TOKEN
```

## Public news

### List

```http
GET /news?page=1&limit=12
```

### Category filter

```http
GET /news?category=technology&page=1&limit=12
```

### Detail

```http
GET /news/news-slug
```

Каждое успешное открытие published news увеличивает `views` на 1.

## User saved news

```http
POST /news/NEWS_ID/save
Authorization: Bearer TOKEN
```

```http
DELETE /news/NEWS_ID/save
Authorization: Bearer TOKEN
```

```http
GET /news/saved
Authorization: Bearer TOKEN
```

## Editor profile

```http
GET /editors/me
Authorization: Bearer EDITOR_TOKEN
```

```http
PATCH /editors/me
Authorization: Bearer EDITOR_TOKEN
Content-Type: application/json
```

```json
{
  "editorName": "Tech Daily",
  "editorDescription": "Technology news",
  "editorAvatar": "https://example.com/editor.jpg"
}
```

## Editor news

```http
GET /news/my?page=1&limit=12
Authorization: Bearer EDITOR_TOKEN
```

### Create draft

```http
POST /news
Authorization: Bearer EDITOR_TOKEN
Content-Type: application/json
```

```json
{
  "title": "News title",
  "excerpt": "Полный обычный текст статьи до 5000 символов.",
  "medias": [
    { "type": "image", "url": "https://example.com/photo.jpg" },
    { "type": "video", "url": "https://example.com/video.mp4" }
  ],
  "category": "CATEGORY_ID"
}
```

`content` необязателен и сейчас не нужен.

### Update

```http
PATCH /news/NEWS_ID
Authorization: Bearer EDITOR_TOKEN
```

```json
{
  "excerpt": "Обновлённый текст статьи",
  "medias": [
    { "type": "image", "url": "https://example.com/new.jpg" }
  ]
}
```

### Publish

```http
PATCH /news/NEWS_ID/publish
Authorization: Bearer EDITOR_TOKEN
```

Если `isBlocked=true`, backend возвращает `EDITOR_BLOCKED`.

### Unpublish

```http
PATCH /news/NEWS_ID/unpublish
Authorization: Bearer EDITOR_TOKEN
```

## Admin

### Create editor

```http
POST /admin/editors
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

Backend возвращает временный пароль.

### Block/unblock editor

```http
PATCH /admin/editors/EDITOR_ID/block
Authorization: Bearer ADMIN_TOKEN
```

```json
{
  "isBlocked": true
}
```

Разблокировка:

```json
{
  "isBlocked": false
}
```

### Admin news list

```http
GET /admin/news?status=draft&page=1&limit=20
Authorization: Bearer ADMIN_TOKEN
```

### Admin change news status

```http
PATCH /admin/news/NEWS_ID/status
Authorization: Bearer ADMIN_TOKEN
```

```json
{
  "status": "draft"
}
```

или:

```json
{
  "status": "published"
}
```

### Admin delete news

```http
DELETE /admin/news/NEWS_ID
Authorization: Bearer ADMIN_TOKEN
```

## Categories

```http
GET /categories
```

Admin create:

```http
POST /admin/categories
Authorization: Bearer ADMIN_TOKEN
```

```json
{
  "name": "Technology"
}
```

## Uploads

### Generic media upload

```http
POST /uploads/media
Authorization: Bearer EDITOR_TOKEN
Content-Type: multipart/form-data
```

Field:

```text
media
```

### Future Editor.js image upload

```http
POST /uploads/image
Authorization: Bearer EDITOR_TOKEN
Content-Type: multipart/form-data
```

Field:

```text
image
```

Ответ `/uploads/image` совместим с Image Tool Editor.js.


## Uploads

### Upload media

`POST /api/uploads/media`

Multipart field:

```text
media=<file>
```

Response:

```json
{
  "data": {
    "id": "MEDIA_ASSET_ID",
    "type": "image",
    "url": "http://localhost:5000/uploads/uuid.jpg"
  }
}
```

### Delete media

`DELETE /api/uploads/media/:id`

The media is deleted from MongoDB and the physical file is removed from `uploads/`.

Deletion is allowed for the media owner or an admin. A media file that is still referenced by a news item cannot be deleted directly; remove it from the news first.
