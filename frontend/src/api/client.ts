import type {
  Project,
  ProjectChangeLog,
  ProjectComment,
  CreateProjectData,
  UpdateProjectData,
} from "../types";

const BASE = import.meta.env.VITE_API_URL || "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  projects: {
    list: () => request<Project[]>("/projects"),

    get: (id: string) => request<Project>(`/projects/${id}`),

    create: (data: CreateProjectData) =>
      request<Project>("/projects", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateProjectData) =>
      request<Project>(`/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<void>(`/projects/${id}`, { method: "DELETE" }),

    changelog: (id: string) =>
      request<ProjectChangeLog[]>(`/projects/${id}/changelog`),
  },

  comments: {
    list: (projectId: string) =>
      request<ProjectComment[]>(`/comments/project/${projectId}`),

    create: (projectId: string, content: string) =>
      request<ProjectComment>(`/comments/project/${projectId}`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),

    delete: (id: string) =>
      request<void>(`/comments/${id}`, { method: "DELETE" }),
  },
};
