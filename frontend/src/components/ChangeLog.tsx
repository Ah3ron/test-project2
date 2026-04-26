import type { ProjectChangeLog } from "../types";

const fieldLabels: Record<string, string> = {
  name: "Название",
  description: "Описание",
  status: "Статус",
};

export default function ChangeLog({ entries }: { entries: ProjectChangeLog[] }) {
  if (entries.length === 0) {
    return (
      <div className="text-center py-6 opacity-50">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-sm">Изменений пока нет</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-base-300 rounded-lg p-3 text-sm space-y-1">
          <div className="flex justify-between items-center">
            <span className="font-medium">{fieldLabels[entry.fieldName] || entry.fieldName}</span>
            <span className="text-xs opacity-50">{new Date(entry.changedAt).toLocaleString("ru-RU")}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="opacity-50 text-xs">Было:</span>
            <span className="break-all">{entry.oldValue || <span className="opacity-30">—</span>}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="opacity-50 text-xs">Стало:</span>
            <span className="break-all">{entry.newValue || <span className="opacity-30">—</span>}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
