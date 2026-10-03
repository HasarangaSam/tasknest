import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";

export function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      {/* Page header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          Dashboard
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's an overview of your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Account card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Account Type
          </p>
          <p className="mt-2 text-xl font-bold text-slate-900">{user?.role}</p>
          <div
            className={`mt-3 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              user?.role === "ADMIN"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {user?.role === "ADMIN" ? "Admin privileges" : "Standard user"}
          </div>
        </div>

        {/* Email card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Email
          </p>
          <p className="mt-2 break-all text-base font-semibold text-slate-900">
            {user?.email}
          </p>
        </div>

        {/* Tasks card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Tasks
          </p>
          <p className="mt-2 text-sm text-slate-600">
            View, manage and track all your tasks.
          </p>
          <Link
            to="/tasks"
            className="mt-3 inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Go to Tasks →
          </Link>
        </div>
      </div>
    </section>
  );
}
