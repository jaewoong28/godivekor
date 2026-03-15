"use client";

import { useState, useMemo, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { DatesSetArg } from "@fullcalendar/core";
import type { DiveEvent } from "@/data/events";

export default function ScheduleSection() {
  const [events, setEvents] = useState<DiveEvent[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => {
        // API 실패 시 빈 배열 유지
      });
  }, []);

  const handleDatesSet = (dateInfo: DatesSetArg) => {
    const mid = new Date(
      (dateInfo.start.getTime() + dateInfo.end.getTime()) / 2
    );
    setCurrentMonth({ year: mid.getFullYear(), month: mid.getMonth() });
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const start = new Date(event.start);
      const end = event.end ? new Date(event.end) : start;
      return (
        (start.getFullYear() === currentMonth.year &&
          start.getMonth() === currentMonth.month) ||
        (end.getFullYear() === currentMonth.year &&
          end.getMonth() === currentMonth.month)
      );
    });
  }, [currentMonth, events]);

  const monthName = new Date(
    currentMonth.year,
    currentMonth.month
  ).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  const formatDateRange = (start: string, end?: string) => {
    const s = new Date(start);
    const startStr = `${s.getMonth() + 1}/${s.getDate()}`;
    if (!end) return startStr;
    const e = new Date(end);
    const endStr = `${e.getMonth() + 1}/${e.getDate()}`;
    return `${startStr} - ${endStr}`;
  };

  return (
    <section id="schedule" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#111111] mb-3">
            스케줄
          </h2>
          <div className="w-16 h-1 bg-ocean mx-auto rounded-full mb-4" />
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            교육 및 투어 일정을 확인하세요
          </p>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-ocean" />
              <span className="text-gray-600">교육</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-sunset" />
              <span className="text-gray-600">투어</span>
            </div>
          </div>
        </div>

        {/* Calendar + Event List */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-4 sm:p-6">
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locale="ko"
              events={events.map((e) => {
                // FullCalendar는 종료일을 exclusive로 처리하므로 하루 추가
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
              datesSet={handleDatesSet}
              height="auto"
              dayMaxEvents={3}
            />
          </div>

          {/* Monthly Event List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-bold text-[#111111] mb-1">
                {monthName} 일정
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                {filteredEvents.length}개의 일정
              </p>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  이 달에 등록된 일정이 없습니다
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-[#111111] truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDateRange(event.start, event.end)}
                        </p>
                        {event.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                          event.type === "education"
                            ? "bg-ocean-light text-ocean"
                            : "bg-orange-100 text-sunset-dark"
                        }`}
                      >
                        {event.type === "education" ? "교육" : "투어"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
