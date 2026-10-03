import { useState } from "react";
import { useAuth } from "../context/auth-context.js";
import { apiRequest } from "../lib/api.js";
import type { User } from "../types/auth.js";

export function Profile() {
  const { user, token, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      await apiRequest<User>("/users/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({
          name,
        }),
      });

      await refreshUser();

      setMessage("Profile updated successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          Account
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          View and update your account information.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Read-only info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email
            </p>
            <p className="mt-1 font-medium text-slate-900">{user.email}</p>
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
        </div>

        {/* Edit form */}
        <form onSubmit={handleSubmit} className="mt-6 border-t border-slate-100 pt-6">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Display Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {message && (
            <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </section>
  );
}
