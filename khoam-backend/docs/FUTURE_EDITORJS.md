# Future Editor.js integration

Editor.js пока отключён на frontend и не требуется backend-контрактом.

Сейчас новость создаётся так:

```json
{
  "title": "News title",
  "excerpt": "Обычный текст статьи",
  "medias": [],
  "category": "CATEGORY_ID"
}
```

`content` можно не передавать.

## Что уже оставлено для будущего

Backend сохраняет необязательное поле:

```text
News.content
```

Также есть типы:

```text
src/types/news.ts
```

Они описывают стандартный Editor.js Output Data:

```json
{
  "time": 1760000000000,
  "version": "2.x",
  "blocks": [
    {
      "type": "paragraph",
      "data": {
        "text": "Hello"
      }
    }
  ]
}
```

Поле в Mongoose специально имеет тип `Mixed`, поэтому backend не придётся переделывать под каждый новый Editor.js block.

## Когда frontend вернётся к Editor.js

Можно установить:

```bash
npm install @editorjs/editorjs @editorjs/header @editorjs/image @editorjs/list
```

Editor.js должен запускаться в Client Component.

После `editor.save()` результат можно отправлять:

```json
{
  "title": "News title",
  "excerpt": "Card/short text, если он снова понадобится",
  "medias": [],
  "content": {
    "time": 1760000000000,
    "version": "2.x",
    "blocks": []
  },
  "category": "CATEGORY_ID"
}
```

Для Image Tool уже сохранён endpoint:

```text
POST /api/uploads/image
```

Он возвращает форму:

```json
{
  "success": 1,
  "file": {
    "url": "http://localhost:5000/uploads/file.jpg"
  },
  "data": {
    "url": "http://localhost:5000/uploads/file.jpg"
  }
}
```

То есть Editor.js можно вернуть позже, не меняя сущности `User`, `News`, `Category` и `SavedNews`.
