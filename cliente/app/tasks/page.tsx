"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getTasks,
  createTask,
  updateTask,
  getUsers,
  Task,
  TaskPayload,
} from "../lib/api";

const STATUSES: Task["status"][] = [
  "To Do",
  "In Progress",
  "Code Review",
  "PR Review",
  "Dev Complete",
];
const PRIORITIES: Task["priority"][] = ["Low", "Medium", "High", "HIGHEST"];

const STATUS_COLORS: Record<Task["status"], string> = {
  "To Do": "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Code Review": "bg-yellow-100 text-yellow-700",
  "PR Review": "bg-purple-100 text-purple-700",
  "Dev Complete": "bg-green-100 text-green-700",
};

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  Low: "bg-gray-100 text-gray-600",
  Medium: "bg-orange-100 text-orange-600",
  High: "bg-red-100 text-red-600",
  HIGHEST: "bg-red-200 text-red-800 font-semibold",
};

type User = { id: number; firstName: string; lastName: string; email: string };

const EMPTY_FORM: TaskPayload = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Low",
  dueDate: null,
  developerId: null,
};

export default function TasksPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState<TaskPayload>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      setToken(t);
      setUserId(payload.id ?? null);
      fetchData(t, payload.id);
    } catch {
      router.push("/login");
    }
  }, []);

  async function fetchData(t: string, uid: number) {
    setLoading(true);
    setError("");
    try {
      const [taskData, userData] = await Promise.all([
        getTasks(t, uid),
        getUsers(t),
      ]);
      setTasks(taskData);
      setUsers(userData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ ...EMPTY_FORM, developerId: userId });
    setFormError("");
    setShowCreate(true);
  }

  function openEdit(task: Task) {
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? null,
      developerId: task.developerId,
    });
    setFormError("");
    setEditTask(task);
  }

  function closeModals() {
    setShowCreate(false);
    setEditTask(null);
    setForm(EMPTY_FORM);
    setFormError("");
  }

  async function handleCreate() {
    if (!token || !form.title || !form.description) {
      setFormError("Title and description are required");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const task = await createTask(token, form);
      if (task.developerId === userId) setTasks((prev) => [task, ...prev]);
      closeModals();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate() {
    if (!token || !editTask) return;
    setSubmitting(true);
    setFormError("");
    try {
      const updated = await updateTask(token, editTask.id, form);
      setTasks((prev) =>
        updated.developerId === userId
          ? prev.map((t) => (t.id === updated.id ? updated : t))
          : prev.filter((t) => t.id !== updated.id),
      );
      closeModals();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setSubmitting(false);
    }
  }

  function field(key: keyof TaskPayload, value: string | number | null) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 text-black">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="text-sm text-gray-500 hover:text-gray-800 transition"
            >
              Home
            </button>
            <span className="text-gray-300">/</span>
            <h1 className="text-2xl font-bold">My Tasks</h1>
          </div>
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            + Create Task
          </button>
        </div>

        {loading && <p className="text-center text-sm text-gray-500">Loading...</p>}
        {error && <p className="text-center text-sm text-red-600">{error}</p>}

        {!loading && tasks.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-20">
            No tasks assigned to you yet.
          </p>
        )}

        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id}>
              <button
                onClick={() => openEdit(task)}
                className="w-full text-left bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[task.status]}`}>
                      {task.status}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                {task.dueDate && (
                  <p className="text-xs text-gray-400 mt-3">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {(showCreate || editTask) && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={closeModals}
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-5">
              {editTask ? "Edit Task" : "Create Task"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Title</label>
                <input
                  value={form.title ?? ""}
                  onChange={(e) => field("title", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Description</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => field("description", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => field("status", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => field("priority", e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate ?? ""}
                  onChange={(e) => field("dueDate", e.target.value || null)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Assign To</label>
                <select
                  value={form.developerId ?? ""}
                  onChange={(e) => field("developerId", e.target.value ? Number(e.target.value) : null)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.firstName} {u.lastName}{u.id === userId ? " (me)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formError && (
              <p className="text-xs text-red-600 mt-3">{formError}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModals}
                className="flex-1 py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={editTask ? handleUpdate : handleCreate}
                disabled={submitting}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {submitting ? "Saving..." : editTask ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
