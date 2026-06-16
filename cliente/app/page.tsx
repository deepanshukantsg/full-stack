"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getUsers, updateUserSkill } from "./lib/api";

const SKILLS = ["Backend", "Frontend", "Designer", "PM"] as const;
type Skill = (typeof SKILLS)[number];
type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  skill: string | null;
};

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [mySkill, setMySkill] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [skillDraft, setSkillDraft] = useState<Skill | "">("");
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillError, setSkillError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (t) {
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        setUserId(payload.id ?? null);
        const persisted = localStorage.getItem("userSkill");
        setMySkill(persisted || payload.skill || null);
      } catch {
        // malformed token
      }
    }
    setReady(true);
  }, []);

  async function handleUpdateSkill() {
    if (!token || !userId || !skillDraft) return;
    setSkillLoading(true);
    setSkillError("");
    try {
      const res = await updateUserSkill(token, userId, skillDraft);
      const updated = res.data;
      setMySkill(updated.skill);
      localStorage.setItem("userSkill", updated.skill);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === updated.id ? { ...u, skill: updated.skill } : u,
        ),
      );
      setSkillDraft("");
    } catch (err: unknown) {
      setSkillError(
        err instanceof Error ? err.message : "Failed to update skill",
      );
    } finally {
      setSkillLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userSkill");
    setToken(null);
    setUserId(null);
    setMySkill(null);
    setUsers([]);
  }

  async function handleShowUsers() {
    if (!token) return;
    setLoadingUsers(true);
    setUsersError("");
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch (err: unknown) {
      setUsersError(
        err instanceof Error ? err.message : "Failed to load users",
      );
    } finally {
      setLoadingUsers(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4 text-black">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-10">
          <h1 className="text-3xl font-bold">Full Stack App</h1>
          {ready && token && (
            mySkill ? (
              <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                {mySkill}
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value as Skill)}
                  className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Your skill...</option>
                  {SKILLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={handleUpdateSkill}
                  disabled={!skillDraft || skillLoading}
                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {skillLoading ? "..." : "Set"}
                </button>
              </div>
            )
          )}
        </div>

        {skillError && (
          <p className="text-center text-xs text-red-600 -mt-8 mb-4">{skillError}</p>
        )}

        {!ready ? null : !token ? (
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 rounded-lg border border-blue-600 text-blue-600 text-sm font-medium hover:bg-blue-50 transition"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleShowUsers}
                disabled={loadingUsers}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {loadingUsers ? "Loading..." : "Show All Users"}
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg border border-red-500 text-red-500 text-sm font-medium hover:bg-red-50 transition"
              >
                Logout
              </button>
            </div>

            {usersError && (
              <p className="text-center text-sm text-red-600">{usersError}</p>
            )}

            {users.length > 0 && (
              <ul className="bg-white rounded-2xl shadow divide-y">
                {users.map((u) => (
                  <li key={u.id}>
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="w-full text-left px-5 py-4 hover:bg-gray-50 transition"
                    >
                      <p className="font-medium text-sm">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">User Details</h2>
            <p className="text-sm mb-1">
              <span className="font-medium">Name:</span>{" "}
              {selectedUser.firstName} {selectedUser.lastName}
            </p>
            <p className="text-sm mb-1">
              <span className="font-medium">Email:</span> {selectedUser.email}
            </p>
            <p className="text-sm">
              <span className="font-medium">Skill:</span>{" "}
              {selectedUser.skill ?? (
                <span className="text-gray-400">Not set</span>
              )}
            </p>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full py-2 rounded-lg bg-gray-100 text-sm font-medium hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
