import { create } from "zustand";
import type { Project, ProjectChangeLog, ProjectComment, CreateProjectData, UpdateProjectData } from "../types";
import { api } from "../api/client";

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<Project>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await api.projects.list();
      set({ projects, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  createProject: async (data) => {
    const project = await api.projects.create(data);
    set((s) => ({ projects: [...s.projects, project] }));
    return project;
  },

  updateProject: async (id, data) => {
    const project = await api.projects.update(id, data);
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? project : p)) }));
    return project;
  },

  deleteProject: async (id) => {
    await api.projects.delete(id);
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
  },
}));

interface ProjectDetailState {
  project: Project | null;
  changelog: ProjectChangeLog[];
  comments: ProjectComment[];
  loading: boolean;
  error: string | null;
  fetchDetail: (id: string) => Promise<void>;
  addComment: (projectId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  reset: () => void;
}

export const useProjectDetailStore = create<ProjectDetailState>((set) => ({
  project: null,
  changelog: [],
  comments: [],
  loading: false,
  error: null,

  fetchDetail: async (id) => {
    set({ loading: true, error: null });
    try {
      const [project, changelog, comments] = await Promise.all([
        api.projects.get(id),
        api.projects.changelog(id),
        api.comments.list(id),
      ]);
      set({ project, changelog, comments, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },

  addComment: async (projectId, content) => {
    const comment = await api.comments.create(projectId, content);
    set((s) => ({ comments: [...s.comments, comment] }));
  },

  deleteComment: async (commentId) => {
    await api.comments.delete(commentId);
    set((s) => ({ comments: s.comments.filter((c) => c.id !== commentId) }));
  },

  reset: () => set({ project: null, changelog: [], comments: [], loading: false, error: null }),
}));
