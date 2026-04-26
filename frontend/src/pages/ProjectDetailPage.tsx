import { useNavigate, useParams } from "react-router-dom";
import { useSession } from "../lib/auth-client";
import { useProject } from "../hooks/useProject";
import { api } from "../api/client";
import StatusBadge from "../components/StatusBadge";
import ProjectForm from "../components/ProjectForm";
import ChangeLog from "../components/ChangeLog";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import type { ProjectStatus } from "../types";

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
      <div className="container mx-auto px-4 py-8">
        <div role="alert" className="alert alert-error">
          <span>{error || "Project not found"}</span>
        </div>
      </div>
    );
  }

  const isCompleted = project.status === "completed";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("/")}>
            Назад
          </button>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <StatusBadge status={project.status as ProjectStatus} />
        </div>
        {!isCompleted && (
          <button className="btn btn-error btn-sm" onClick={handleDelete}>
Удалить
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-4">
            {isCompleted ? "Детали проекта (только чтение)" : "Редактировать проект"}
          </h2>
          <ProjectForm project={project} mode="edit" onSaved={refetch} />
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">История изменений</h2>
            <ChangeLog entries={changelog} />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Комментарии</h2>
            <div className="space-y-4">
              <CommentForm onSubmit={handleAddComment} />
              <CommentList
                comments={comments}
                onDelete={handleDeleteComment}
                currentUserId={session?.user?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
