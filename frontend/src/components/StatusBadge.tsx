import type { ProjectStatus } from "../types";

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  planned: { label: "Запланирован", className: "badge-primary" },
  active: { label: "В работе", className: "badge-secondary" },
  completed: { label: "Завершён", className: "badge-success" },
};

export default function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status] || statusConfig.planned;
  return <span className={`badge ${config.className}`}>{config.label}</span>;
}
