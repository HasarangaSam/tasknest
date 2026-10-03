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
    <section className="mx-auto max-w-3xl px-6 py-10">
      <div>
        <p className="text-sm font-medium text-blue-600">Account</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">Profile</h1>

        <p className="mt-2 text-slate-600">
          View and update your account information.
        </p>
      </div>

      <div className="mt-8 rounded-xl border bg-white p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Email</p>

            <p className="mt-1 font-medium text-slate-900">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Role</p>

            <p className="mt-1 font-medium text-slate-900">{user.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 border-t pt-8">
          <div>
            <label
              htmlFor="profile-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          {message && (
            <p className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </section>
  );
}
