import { useAuth } from "../context/auth-context.js";

export function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.name}
        </h1>

        <p className="mt-2 text-slate-600">Manage your tasks from TaskNest.</p>
      </div>
    </main>
  );
}
