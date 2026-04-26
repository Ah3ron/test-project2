import type { ProjectComment } from "../types";

interface Props {
  comments: ProjectComment[];
  onDelete: (id: string) => void;
  currentUserId?: string;
}

export default function CommentList({ comments, onDelete, currentUserId }: Props) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-6 opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm">Комментариев пока нет</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="chat chat-start">
          <div className="chat-image avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-8 rounded-full">
              <span className="text-xs">{(comment.userName ?? comment.userEmail ?? "?")[0]!.toUpperCase()}</span>
            </div>
          </div>
          <div className="chat-header">
            <span className="font-medium text-sm">{comment.userName || comment.userEmail || "Неизвестный"}</span>
            <time className="text-xs opacity-50 ml-2">
              {new Date(comment.createdAt).toLocaleString("ru-RU")}
            </time>
          </div>
          <div className="chat-bubble text-sm">
            {comment.content}
          </div>
          {currentUserId === comment.userId && (
            <div className="chat-footer opacity-50">
              <button
                className="btn btn-ghost btn-xs text-error gap-1"
                onClick={() => onDelete(comment.id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Удалить
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
