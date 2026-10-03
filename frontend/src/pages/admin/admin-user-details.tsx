import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { apiRequest } from "../../lib/api.js";
import type { User } from "../../types/auth.js";

export function AdminUserDetails() {
  const { id } = useParams();
  const { token } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      if (!token || !id) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await apiRequest<User>(`/users/${id}`, {
          token,
        });

        setUser(response);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load user",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, [token, id]);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-6">
        <p className="text-sm text-slate-500">Loading user...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-6">
        <Link to="/admin" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          ← Back to users
        </Link>

        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-100">
          {error || "User not found."}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-6">
      <Link
        to="/admin"
        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        ← Back to users
      </Link>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">User Details</h1>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Name
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">{user.name}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">{user.email}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Role
            </p>
            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                user.role === "ADMIN"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {user.role}
            </span>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Created
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Last Updated
            </p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
