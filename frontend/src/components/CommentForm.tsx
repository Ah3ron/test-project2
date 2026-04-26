import { useState } from "react";

interface Props {
  onSubmit: (content: string) => Promise<void>;
  disabled?: boolean;
}

export default function CommentForm({ onSubmit, disabled }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await onSubmit(content.trim());
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        className="input input-bordered flex-1"
        placeholder="Написать комментарий..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={disabled || loading}
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={disabled || loading || !content.trim()}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </button>
    </form>
  );
}
