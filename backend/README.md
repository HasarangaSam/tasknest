# TaskNest — Backend

NestJS REST API for TaskNest, backed by PostgreSQL via Prisma.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your values
npx prisma migrate dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | JWT expiry duration (e.g. `1d`) |
| `PORT` | Port to listen on (default `3000`) |

## Scripts

```bash
npm run start:dev    # Development (watch mode)
npm run start:prod   # Production
npm run build        # Compile TypeScript
npm run test         # Unit tests (Vitest)
npm run test:e2e     # End-to-end tests
npm run test:cov     # Coverage report
npm run lint         # Lint with OxLint
npm run format       # Format with Prettier
```

## Module Structure

```
src/
├── auth/       # JWT authentication & guards
├── users/      # User CRUD & role management
├── tasks/      # Task CRUD & filtering
├── prisma/     # Prisma service
└── common/     # Shared pipes, decorators, filters
```

See the [root README](../README.md) for full API reference.
