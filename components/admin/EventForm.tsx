"use client";

import { useState, useEffect } from "react";

export interface EventFormData {
  title: string;
  type: "education" | "tour";
  start: string;
  end: string;
  description: string;
}

interface EventFormProps {
  initialData?: Partial<EventFormData> & { id?: string };
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  isEdit?: boolean;
}

export default function EventForm({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false,
}: EventFormProps) {
  const [form, setForm] = useState<EventFormData>({
    title: "",
    type: "education",
    start: "",
    end: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        type: initialData.type || "education",
        start: initialData.start || "",
        end: initialData.end || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.start || !form.end) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 className="text-lg font-bold text-[#111111] mb-5">
          {isEdit ? "일정 수정" : "새 일정 추가"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="예: 오픈워터 교육"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
              required
            />
          </div>

          {/* 유형 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              유형
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "education" })}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  form.type === "education"
                    ? "bg-ocean text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                교육
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "tour" })}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                  form.type === "tour"
                    ? "bg-sunset text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                투어
              </button>
            </div>
          </div>

          {/* 날짜 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작일
              </label>
              <input
                type="date"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료일
              </label>
              <input
                type="date"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명 (선택)
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="예: PADI 오픈워터다이버 코스 (3일)"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent resize-none"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean-dark transition-colors disabled:opacity-50"
            >
              {loading ? "저장 중..." : isEdit ? "수정" : "추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
