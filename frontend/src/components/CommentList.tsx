import type { ProjectComment } from "../types";

interface Props {
  comments: ProjectComment[];
  onDelete: (id: string) => void;
  currentUserId?: string;
}

export default function CommentList({ comments, onDelete, currentUserId }: Props) {
  if (comments.length === 0) {
    return <p className="text-sm opacity-60">Комментариев пока нет.</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="card bg-base-200 card-sm">
          <div className="card-body p-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-medium">
                  {comment.userName || comment.userEmail || "Неизвестный"}
                </span>
                <span className="text-xs opacity-50 ml-2">
                  {new Date(comment.createdAt).toLocaleString("ru-RU")}
                </span>
              </div>
              {currentUserId === comment.userId && (
                <button
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => onDelete(comment.id)}
                >
                  Удалить
                </button>
              )}
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
