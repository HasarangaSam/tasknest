# TaskNest — Frontend

React + TypeScript SPA for TaskNest, built with Vite and Tailwind CSS v4.

## Setup

```bash
npm install
cp .env.example .env   # then fill in your values
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:3000`) |

## Scripts

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint with ESLint
```

## Source Structure

```
src/
├── components/   # Shared components (TaskForm, ProtectedRoute, AdminRoute)
├── context/      # Auth context & provider
├── layouts/      # AppLayout (fixed nav + scrollable main)
├── lib/          # API request utility
├── pages/
│   ├── auth/     # Login, Register
│   ├── tasks/    # Tasks list, Task details, Create, Edit
│   ├── admin/    # Admin user list, User details
│   ├── dashboard.tsx
│   └── profile.tsx
└── types/        # Shared TypeScript types
```

See the [root README](../README.md) for full project documentation.
