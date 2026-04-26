import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProjectStore, useListFilterStore } from "../store";
import StatusBadge from "../components/StatusBadge";
import type { ProjectStatus } from "../types";

const STATUS_FILTERS: { value: ProjectStatus | "all"; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "planned", label: "Запланированы" },
  { value: "active", label: "В работе" },
  { value: "completed", label: "Завершены" },
];

export default function ProjectListPage() {
  const { projects, loading, error, fetchProjects } = useProjectStore();
  const { filter, search, setFilter, setSearch } = useListFilterStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter((p) => {
    const matchStatus = filter === "all" || p.status === filter;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Проекты</h1>
        <Link to="/projects/new" className="btn btn-primary gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Новый проект
        </Link>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <label className="input input-bordered flex items-center gap-2 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Поиск..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="join overflow-x-auto flex-nowrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.value}
              className={`btn join-item btn-sm whitespace-nowrap ${filter === s.value ? "btn-primary" : ""}`}
              onClick={() => setFilter(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto opacity-30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-lg mb-4 opacity-60">Проекты отсутствуют</p>
          <Link to="/projects/new" className="btn btn-primary">
            Создайте ваш первый проект
          </Link>
        </div>
      )}

      {!loading && projects.length > 0 && filtered.length === 0 && (
        <div className="text-center py-20 opacity-60">
          <p className="text-lg">Ничего не найдено</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="card bg-base-200 shadow hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
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
                <div className="flex items-center gap-1 text-xs opacity-50 mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(project.updatedAt).toLocaleDateString("ru-RU")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
