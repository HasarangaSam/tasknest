# TaskNest

A full-stack task management application with role-based access control, built with **NestJS** and **React**.

## Overview

TaskNest lets users create, manage, and track tasks with filtering, sorting, and pagination. Administrators can manage all users and their roles from a dedicated admin panel.

## Tech Stack

### Backend
| Layer | Technology |
|---|---|
| Framework | [NestJS](https://nestjs.com/) v12 |
| Language | TypeScript |
| Database | PostgreSQL (via [Prisma](https://www.prisma.io/) ORM) |
| Auth | JWT (Bearer token) |
| Testing | Vitest + Supertest |
| Linting | OxLint |

### Frontend
| Layer | Technology |
|---|---|
| Framework | [React](https://react.dev/) v19 + [Vite](https://vite.dev/) v8 |
| Language | TypeScript |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Font | Inter (Google Fonts) |

---

## Project Structure

```
tasknest/
├── backend/      # NestJS API server
└── frontend/     # React SPA
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### 1. Clone the repository

```bash
git clone <repo-url>
cd tasknest
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Copy the environment file and fill in your values:

```bash
cp .env.example .env
```

**.env variables:**
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/tasknest?schema=public"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="1d"
PORT=3000
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

---

### 3. Set up the Frontend

```bash
cd frontend
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

**.env variables:**
```env
VITE_API_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Features

- **Authentication** — Register and login with JWT-based sessions
- **Task Management** — Create, view, edit, and delete tasks
- **Filtering & Sorting** — Filter tasks by status or priority; sort by date or title
- **Pagination** — Server-side paginated task list
- **Role-based Access** — `USER` and `ADMIN` roles
- **Admin Panel** — Admins can view, edit roles, and delete any user
- **Profile** — Users can update their display name

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | Public |
| `POST` | `/auth/login` | Login and receive a JWT | Public |
| `GET` | `/users/me` | Get current user | User |
| `PATCH` | `/users/me` | Update current user's name | User |
| `GET` | `/users` | List all users | Admin |
| `GET` | `/users/:id` | Get a user by ID | Admin |
| `PATCH` | `/users/:id` | Update a user | Admin |
| `DELETE` | `/users/:id` | Delete a user | Admin |
| `GET` | `/tasks` | List tasks (paginated, filtered) | User |
| `POST` | `/tasks` | Create a task | User |
| `GET` | `/tasks/:id` | Get a task by ID | User |
| `PATCH` | `/tasks/:id` | Update a task | User/Admin |
| `DELETE` | `/tasks/:id` | Delete a task | User/Admin |

## Scripts

### Backend

```bash
npm run start:dev    # Start in watch mode
npm run start:prod   # Start production build
npm run build        # Compile TypeScript
npm run test         # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:cov     # Run tests with coverage
npm run lint         # Lint with OxLint
```

### Frontend

```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint with ESLint
```

## License

MIT
