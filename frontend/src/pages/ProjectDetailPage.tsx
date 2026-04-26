import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "../lib/auth-client";
import { useProject } from "../hooks/useProject";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import ProjectForm from "../components/ProjectForm";
import ChangeLog from "../components/ChangeLog";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { project, changelog, comments, loading, error, refetch } = useProject(id!);

  const handleDelete = async () => {
    if (!project || !confirm("Удалить этот проект?")) return;
    try {
      await api.projects.delete(project.id);
      navigate("/");
    } catch {
      alert("Не удалось удалить проект");
    }
  };

  const handleAddComment = async (content: string) => {
    await api.comments.create(id!, content);
    refetch();
  };

  const handleDeleteComment = async (commentId: string) => {
    await api.comments.delete(commentId);
    refetch();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 overflow-auto p-6">
        <div role="alert" className="alert alert-error max-w-5xl mx-auto">
          <span>{error || "Project not found"}</span>
        </div>
      </div>
    );
  }

  const isCompleted = project.status === "completed";

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* Header */}
      <header className="shrink-0 bg-base-200 border-b border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="btn btn-ghost btn-sm shrink-0 gap-1"
              onClick={() => navigate("/")}
              aria-label="Назад"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Назад
            </button>

            <div className="divider divider-horizontal mx-0" />

            <div className="min-w-0">
              <h1 className={`text-2xl font-bold truncate ${isCompleted ? "line-through opacity-60" : ""}`}>
                {project?.name}
              </h1>
              {project?.description && (
                <p className="text-sm opacity-60 truncate max-w-3xl mt-1">{project.description}</p>
              )}
            </div>

          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={project?.status as any} />
            {!isCompleted && (
              <button
                type="button"
                className="btn btn-error btn-sm shrink-0 gap-1 btn-outline"
                onClick={handleDelete}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Удалить
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6 min-w-0">
            {isCompleted ? (
              <section className="card bg-base-200">
                <div className="card-body">
                  <div className="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="card-title text-lg">Проект завершён</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="opacity-50">Название</span>
                      <p className="font-medium mt-1">{project.name}</p>
                    </div>
                    <div>
                      <span className="opacity-50">Статус</span>
                      <p className="mt-1"><StatusBadge status={project.status as any} /></p>
                    </div>
                    {project.description && (
                      <div className="sm:col-span-2">
                        <span className="opacity-50">Описание</span>
                        <p className="mt-1 whitespace-pre-wrap">{project.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ) : (
              <div className="collapse collapse-arrow bg-base-200">
                <input type="checkbox" defaultChecked />
                <div className="collapse-title text-lg font-semibold">
                  Редактировать проект
                </div>
                <div className="collapse-content">
                  <ProjectForm project={project} mode="edit" onSaved={refetch} />
                </div>
              </div>
            )}

            <section className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title text-lg flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  История изменений
                </h2>

                <div className="mt-2">
                  <ChangeLog entries={changelog} />
                </div>
              </div>
            </section>
          </div>

          <aside className="min-w-0">
            <div className="card bg-base-200 sticky top-6">
              <div className="card-body">
                <h2 className="card-title text-lg flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Комментарии
                  {comments?.length > 0 && (
                    <span className="badge badge-sm badge-ghost">{comments.length}</span>
                  )}
                </h2>

                <div className="space-y-4 mt-2">
                  <CommentForm onSubmit={handleAddComment} />
                  <CommentList comments={comments} onDelete={handleDeleteComment} currentUserId={session?.user?.id} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

