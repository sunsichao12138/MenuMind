import { getAccessToken } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getAccessToken();
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    // 401 = token expired or invalid, trigger re-login
    if (res.status === 401) {
      window.location.href = "/auth";
      throw new Error("Unauthorized");
    }
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),

  post: <T>(url: string, body: any) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(url: string, body: any) =>
    request<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string) =>
    request<T>(url, {
      method: "DELETE",
    }),
};
