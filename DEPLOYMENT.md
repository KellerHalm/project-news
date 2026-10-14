# Развёртывание проекта

Workflow в `.github/workflows/deploy.yml` автоматически развёртывает фронтенд и бэкенд после каждого push в ветку `main`.

## Секреты GitHub Actions

В репозитории GitHub откройте **Settings → Secrets and variables → Actions** и добавьте следующие секреты:

| Секрет | Значение |
| --- | --- |
| `SERVER_HOST` | IP-адрес или домен сервера |
| `SERVER_USER` | Пользователь SSH, которому принадлежит каталог приложения |
| `SERVER_PORT` | Порт SSH, обычно `22` |
| `SSH_PRIVATE_KEY` | Приватный SSH-ключ пользователя `SERVER_USER` |
| `SERVER_APP_PATH` | Абсолютный путь к репозиторию на сервере, например `/home/news/project-news` |

## Первоначальная настройка сервера

Клонируйте репозиторий в каталог `SERVER_APP_PATH`, установите Node.js 22 и PM2 глобально. Затем создайте файлы окружения — они не должны попадать в Git:

```bash
cd /home/news/project-news/khoam-backend
cp .env.example .env
```

В `khoam-backend/.env` задайте production-значения, включая `MONGODB_URI`, длинный `JWT_SECRET`, `NODE_ENV=production`, `PORT=5000` и публичный адрес фронтенда в `FRONTEND_URL`.

Создайте `khoam-frontend/.env.local` с публичным адресом API, который будет доступен из браузера:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

Для публикации приложения используйте Nginx или другой reverse proxy. Он должен направлять запросы API-домена на порт `5000`, а запросы основного домена сайта — на порт `3000`.
