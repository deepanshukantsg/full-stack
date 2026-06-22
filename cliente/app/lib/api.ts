const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function registerUser(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Registration failed");
  return json;
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed");
  return json as {
    message: string;
    data: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      skill: string | null;
      token: string;
    };
  };
}

export async function getUsers(token: string) {
  const res = await fetch(`${API_BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch users");
  return json as {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    skill: string | null;
  }[];
}

export type Task = {
  id: number;
  title: string;
  description: string;
  status:
    | "To Do"
    | "In Progress"
    | "Code Review"
    | "PR Review"
    | "Dev Complete";
  priority: "Low" | "Medium" | "High" | "HIGHEST";
  dueDate: string | null;
  developerId: number | null;
  developer?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  createdAt: string;
};

export type TaskPayload = {
  title?: string;
  description?: string;
  status?: Task["status"];
  priority?: Task["priority"];
  dueDate?: string | null;
  developerId?: number | null;
};

export async function getTasks(
  token: string,
  developerId?: number,
  limit = 20,
  offset = 0,
) {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (developerId) params.set("developerId", String(developerId));
  const res = await fetch(`${API_BASE}/tasks?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch tasks");
  return json.data as Task[];
}

export async function createTask(token: string, data: TaskPayload) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to create task");
  return json.data as Task;
}

export async function updateTask(token: string, id: number, data: TaskPayload) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update task");
  return json.data as Task;
}

export async function getTaskStats(token: string) {
  const res = await fetch(`${API_BASE}/tasks/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch stats");
  return json.data as { total: number; completed: number; pending: number };
}

export async function searchTasks(token: string, query: string) {
  const res = await fetch(
    `${API_BASE}/tasks/search?query=${encodeURIComponent(query)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to search tasks");
  return json.data as Task[];
}

export async function getTasksByStatus(token: string, status: string) {
  const res = await fetch(
    `${API_BASE}/tasks/status/${encodeURIComponent(status)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to fetch tasks");
  return json.data as Task[];
}

export async function updateUserSkill(
  token: string,
  id: number,
  skill: string,
) {
  const res = await fetch(`${API_BASE}/users/${id}/skill`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ skill }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to update skill");
  return json as {
    message: string;
    data: {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      skill: string;
    };
  };
}
