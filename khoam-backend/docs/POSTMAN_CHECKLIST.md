# Postman checklist

1. `GET /health`
2. `POST /auth/register`
3. `POST /auth/login` admin → сохранить `adminToken`
4. `POST /admin/categories` → сохранить `categoryId`
5. `POST /admin/editors` → получить временный пароль и `editorId`
6. `POST /auth/login` editor → сохранить `editorToken`
7. `PATCH /users/me/password`
8. `GET /editors/me`
9. `PATCH /editors/me`
10. `POST /news` — создать draft с обычным `excerpt` и `medias[]`
11. `GET /news/my`
12. `PATCH /news/:id` — изменить текст/media
13. `PATCH /news/:id/publish`
14. `GET /news` без токена
15. `GET /news/:slug` без токена — проверить `views + 1`
16. `POST /news/:id/save` под user token
17. `GET /news/saved`
18. Admin: `PATCH /admin/editors/:id/block` → `isBlocked=true`
19. Editor: `PATCH /news/:id/publish` → должен получить `EDITOR_BLOCKED`
20. Admin: `PATCH /admin/editors/:id/block` → `isBlocked=false`
21. Admin: `PATCH /admin/news/:id/status` → `draft`
22. Admin: `PATCH /admin/news/:id/status` → `published`
23. Admin: `GET /admin/news?status=draft`
24. Admin: `GET /admin/news?status=published`
25. `POST /uploads/media` с image/video
26. Проверить, что 9 элементов в `medias[]` отклоняются
27. Проверить, что `excerpt` длиной более 5000 отклоняется

## Важно

- Публичные `/news` endpoints не требуют token.
- `views` считает каждое успешное открытие published news.
- Block editor не удаляет новости.
- Block editor не снимает уже опубликованные новости.
- Admin status change не создаёт специальной модерационной логики.


## Upload cleanup

- [ ] Upload image/media and save returned `mediaId`
- [ ] `DELETE /api/uploads/media/:id` removes the file
- [ ] Attempt to delete a media file still referenced by a news item -> `409 MEDIA_IN_USE`
- [ ] Remove media from a news item -> backend removes the local file when no other news references it
- [ ] External media URLs are never deleted by backend
