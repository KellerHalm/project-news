# Deployment

The workflow in `.github/workflows/deploy.yml` deploys both applications after each push to `main`.

## GitHub Actions secrets

Add these repository secrets in **Settings → Secrets and variables → Actions**:

| Secret | Value |
| --- | --- |
| `SERVER_HOST` | Server IP address or domain name |
| `SERVER_USER` | SSH user that owns the application directory |
| `SERVER_PORT` | SSH port, usually `22` |
| `SSH_PRIVATE_KEY` | Private SSH key for `SERVER_USER` |
| `SERVER_APP_PATH` | Absolute path to the repository on the server, for example `/home/news/project-news` |

## One-time server setup

Clone this repository into `SERVER_APP_PATH`, install Node.js 22 and PM2 globally, then create environment files that are not committed to Git:

```bash
cd /home/news/project-news/khoam-backend
cp .env.example .env
```

Set production values in `khoam-backend/.env`, including `MONGODB_URI`, a long `JWT_SECRET`, `NODE_ENV=production`, `PORT=5000`, and the public frontend address in `FRONTEND_URL`.

Create `khoam-frontend/.env.local` with the public API address visible from browsers:

```env
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

Use Nginx or another reverse proxy to expose the frontend on port 3000 and the backend on port 5000. The proxy should route the API domain to port 5000 and the site domain to port 3000.
