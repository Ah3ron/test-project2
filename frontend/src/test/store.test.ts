import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProjectStore, useProjectDetailStore } from "../store";
import { api } from "../api/client";
import type { Project, ProjectComment, ProjectChangeLog } from "../types";

vi.mock("../api/client", () => ({
  api: {
    projects: {
      list: vi.fn(),
      get: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      changelog: vi.fn(),
    },
    comments: {
      list: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const mockProject: Project = {
  id: "1",
  userId: "u1",
  name: "Test Project",
  description: "desc",
  status: "planned",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

const mockComment: ProjectComment = {
  id: "c1",
  projectId: "1",
  userId: "u1",
  content: "Hello",
  createdAt: "2025-01-01T00:00:00Z",
  userName: "User",
  userEmail: "u@test.com",
};

const mockChangelog: ProjectChangeLog[] = [
  {
    id: "cl1",
    projectId: "1",
    fieldName: "status",
    oldValue: "planned",
    newValue: "active",
    changedAt: "2025-01-02T00:00:00Z",
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  useProjectStore.setState({ projects: [], loading: false, error: null });
  useProjectDetailStore.setState({
    project: null,
    changelog: [],
    comments: [],
    loading: false,
    error: null,
  });
});

describe("useProjectStore", () => {
  it("fetchProjects fills projects on success", async () => {
    vi.mocked(api.projects.list).mockResolvedValue([mockProject]);
    await useProjectStore.getState().fetchProjects();
    const state = useProjectStore.getState();
    expect(state.projects).toEqual([mockProject]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("fetchProjects sets error on failure", async () => {
    vi.mocked(api.projects.list).mockRejectedValue(new Error("Network error"));
    await useProjectStore.getState().fetchProjects();
    const state = useProjectStore.getState();
    expect(state.projects).toEqual([]);
    expect(state.error).toBe("Network error");
    expect(state.loading).toBe(false);
  });

  it("fetchProjects sets loading during request", async () => {
    let resolve!: (v: Project[]) => void;
    vi.mocked(api.projects.list).mockReturnValue(
      new Promise((r) => { resolve = r; })
    );
    const promise = useProjectStore.getState().fetchProjects();
    expect(useProjectStore.getState().loading).toBe(true);
    resolve([]);
    await promise;
    expect(useProjectStore.getState().loading).toBe(false);
  });

  it("createProject appends to list", async () => {
    vi.mocked(api.projects.create).mockResolvedValue(mockProject);
    const result = await useProjectStore.getState().createProject({
      name: "Test Project",
    });
    expect(result).toEqual(mockProject);
    expect(useProjectStore.getState().projects).toEqual([mockProject]);
  });

  it("updateProject replaces item in list", async () => {
    const updated = { ...mockProject, name: "Updated" };
    useProjectStore.setState({ projects: [mockProject] });
    vi.mocked(api.projects.update).mockResolvedValue(updated);
    const result = await useProjectStore.getState().updateProject("1", {
      name: "Updated",
    });
    expect(result.name).toBe("Updated");
    expect(useProjectStore.getState().projects[0]!.name).toBe("Updated");
  });

  it("updateProject does not mutate other items", async () => {
    const other: Project = { ...mockProject, id: "2", name: "Other" };
    useProjectStore.setState({ projects: [mockProject, other] });
    const updated = { ...mockProject, name: "Updated" };
    vi.mocked(api.projects.update).mockResolvedValue(updated);
    await useProjectStore.getState().updateProject("1", { name: "Updated" });
    const state = useProjectStore.getState();
    expect(state.projects.find((p) => p.id === "2")).toEqual(other);
  });

  it("deleteProject removes item from list", async () => {
    useProjectStore.setState({ projects: [mockProject] });
    vi.mocked(api.projects.delete).mockResolvedValue(undefined);
    await useProjectStore.getState().deleteProject("1");
    expect(useProjectStore.getState().projects).toEqual([]);
  });
});

describe("useProjectDetailStore", () => {
  it("fetchDetail loads project, changelog, comments", async () => {
    vi.mocked(api.projects.get).mockResolvedValue(mockProject);
    vi.mocked(api.projects.changelog).mockResolvedValue(mockChangelog);
    vi.mocked(api.comments.list).mockResolvedValue([mockComment]);

    await useProjectDetailStore.getState().fetchDetail("1");
    const state = useProjectDetailStore.getState();
    expect(state.project).toEqual(mockProject);
    expect(state.changelog).toEqual(mockChangelog);
    expect(state.comments).toEqual([mockComment]);
    expect(state.loading).toBe(false);
  });

  it("fetchDetail sets error on failure", async () => {
    vi.mocked(api.projects.get).mockRejectedValue(new Error("Not found"));
    await useProjectDetailStore.getState().fetchDetail("999");
    expect(useProjectDetailStore.getState().error).toBe("Not found");
  });

  it("addComment re-fetches comments list", async () => {
    useProjectDetailStore.setState({ comments: [] });
    vi.mocked(api.comments.create).mockResolvedValue(mockComment);
    vi.mocked(api.comments.list).mockResolvedValue([mockComment]);

    await useProjectDetailStore.getState().addComment("1", "Hello");
    expect(api.comments.create).toHaveBeenCalledWith("1", "Hello");
    expect(api.comments.list).toHaveBeenCalledWith("1");
    expect(useProjectDetailStore.getState().comments).toEqual([mockComment]);
  });

  it("deleteComment removes from list", async () => {
    useProjectDetailStore.setState({ comments: [mockComment] });
    vi.mocked(api.comments.delete).mockResolvedValue(undefined);

    await useProjectDetailStore.getState().deleteComment("c1");
    expect(useProjectDetailStore.getState().comments).toEqual([]);
  });

  it("reset clears all state", async () => {
    useProjectDetailStore.setState({
      project: mockProject,
      changelog: mockChangelog,
      comments: [mockComment],
      loading: true,
    });
    useProjectDetailStore.getState().reset();
    const state = useProjectDetailStore.getState();
    expect(state.project).toBeNull();
    expect(state.changelog).toEqual([]);
    expect(state.comments).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
