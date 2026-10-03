import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TaskForm } from "../../components/task-form.js";
import { useAuth } from "../../context/auth-context.js";
import { apiRequest } from "../../lib/api.js";

interface CreateTaskValues {
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string;
}

export function CreateTask() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values: CreateTaskValues) => {
    if (!token) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await apiRequest("/tasks", {
        method: "POST",
        token,
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          priority: values.priority,
          ...(values.dueDate
            ? { dueDate: new Date(values.dueDate).toISOString() }
            : {}),
        }),
      });

      navigate("/tasks", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create task",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-4">
        <Link
          to="/tasks"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          ← Back to tasks
        </Link>

        <h1 className="mt-3 text-2xl font-bold text-slate-900">Create Task</h1>

        <p className="mt-0.5 text-sm text-slate-500">
          Add a new task to your task list.
        </p>
      </div>

      <TaskForm
        submitLabel="Create task"
        isSubmitting={isSubmitting}
        error={error}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
