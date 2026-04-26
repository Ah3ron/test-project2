import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import { useProjectFormStore, useProjectStore } from "../store";
import { api } from "../api/client";
import type { Project } from "../types";

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
  name: "Existing",
  description: "Desc",
  status: "active",
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z",
};

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

beforeEach(() => {
  vi.clearAllMocks();
  useProjectFormStore.getState().reset();
  useProjectStore.setState({ projects: [], loading: false, error: null });
});

describe("ProjectForm - create mode", () => {
  it("renders create button", () => {
    renderWithRouter(<ProjectForm mode="create" />);
    expect(screen.getByText("Создать проект")).toBeInTheDocument();
  });

  it("renders name input as required", () => {
    renderWithRouter(<ProjectForm mode="create" />);
    const nameInput = screen.getByPlaceholderText("Название проекта");
    expect(nameInput).toBeRequired();
  });

  it("creates project and navigates on submit", async () => {
    vi.mocked(api.projects.create).mockResolvedValue(mockProject);
    renderWithRouter(<ProjectForm mode="create" />);
    await userEvent.type(screen.getByPlaceholderText("Название проекта"), "New Project");
    await userEvent.click(screen.getByText("Создать проект"));
    expect(api.projects.create).toHaveBeenCalledWith({
      name: "New Project",
      description: undefined,
      status: "planned",
    });
  });
});

describe("ProjectForm - edit mode", () => {
  it("renders save button", () => {
    renderWithRouter(<ProjectForm mode="edit" project={mockProject} />);
    expect(screen.getByText("Сохранить")).toBeInTheDocument();
  });

  it("initializes form with project data", () => {
    renderWithRouter(<ProjectForm mode="edit" project={mockProject} />);
    expect(screen.getByDisplayValue("Existing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Desc")).toBeInTheDocument();
  });

  it("calls updateProject on submit", async () => {
    vi.mocked(api.projects.update).mockResolvedValue(mockProject);
    const onSaved = vi.fn();
    renderWithRouter(<ProjectForm mode="edit" project={mockProject} onSaved={onSaved} />);
    await userEvent.click(screen.getByText("Сохранить"));
    expect(api.projects.update).toHaveBeenCalledWith("1", {
      name: "Existing",
      description: "Desc",
      status: "active",
    });
    expect(onSaved).toHaveBeenCalled();
  });

  it("disables inputs and hides submit for completed project", () => {
    const completed = { ...mockProject, status: "completed" as const };
    renderWithRouter(<ProjectForm mode="edit" project={completed} />);
    expect(screen.getByPlaceholderText("Название проекта")).toBeDisabled();
    expect(screen.getByText("Проект завершён. Редактирование недоступно.")).toBeInTheDocument();
    expect(screen.queryByText("Сохранить")).not.toBeInTheDocument();
  });
});
