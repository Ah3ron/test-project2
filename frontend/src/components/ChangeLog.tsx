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
    <div className="overflow-x-auto max-h-64 overflow-y-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Поле</th>
            <th>Было</th>
            <th>Стало</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="font-medium">{fieldLabels[entry.fieldName] || entry.fieldName}</td>
              <td>
                {entry.oldValue ? (
                  <span className="text-wrap break-all">{entry.oldValue}</span>
                ) : (
                  <span className="opacity-30">—</span>
                )}
              </td>
              <td>
                {entry.newValue ? (
                  <span className="text-wrap break-all">{entry.newValue}</span>
                ) : (
                  <span className="opacity-30">—</span>
                )}
              </td>
              <td className="text-xs opacity-50 whitespace-nowrap">
                {new Date(entry.changedAt).toLocaleString("ru-RU")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
