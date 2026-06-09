"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUsers } from "./lib/api";

type User = { id: number; email: string; firstName: string; lastName: string };

export default function Home() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setReady(true);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
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
        <h1 className="text-3xl font-bold text-center mb-10">Full Stack App</h1>

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
            <p className="text-sm">
              <span className="font-medium">Email:</span> {selectedUser.email}
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
