import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth-context.js";
import { apiRequest } from "../../lib/api.js";
import type {
  Task,
  TaskListResponse,
  TaskPriority,
  TaskStatus,
} from "../../types/task.js";

const statusOptions: Array<{
  value: TaskStatus;
  label: string;
}> = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const priorityOptions: Array<{
  value: TaskPriority;
  label: string;
}> = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

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

export function Tasks() {
  const { token } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      if (!token) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", "10");
        params.set("sortBy", sortBy);
        params.set("order", order);

        if (status) {
          params.set("status", status);
        }

        if (priority) {
          params.set("priority", priority);
        }

        const response = await apiRequest<TaskListResponse>(
          `/tasks?${params.toString()}`,
          {
            token,
          },
        );

        setTasks(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalTasks(response.meta.total);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load tasks",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadTasks();
  }, [token, page, status, priority, sortBy, order]);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setPage(1);
  };

  const handleOrderChange = (value: string) => {
    setOrder(value);
    setPage(1);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-600">Task Management</p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">Tasks</h1>

          <p className="mt-2 text-slate-600">
            {totalTasks} task{totalTasks === 1 ? "" : "s"} found.
          </p>
        </div>

        <Link
          to="/tasks/new"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Create Task
        </Link>
      </div>

      <div className="mt-8 rounded-xl border bg-white p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) => handleStatusChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All statuses</option>

              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="priority"
              value={priority}
              onChange={(event) => handlePriorityChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">All priorities</option>

              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="sortBy"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Sort by
            </label>

            <select
              id="sortBy"
              value={sortBy}
              onChange={(event) => handleSortChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="createdAt">Created date</option>
              <option value="updatedAt">Updated date</option>
              <option value="dueDate">Due date</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="order"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Order
            </label>

            <select
              id="order"
              value={order}
              onChange={(event) => handleOrderChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 rounded-xl border bg-white p-10 text-center">
          <p className="text-slate-600">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="mt-6 rounded-xl border bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No tasks found
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Create a task or change your filters.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between rounded-xl border bg-white p-4">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <p className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </p>

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <article className="rounded-xl border bg-white p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="min-w-0">
          <Link
            to={`/tasks/${task.id}`}
            className="text-xl font-semibold text-slate-900 hover:text-blue-600"
          >
            {task.title}
          </Link>

          {task.description && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
              {task.description}
            </p>
          )}

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

        <div className="text-sm text-slate-500 sm:text-right">
          <p>Due: {formatDate(task.dueDate)}</p>

          <p className="mt-1">Created: {formatDate(task.createdAt)}</p>

          {task.user && <p className="mt-1">Owner: {task.user.name}</p>}
        </div>
      </div>
    </article>
  );
}
