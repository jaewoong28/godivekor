"use client";

import { useState, useEffect, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { DiveEvent } from "@/data/events";
import EventForm from "@/components/admin/EventForm";
import type { EventFormData } from "@/components/admin/EventForm";
import EventTable from "@/components/admin/EventTable";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [events, setEvents] = useState<DiveEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<DiveEvent | null>(null);
  const [loading, setLoading] = useState(false);

  // 저장된 인증 상태 확인
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_auth");
    if (saved) setIsAuthenticated(true);
  }, []);

  // 일정 불러오기
  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch {
      console.error("일정을 불러오는데 실패했습니다");
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchEvents();
  }, [isAuthenticated, fetchEvents]);

  const getAuthPassword = () => {
    return sessionStorage.getItem("admin_password") || "";
  };

  // 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_password", password);
        setIsAuthenticated(true);
      } else {
        setAuthError("비밀번호가 틀렸습니다");
      }
    } catch {
      setAuthError("서버 오류가 발생했습니다");
    }
  };

  // 일정 추가
  const handleAdd = async (data: EventFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": getAuthPassword(),
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchEvents();
        setShowForm(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // 일정 수정
  const handleEdit = async (data: EventFormData) => {
    if (!editingEvent) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": getAuthPassword(),
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchEvents();
        setEditingEvent(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // 일정 삭제
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": getAuthPassword(),
        },
      });
      if (res.ok) {
        await fetchEvents();
      }
    } catch {
      console.error("삭제에 실패했습니다");
    }
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-ocean">GoDiveKor</h1>
            <p className="text-sm text-gray-500 mt-1">관리자 페이지</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ocean focus:border-transparent"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-red-500 text-xs text-center">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-ocean text-white rounded-lg font-medium hover:bg-ocean-dark transition-colors"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 바 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-bold text-ocean">
              GoDiveKor
            </a>
            <span className="text-xs bg-ocean-light text-ocean px-2 py-0.5 rounded-full font-medium">
              관리자
            </span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_auth");
              sessionStorage.removeItem("admin_password");
              setIsAuthenticated(false);
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 캘린더 미리보기 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-bold text-[#111111] mb-4">
            캘린더 미리보기
          </h2>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale="ko"
            events={events.map((e) => {
              const endDate = new Date(e.end);
              endDate.setDate(endDate.getDate() + 1);
              return {
                id: e.id,
                title: e.title,
                start: e.start,
                end: endDate.toISOString().split("T")[0],
                color: e.color,
              };
            })}
            headerToolbar={{
              left: "prev",
              center: "title",
              right: "next",
            }}
            height="auto"
            dayMaxEvents={3}
          />
        </div>

        {/* 일정 관리 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#111111]">일정 관리</h2>
              <p className="text-sm text-gray-400 mt-0.5">
                총 {events.length}개의 일정
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2.5 bg-ocean text-white rounded-lg text-sm font-medium hover:bg-ocean-dark transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              일정 추가
            </button>
          </div>

          <EventTable
            events={events}
            onEdit={(event) => setEditingEvent(event)}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* 추가 모달 */}
      {showForm && (
        <EventForm
          onSubmit={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* 수정 모달 */}
      {editingEvent && (
        <EventForm
          initialData={editingEvent}
          onSubmit={handleEdit}
          onCancel={() => setEditingEvent(null)}
          isEdit
        />
      )}
    </div>
  );
}
