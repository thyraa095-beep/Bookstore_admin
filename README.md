# Bookstore_admin

Admin dashboard for the **Book Store** e-learning platform.

Built with **ReactJS + TypeScript + Tailwind CSS (CDN)** and connected to the
**FastAPI backend** (`/api/v1`).

## Pages
- **Login** — admin-only authentication (JWT)
- **Dashboard** — stats cards + inventory summary
- **Products** — full CRUD (add / edit / activate / delete)
- **Services** — full CRUD
- **Users** — manage roles and account status
- **Messages** — customer contact inbox
- **Database** — backup (download JSON) & import (restore)

## Setup

```bash
npm install
npm start              # http://localhost:3001
```

> Backend must be running on http://127.0.0.1:8000 (see the Bookstore repo).

## Environment

Optionally create a `.env` file to change the API URL:

```
REACT_APP_API_URL=http://127.0.0.1:8000/api/v1
```

## Build for production

```bash
npm run build
```

## Default admin

```
admin@bookstore.com / admin123
```
