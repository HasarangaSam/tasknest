import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { apiRequest } from "../../lib/api.js";
import type { Task, TaskPriority, TaskStatus } from "../../types/task.js";

function formatStatus(status: TaskStatus) {
  return status.replace("_", " ");
}

function formatDate(date: string | null) {
  if (!date) {
    return "No due date";
  }

  return new Date(date).toLocaleDateString();
}

function getStatusClass(status: TaskStatus) {
  switch (status) {
    case "COMPLETED":
      return "bg-green-50 text-green-700";
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getPriorityClass(priority: TaskPriority) {
  switch (priority) {
    case "HIGH":
      return "bg-red-50 text-red-700";
    case "MEDIUM":
      return "bg-yellow-50 text-yellow-700";
    default:
      return "bg-green-50 text-green-700";
  }
}

export function TaskDetails() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (!token || !id) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await apiRequest<Task>(`/tasks/${id}`, {
          token,
        });

        setTask(response);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load task",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadTask();
  }, [token, id]);

  const handleDelete = async () => {
    if (!token || !id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      await apiRequest(`/tasks/${id}`, {
        method: "DELETE",
        token,
      });

      navigate("/tasks", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to delete task",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-slate-600">Loading task...</p>
      </section>
    );
  }

  if (error && !task) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/tasks" className="text-sm font-medium text-blue-600">
          ← Back to tasks
        </Link>

        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </section>
    );
  }

  if (!task) {
    return null;
  }

  const canEdit = user?.role === "ADMIN" || task.userId === user?.id;

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <Link
        to="/tasks"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to tasks
      </Link>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{task.title}</h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(task.status)}`}
              >
                {formatStatus(task.status)}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityClass(task.priority)}`}
              >
                {task.priority}
              </span>
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-2">
              <Link
                to={`/tasks/${task.id}/edit`}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-slate-900">Description</h2>

          <p className="mt-2 whitespace-pre-wrap text-slate-600">
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="mt-8 grid gap-6 border-t pt-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Due date</p>

            <p className="mt-1 font-medium text-slate-900">
              {formatDate(task.dueDate)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Owner</p>

            <p className="mt-1 font-medium text-slate-900">{task.user.name}</p>

            <p className="text-sm text-slate-500">{task.user.email}</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6 text-sm text-slate-500">
          <p>Created: {formatDate(task.createdAt)}</p>
          <p className="mt-1">Last updated: {formatDate(task.updatedAt)}</p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </div>
    </section>
  );
}
