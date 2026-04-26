import type { ProjectStatus } from "../types";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  planned: { label: "Запланирован", className: "badge-primary" },
  active: { label: "В работе", className: "badge-secondary" },
  completed: { label: "Завершён", className: "badge-success" },
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status] || statusConfig.planned;
  return (
    <span className={`badge badge-sm ${config.className}`}>
      {status === "planned" && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {status === "active" && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )}
      {status === "completed" && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {config.label}
    </span>
  );
}
