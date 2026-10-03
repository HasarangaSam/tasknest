import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";

export function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <p className="text-sm font-medium text-blue-600">Dashboard</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Welcome, {user?.name}
        </h1>

        <p className="mt-2 text-slate-600">
          Manage your tasks and keep track of your progress.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Account</p>

          <p className="mt-2 text-lg font-semibold text-slate-900">
            {user?.role}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Email</p>

          <p className="mt-2 break-all text-lg font-semibold text-slate-900">
            {user?.email}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <p className="text-sm text-slate-500">Tasks</p>

          <Link
            to="/tasks"
            className="mt-2 inline-block text-lg font-semibold text-blue-600 hover:text-blue-700"
          >
            View your tasks →
          </Link>
        </div>
      </div>
    </section>
  );
}
