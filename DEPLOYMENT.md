# Полная инструкция по публикации проекта

Эта инструкция рассчитана на новый сервер с Ubuntu 22.04 или 24.04. После настройки сайт будет доступен по адресу `https://example.com`, API — по адресу `https://api.example.com`, а каждое изменение, отправленное в ветку `main`, будет автоматически устанавливаться на сервер через GitHub Actions.

Во всех примерах заменяйте значения в угловых скобках на свои. Например, `<SITE_DOMAIN>` нужно заменить на настоящий домен сайта: `news.example.com`.

## Что должно быть заранее

Нужно подготовить:

1. VPS-сервер с Ubuntu и публичным IP-адресом.
2. Домен для сайта и отдельный поддомен для API. Например: `news.example.com` и `api.news.example.com`.
3. Учётную запись GitHub.
4. MongoDB Atlas или работающий MongoDB-сервер.
5. Этот проект в одном Git-репозитории: в корне должны лежать папки `khoam-frontend`, `khoam-backend` и `.github/workflows/deploy.yml`.

## 1. Подготовьте единый Git-репозиторий

Перед публикацией обе папки не должны быть отдельными Git-репозиториями. Если внутри `khoam-backend` или `khoam-frontend` есть скрытая папка `.git`, удалите её.

В PowerShell, находясь в папке `project-news`, выполните:

```powershell
git init
git add .
git commit -m "Initial deployment setup"
git branch -M main
```

На GitHub создайте новый пустой репозиторий, без README и `.gitignore`. Затем привяжите его к локальному проекту и отправьте код:

```powershell
git remote add origin https://github.com/<YOUR_GITHUB_LOGIN>/<REPOSITORY_NAME>.git
git push -u origin main
```

Проверьте, что файл `.github/workflows/deploy.yml` появился в репозитории GitHub. Только файлы в этом месте GitHub воспринимает как workflow.

## 2. Привяжите домены к серверу

У регистратора домена или в панели DNS добавьте две записи типа `A`:

| Имя | Значение |
| --- | --- |
| `@` или имя сайта | Публичный IP вашего сервера |
| `api` | Публичный IP этого же сервера |

Если используете поддомен сайта, например `news.example.com`, добавьте запись `news`, а для API добавьте `api.news` или отдельный нужный поддомен.

Подождите, пока DNS обновится. Это может занять от нескольких минут до нескольких часов.

## 3. Подключитесь к серверу

С компьютера откройте PowerShell и подключитесь к серверу:

```powershell
ssh root@<SERVER_IP>
```

Если сервер выдан с другим пользователем, замените `root` на его имя.

Дальше команды из этой инструкции выполняются **на сервере**, в терминале после SSH-подключения.

## 4. Установите системные программы

Обновите список пакетов и установите Git, Nginx и Certbot:

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git nginx certbot python3-certbot-nginx curl
```

Установите Node.js 22. Если на сервере уже установлен Node.js, сначала проверьте версию:

```bash
node -v
```

Должна быть версия `v22` или новее. Если Node.js отсутствует или версия ниже 22, установите его через NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

Проверьте установку:

```bash
node -v
npm -v
```

Установите PM2 — он будет держать приложения запущенными после выхода из SSH:

```bash
sudo npm install -g pm2
pm2 --version
```

## 5. Создайте пользователя для деплоя

Лучше не выполнять деплой от `root`. Создайте отдельного пользователя, например `news`:

```bash
sudo adduser news
sudo usermod -aG sudo news
sudo su - news
```

Все следующие команды выполняйте от имени `news`.

## 6. Создайте SSH-ключ для GitHub Actions

На сервере выполните:

```bash
ssh-keygen -t ed25519 -C "github-actions-news" -f ~/.ssh/github_actions_news
```

На вопросы о passphrase просто нажмите Enter два раза. Покажите публичную часть ключа:

```bash
cat ~/.ssh/github_actions_news.pub
```

Скопируйте всю строку. Затем в отдельном терминале на вашем компьютере войдите на сервер как пользователь `news` и добавьте этот ключ в разрешённые:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
cat ~/.ssh/github_actions_news.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Покажите приватную часть ключа:

```bash
cat ~/.ssh/github_actions_news
```

Скопируйте её целиком, включая строки `BEGIN OPENSSH PRIVATE KEY` и `END OPENSSH PRIVATE KEY`. Она понадобится как GitHub Secret `SSH_PRIVATE_KEY`. Никому её не отправляйте и не добавляйте в Git.

## 7. Клонируйте репозиторий на сервер

От имени пользователя `news` создайте каталог и скачайте проект:

```bash
mkdir -p /home/news
cd /home/news
git clone https://github.com/<YOUR_GITHUB_LOGIN>/<REPOSITORY_NAME>.git project-news
cd /home/news/project-news
```

Если репозиторий закрытый, настройте для сервера отдельный SSH-ключ GitHub Deploy Key или используйте HTTPS с токеном. Для публичного репозитория команда выше работает сразу.

## 8. Настройте MongoDB

Самый простой вариант — MongoDB Atlas. В Atlas:

1. Создайте cluster.
2. Создайте Database User с паролем.
3. В Network Access добавьте IP-адрес сервера.
4. Скопируйте connection string. Он похож на `mongodb+srv://USER:PASSWORD@cluster.mongodb.net/news_blog?...`.

