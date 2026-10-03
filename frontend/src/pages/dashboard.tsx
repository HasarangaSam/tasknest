import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context.js";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">TaskNest</h1>

            <p className="text-sm text-slate-500">Task management</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Welcome, {user?.name}
        </h2>

        <p className="mt-2 text-slate-600">
          You are signed in as {user?.role}.
        </p>
      </section>
    </main>
  );
}
