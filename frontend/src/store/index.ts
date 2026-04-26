import { create } from "zustand";
import type { Project, ProjectChangeLog, ProjectComment, CreateProjectData, UpdateProjectData, ProjectStatus } from "../types";
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
    await api.comments.create(projectId, content);
    const comments = await api.comments.list(projectId);
    set({ comments });
  },

  deleteComment: async (commentId) => {
    await api.comments.delete(commentId);
    set((s) => ({ comments: s.comments.filter((c) => c.id !== commentId) }));
  },

  reset: () => set({ project: null, changelog: [], comments: [], loading: false, error: null }),
}));

interface LoginFormState {
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setError: (v: string | null) => void;
  setLoading: (v: boolean) => void;
  reset: () => void;
}

const loginInit = { email: "", password: "", error: null, loading: false };

export const useLoginFormStore = create<LoginFormState>((set) => ({
  ...loginInit,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  reset: () => set(loginInit),
}));

interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  error: string | null;
  loading: boolean;
  setName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setError: (v: string | null) => void;
  setLoading: (v: boolean) => void;
  reset: () => void;
}

const registerInit = { name: "", email: "", password: "", error: null, loading: false };

export const useRegisterFormStore = create<RegisterFormState>((set) => ({
  ...registerInit,
  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  reset: () => set(registerInit),
}));

interface ProjectFormState {
  name: string;
  description: string;
  status: ProjectStatus;
  loading: boolean;
  error: string | null;
  setName: (v: string) => void;
  setDescription: (v: string) => void;
  setStatus: (v: ProjectStatus) => void;
  setLoading: (v: boolean) => void;
  setError: (v: string | null) => void;
  init: (name: string, description: string, status: ProjectStatus) => void;
  reset: () => void;
}

const projectFormInit = { name: "", description: "", status: "planned" as ProjectStatus, loading: false, error: null };

export const useProjectFormStore = create<ProjectFormState>((set) => ({
  ...projectFormInit,
  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setStatus: (status) => set({ status }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  init: (name, description, status) => set({ name, description, status, loading: false, error: null }),
  reset: () => set(projectFormInit),
}));

interface CommentFormState {
  content: string;
  loading: boolean;
  setContent: (v: string) => void;
  setLoading: (v: boolean) => void;
  reset: () => void;
}

const commentFormInit = { content: "", loading: false };

export const useCommentFormStore = create<CommentFormState>((set) => ({
  ...commentFormInit,
  setContent: (content) => set({ content }),
  setLoading: (loading) => set({ loading }),
  reset: () => set(commentFormInit),
}));

interface ListFilterState {
  filter: ProjectStatus | "all";
  search: string;
  setFilter: (v: ProjectStatus | "all") => void;
  setSearch: (v: string) => void;
}

export const useListFilterStore = create<ListFilterState>((set) => ({
  filter: "all",
  search: "",
  setFilter: (filter) => set({ filter }),
  setSearch: (search) => set({ search }),
}));