Не добавляйте этот адрес в GitHub или Git. Он будет храниться только в `.env` на сервере.

## 9. Создайте production-конфигурацию

Перейдите в папку бэкенда:

```bash
cd /home/news/project-news/khoam-backend
cp .env.example .env
nano .env
```

Заполните `.env` по образцу:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/news_blog?retryWrites=true&w=majority
JWT_SECRET=<LONG_RANDOM_SECRET>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://<SITE_DOMAIN>
MAX_FILE_SIZE_MB=10
ADMIN_NAME=Site Admin
ADMIN_EMAIL=admin@<SITE_DOMAIN>
ADMIN_PASSWORD=<STRONG_ADMIN_PASSWORD>
```

Чтобы создать безопасный `JWT_SECRET`, выполните и вставьте результат в файл:

```bash
openssl rand -hex 32
```

Сохраните файл в Nano: `Ctrl + O`, Enter, затем `Ctrl + X`.

Создайте конфигурацию фронтенда:

```bash
cd /home/news/project-news/khoam-frontend
nano .env.local
```

Добавьте строку:

```env
NEXT_PUBLIC_API_URL=https://api.<SITE_DOMAIN>/api
```

Если API должен быть, например, `https://api.news.example.com`, укажите именно этот адрес.

## 10. Установите и впервые запустите приложения

Бэкенд:

```bash
cd /home/news/project-news/khoam-backend
npm ci
npm run build
pm2 start npm --name khoam-backend -- start
```

Фронтенд:

```bash
cd /home/news/project-news/khoam-frontend
npm ci
npm run build
pm2 start npm --name khoam-frontend -- start -- -p 3000
```

Сохраните процессы и включите их автоматический запуск после перезагрузки сервера:

```bash
pm2 save
pm2 startup
```

Команда `pm2 startup` покажет ещё одну команду. Скопируйте и выполните её. Затем проверьте процессы:

```bash
pm2 status
```

Должны отображаться `khoam-backend` и `khoam-frontend` со статусом `online`.

Проверьте API напрямую на сервере:

```bash
curl http://127.0.0.1:5000/health
```

Ожидаемый ответ:

```json
{"data":{"status":"ok"}}
```

## 11. Настройте Nginx

Создайте конфигурацию для сайта:

```bash
sudo nano /etc/nginx/sites-available/news
```

Вставьте конфигурацию. Замените домены на свои:

```nginx
server {
    listen 80;
    server_name <SITE_DOMAIN>;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.<SITE_DOMAIN>;

    client_max_body_size 12m;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Включите конфигурацию и проверьте синтаксис:

```bash
sudo ln -s /etc/nginx/sites-available/news /etc/nginx/sites-enabled/news
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 12. Получите HTTPS-сертификаты

После того как домены уже указывают на сервер, выполните:

```bash
sudo certbot --nginx -d <SITE_DOMAIN> -d api.<SITE_DOMAIN>
```

Введите e-mail, примите условия и выберите перенаправление HTTP на HTTPS, когда Certbot предложит это сделать.

Проверьте автоматическое продление сертификатов:

```bash
sudo certbot renew --dry-run
```

## 13. Добавьте Secrets в GitHub

Откройте репозиторий GitHub: **Settings → Secrets and variables → Actions → New repository secret**.

Добавьте значения:

| Имя секрета | Что указать |
| --- | --- |
| `SERVER_HOST` | IP-адрес сервера или его домен |
| `SERVER_USER` | `news` |
| `SERVER_PORT` | `22`, если SSH-порт не меняли |
| `SSH_PRIVATE_KEY` | Содержимое файла `~/.ssh/github_actions_news` на сервере |
| `SERVER_APP_PATH` | `/home/news/project-news` |

## 14. Проверьте автоматический деплой

На компьютере измените любой файл проекта, затем выполните:

```powershell
git add .
git commit -m "Test deployment"
git push origin main
```

В GitHub откройте вкладку **Actions**. Workflow `Deploy news application` должен завершиться зелёной галочкой.

После этого откройте в браузере:

```text
https://<SITE_DOMAIN>
https://api.<SITE_DOMAIN>/health
```

## Если что-то не работает

Посмотреть логи приложений:

```bash
pm2 logs khoam-backend
pm2 logs khoam-frontend
```

Перезапустить приложения вручную:

```bash
pm2 restart khoam-backend
pm2 restart khoam-frontend
```

Проверить Nginx:

```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -n 100 /var/log/nginx/error.log
```

Проверить, что на сервере лежит свежий код:

```bash
cd /home/news/project-news
git status
git log -1 --oneline
```
