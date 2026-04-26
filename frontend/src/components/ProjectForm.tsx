import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Project, CreateProjectData, UpdateProjectData, ProjectStatus } from "../types";
import { useProjectStore, useProjectFormStore } from "../store";

interface Props {
  project?: Project;
  mode: "create" | "edit";
  onSaved?: () => void;
}

export default function ProjectForm({ project, mode, onSaved }: Props) {
  const navigate = useNavigate();
  const createProject = useProjectStore((s) => s.createProject);
  const updateProject = useProjectStore((s) => s.updateProject);
  const { name, description, status, loading, error, setName, setDescription, setStatus, setLoading, setError, init } = useProjectFormStore();

  useEffect(() => {
    init(project?.name || "", project?.description || "", project?.status || "planned");
  }, [project, init]);

  const isCompleted = project?.status === "completed" && mode === "edit";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        const data: CreateProjectData = { name, description: description || undefined, status };
        await createProject(data);
        navigate("/");
      } else if (project) {
        const data: UpdateProjectData = { name, description, status };
        await updateProject(project.id, data);
        onSaved?.();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      <label className="floating-label">
        <span>Название</span>
        <input
          type="text"
          className="input input-md w-full"
          placeholder="Название проекта"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isCompleted}
          required
        />
      </label>

      <label className="floating-label">
        <span>Описание</span>
        <textarea
          className="textarea textarea-md w-full"
          placeholder="Описание проекта"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isCompleted}
          rows={4}
        />
      </label>

      <select
        className="select select-md w-full"
        value={status}
        onChange={(e) => setStatus(e.target.value as ProjectStatus)}
        disabled={isCompleted}
      >
        <option value="planned">Запланирован</option>
        <option value="active">В работе</option>
        <option value="completed">Завершён</option>
      </select>

      {!isCompleted && (
        <button
          type="submit"
          className={`btn btn-primary ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
        >
          {loading && <span className="loading loading-spinner loading-sm" />}
          {mode === "create" ? "Создать проект" : "Сохранить"}
        </button>
      )}

      {isCompleted && (
        <div role="alert" className="alert alert-warning">
          <span>Проект завершён. Редактирование недоступно.</span>
        </div>
      )}
    </form>
  );
}
