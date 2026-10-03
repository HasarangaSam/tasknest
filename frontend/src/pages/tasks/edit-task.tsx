import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TaskForm } from "../../components/task-form.js";
import { useAuth } from "../../context/auth-context.js";
import { apiRequest } from "../../lib/api.js";
import type { Task } from "../../types/task.js";

export function EditTask() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const handleSubmit = async (values: {
    title: string;
    description: string;
    status: "TODO" | "IN_PROGRESS" | "COMPLETED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: string;
  }) => {
    if (!token || !id) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await apiRequest(`/tasks/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          ...(values.dueDate
            ? { dueDate: new Date(values.dueDate).toISOString() }
            : {}),
        }),
      });

      navigate(`/tasks/${id}`, { replace: true });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update task",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-slate-600">Loading task...</p>
      </section>
    );
  }

  if (!task) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-10">
        <Link to="/tasks" className="text-sm font-medium text-blue-600">
          ← Back to tasks
        </Link>

        <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {error || "Task not found."}
        </div>
      </section>
    );
  }

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toISOString().split("T")[0]
    : "";

  return (
    <section className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6">
        <Link
          to={`/tasks/${task.id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to task
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">Edit Task</h1>

        <p className="mt-2 text-slate-600">Update the task details.</p>
      </div>

      <TaskForm
        initialValues={{
          title: task.title,
          description: task.description ?? "",
          status: task.status,
          priority: task.priority,
          dueDate,
        }}
        submitLabel="Save changes"
        isSubmitting={isSubmitting}
        error={error}
        showStatus
        onSubmit={handleSubmit}
      />
    </section>
  );
}
