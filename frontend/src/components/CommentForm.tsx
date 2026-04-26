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
    <form onSubmit={handleSubmit} className="flex gap-2">
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
        className="btn btn-primary"
        disabled={disabled || loading || !content.trim()}
      >
        {loading ? <span className="loading loading-spinner loading-sm" /> : "Отправить"}
      </button>
    </form>
  );
}
