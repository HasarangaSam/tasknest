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
      <section className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-slate-600">Loading user...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/admin" className="text-sm font-medium text-blue-600">
          ← Back to users
        </Link>

        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error || "User not found."}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to="/admin"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to users
      </Link>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900">User details</h1>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm text-slate-500">Name</p>

            <p className="mt-1 font-medium text-slate-900">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email</p>

            <p className="mt-1 font-medium text-slate-900">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Role</p>

            <p className="mt-1 font-medium text-slate-900">{user.role}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Created</p>

            <p className="mt-1 font-medium text-slate-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Last updated</p>

            <p className="mt-1 font-medium text-slate-900">
              {new Date(user.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
