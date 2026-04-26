import type { ProjectChangeLog } from "../types";

const fieldLabels: Record<string, string> = {
  name: "Название",
  description: "Описание",
  status: "Статус",
};

export default function ChangeLog({ entries }: { entries: ProjectChangeLog[] }) {
  if (entries.length === 0) {
    return <p className="text-sm opacity-60">Изменений пока нет.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Поле</th>
            <th>Старое значение</th>
            <th>Новое значение</th>
            <th>Дата изменения</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="font-medium">{fieldLabels[entry.fieldName] || entry.fieldName}</td>
              <td className="text-error">{entry.oldValue || "—"}</td>
              <td className="text-success">{entry.newValue || "—"}</td>
              <td className="text-sm opacity-60">
                {new Date(entry.changedAt).toLocaleString("ru-RU")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
