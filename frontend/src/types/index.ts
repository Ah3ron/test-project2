export type ProjectStatus = "planned" | "active" | "completed";

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectChangeLog {
  id: string;
  projectId: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changedAt: string;
}

export interface ProjectComment {
  id: string;
  projectId: string;
  userId: string;
  content: string;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  status?: ProjectStatus;
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  status?: ProjectStatus;
}
