"use client";

import type { DiveEvent } from "@/data/events";

interface EventTableProps {
  events: DiveEvent[];
  onEdit: (event: DiveEvent) => void;
  onDelete: (id: string) => void;
}

export default function EventTable({
  events,
  onEdit,
  onDelete,
}: EventTableProps) {
  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm">
        등록된 일정이 없습니다. 위의 &quot;일정 추가&quot; 버튼을 눌러
        새 일정을 추가하세요.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-600">
              유형
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">
              제목
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">
              기간
            </th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">
              설명
            </th>
            <th className="text-right py-3 px-4 font-semibold text-gray-600">
              관리
            </th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4">
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    event.type === "education"
                      ? "bg-ocean-light text-ocean"
                      : "bg-orange-100 text-sunset-dark"
                  }`}
                >
                  {event.type === "education" ? "교육" : "투어"}
                </span>
              </td>
              <td className="py-3 px-4 font-medium text-[#111111]">
                {event.title}
              </td>
              <td className="py-3 px-4 text-gray-500">
                {formatDate(event.start)} ~ {formatDate(event.end)}
              </td>
              <td className="py-3 px-4 text-gray-500 max-w-[200px] truncate">
                {event.description || "-"}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(event)}
                    className="px-3 py-1.5 text-xs font-medium text-ocean bg-ocean-light rounded-lg hover:bg-ocean hover:text-white transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`"${event.title}" 일정을 삭제할까요?`)) {
                        onDelete(event.id);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
