# Nodepad Frontend

React frontend for the Nodepad full-stack notes application.

## Features

- Login, registration, and email verification
- JWT session persistence
- Per-user notes backed by the Spring Boot API
- Responsive sidebar note navigation
- Theme switching

## Environment variable

```env
VITE_API_BASE_URL=https://nodepad-backend.onrender.com
```

For local development, you can omit `VITE_API_BASE_URL` and the app will use:

- `http://localhost:8080` in development
- `/api` in production when configured behind a proxy

## Local development

```powershell
npm install
npm run dev
```

## Production build

```powershell
npm run build
```
