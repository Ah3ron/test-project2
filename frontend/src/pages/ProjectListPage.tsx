import { Link } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import StatusBadge from "../components/StatusBadge";
import type { ProjectStatus } from "../types";

export default function ProjectListPage() {
  const { projects, loading, error } = useProjects();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Проекты</h1>
        <Link to="/projects/new" className="btn btn-primary">
          Новый проект
        </Link>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-20 opacity-60">
          <p className="text-lg mb-4">Проекты отсутствуют</p>
          <Link to="/projects/new" className="btn btn-primary">
            Создайте ваш первый проект
          </Link>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="card bg-base-200 shadow hover:shadow-lg transition-shadow"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title text-lg">{project.name}</h2>
                  <StatusBadge status={project.status as ProjectStatus} />
                </div>
                {project.description && (
                  <p className="text-sm opacity-70 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <p className="text-xs opacity-50 mt-2">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
