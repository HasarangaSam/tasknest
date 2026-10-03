import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { apiRequest } from "../../lib/api.js";
import type { User, UserRole } from "../../types/auth.js";

export function Admin() {
  const { token } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      if (!token) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await apiRequest<User[]>("/users", {
          token,
        });

        setUsers(response);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load users",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();
  }, [token]);

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <p className="text-sm font-medium text-blue-600">Administration</p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">Users</h1>

        <p className="mt-2 text-slate-600">
          Manage TaskNest users and their roles.
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 rounded-xl border bg-white p-10 text-center">
          <p className="text-slate-600">Loading users...</p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Name
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Email
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Role
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    token={token}
                    onUpdated={(updatedUser) => {
                      setUsers((currentUsers) =>
                        currentUsers.map((currentUser) =>
                          currentUser.id === updatedUser.id
                            ? updatedUser
                            : currentUser,
                        ),
                      );
                    }}
                    onDeleted={(deletedId) => {
                      setUsers((currentUsers) =>
                        currentUsers.filter(
                          (currentUser) => currentUser.id !== deletedId,
                        ),
                      );
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

interface UserRowProps {
  user: User;
  token: string | null;
  onUpdated: (user: User) => void;
  onDeleted: (userId: number) => void;
}

function UserRow({ user, token, onUpdated, onDeleted }: UserRowProps) {
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState<UserRole>(user.role);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!token) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const updatedUser = await apiRequest<User>(`/users/${user.id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({
          name,
          role,
        }),
      });

      onUpdated(updatedUser);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update user",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${user.name}? This will also delete their tasks.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await apiRequest(`/users/${user.id}`, {
        method: "DELETE",
        token,
      });

      onDeleted(user.id);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete user",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr>
      <td className="px-6 py-4">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full min-w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>

      <td className="px-6 py-4">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </td>

      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/admin/users/${user.id}`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            View
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
