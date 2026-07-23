# Consume

A self-hosted personal digital library. Capture and organize links — videos, books, articles, podcasts, and news — in one place.

Built for [CasaOS](https://casaos.zimaspace.com/) but runs anywhere Docker runs.

---

## Features

- Add links by URL — metadata (title, thumbnail, description, author) is fetched server-side
- Organize by type: Videos, Books, Articles, Podcasts — and create custom categories
- Upload or paste custom thumbnails
- Export and import your library as JSON
- Multi-user with **admin** and **user** roles
- Admin panel: create users, purge items, manage roles
- Dark mode

---

## Upcoming

- **Tagging** — add `#tags` to any item; filter your library by one or more tags
- **Search** — find items by title, tag, or category; full-text search across your library
- **Global search** — `⌘K` command palette to jump anywhere from any screen
- **Archive** — move items out of the active library without deleting them; browse or restore later

---

## Tech

- **Frontend** — React, Vite, Zustand, Tailwind CSS
- **Backend** — Hono (Node.js), postgres.js
- **Auth** — JWT in httpOnly cookie, bcrypt passwords
- **Database** — PostgreSQL
- **Images** — uploaded thumbnails stored on a mounted volume

---

## Running on CasaOS

1. Open CasaOS → **App Store** → **Custom Install → Import**
2. Paste this URL:
   ```
   https://raw.githubusercontent.com/abhi11verma/Consume/main/docker-compose.yml
   ```
3. Fill in the env vars when prompted:
   - `JWT_SECRET` — run `openssl rand -hex 32` and paste the output
   - `ADMIN_EMAIL` — your admin login email
   - `ADMIN_PASSWORD` — your admin login password
4. Click Install

CasaOS will pull the image, create the database, and start the app. Open it from the CasaOS dashboard.

---

## Running locally with Docker

**1. Clone and configure**
```bash
git clone https://github.com/abhi11verma/Consume.git
cd Consume
cp .env.example .env
```

Edit `.env`:
```env
JWT_SECRET=<run: openssl rand -hex 32>
ADMIN_EMAIL=admin@local.home
ADMIN_PASSWORD=yourpassword
WEBUI_PORT=8080
```

**2. Start**
```bash
docker compose up -d
```

Open `http://localhost:8080` and log in with your admin credentials.

Data is stored in `./data/` relative to the project directory.

---

## Running locally for development

Requires Node.js 20+ and a local PostgreSQL instance.

**1. Install dependencies**
```bash
npm install
```

**2. Set environment variables**
```bash
export DATABASE_URL=postgres://localhost/consume
export JWT_SECRET=any-dev-secret
export ADMIN_EMAIL=admin@local.home
export ADMIN_PASSWORD=password
export IMAGES_DIR=/tmp/consume-images
mkdir -p /tmp/consume-images
```

**3. Create the database**
```bash
createdb consume
```

**4. Start dev servers**
```bash
npm run dev
```

Opens Vite on `http://localhost:5173` (proxies API calls to the server on port 3000).

---

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `JWT_SECRET` | Secret for signing JWT tokens — use a random string | required |
| `ADMIN_EMAIL` | Email for the initial admin account | required |
| `ADMIN_PASSWORD` | Password for the initial admin account | required |
| `DATABASE_URL` | PostgreSQL connection string | required |
| `WEBUI_PORT` | Port to expose the web UI on | `3000` |
| `IMAGES_DIR` | Directory to store uploaded images | `/data/images` |

---

## User roles

| Role | Access |
|---|---|
| `admin` | Full access — manage users, view/purge any user's items |
| `user` | Own items only — add, edit, delete |

The first admin account is created automatically from `ADMIN_EMAIL` / `ADMIN_PASSWORD` on first run. Additional users are created by an admin through the UI.
