// src/pages/dashboard/SchedulePage.jsx
import React, { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek as dateFnsStartOfWeek,
  endOfWeek as dateFnsEndOfWeek,
} from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { vi, en: enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// DỮ LIỆU CỦA BẠN (đã sửa lỗi cú pháp)
const initialEvents = [
  { id: 101, title: "Giảng: Cấu trúc Dữ liệu", start: new Date(2025, 11, 10, 8, 30), end: new Date(2025, 11, 10, 11, 30), category: "lecture" },
  { id: 102, title: "Họp: Chuẩn bị Đề cương Môn học", start: new Date(2025, 11, 12, 14, 0), end: new Date(2025, 11, 12, 15, 30), category: "meeting" },
  { id: 103, title: "Giảng: Lập trình Web Frontend", start: new Date(2025, 11, 15, 10, 0), end: new Date(2025, 11, 15, 12, 0), category: "lecture" },
  { id: 104, title: "Chấm Bài: Bài tập Lớn (Cơ sở Dữ liệu)", start: new Date(2025, 11, 17, 13, 0), end: new Date(2025, 11, 17, 17, 0), category: "grading" },
  { id: 105, title: "Seminar: Trí tuệ Nhân tạo", start: new Date(2025, 11, 18, 15, 30), end: new Date(2025, 11, 18, 17, 0), category: "research" },
  { id: 106, title: "Giảng: Mạng Máy tính (Thực hành)", start: new Date(2025, 11, 20, 8, 0), end: new Date(2025, 11, 20, 11, 30), category: "lab" },
  { id: 107, title: "Họp Khoa: Kế hoạch Học kỳ Mới", start: new Date(2025, 11, 22, 9, 30), end: new Date(2025, 11, 22, 11, 0), category: "meeting" },
  { id: 108, title: "Chuẩn bị: Bài giảng (Thuật toán)", start: new Date(2025, 11, 27, 11, 0), end: new Date(2025, 11, 27, 14, 0), category: "preparation" },
  { id: 109, title: "Giảng: Phân tích Thiết kế Hệ thống", start: new Date(2026, 0, 3, 13, 0), end: new Date(2026, 0, 3, 16, 0), category: "lecture" },
];

// Màu sắc theo loại công việc
const categoryColors = {
  lecture: "bg-red-500",
  meeting: "bg-blue-500",
  grading: "bg-purple-500",
  research: "bg-green-500",
  lab: "bg-yellow-500",
  preparation: "bg-indigo-500",
};

const categoryLabels = {
  lecture: "Giảng dạy",
  meeting: "Họp hành",
  grading: "Chấm bài",
  research: "Nghiên cứu",
  lab: "Thực hành",
  preparation: "Chuẩn bị",
};

export default function SchedulePage() {
  const [events] = useState(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // December 2025
  const [view, setView] = useState(Views.MONTH);
  const [miniMonth, setMiniMonth] = useState(new Date());
  const [filters, setFilters] = useState({
    lecture: true,
    meeting: true,
    grading: true,
    research: true,
    lab: true,
    preparation: true,
  });

  // Lọc sự kiện theo filter
  const filteredEvents = events.filter(e => filters[e.category]);

  // Tùy chỉnh màu cho từng loại sự kiện
  const eventStyleGetter = (event) => {
    const colorClass = categoryColors[event.category] || "bg-gray-500";
    const hex = colorClass.replace("bg-", "").replace("-500", "");
    const hexMap = {
      red: "#ef4444",
      blue: "#3b82f6",
      purple: "#a855f7",
      green: "#22c55e",
      yellow: "#eab308",
      indigo: "#6366f1",
    };
    const backgroundColor = hexMap[hex] || "#6b7280";

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        opacity: 0.95,
        color: "white",
        border: "none",
        fontWeight: "500",
      },
    };
  };

  // Mini Calendar nhỏ ở sidebar
  const MiniCalendar = () => {
    const monthStart = startOfMonth(miniMonth);
    const monthEnd = endOfMonth(miniMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfWeek = monthStart.getDay();
    const blanks = Array(firstDayOfWeek).fill(null);

    return (
      <div className="bg-white rounded-xl shadow-sm p-4 border">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-sm">{format(miniMonth, "MMMM yyyy")}</h3>
          <div className="flex gap-1">
            <button onClick={() => setMiniMonth(subMonths(miniMonth, 1))} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setMiniMonth(addMonths(miniMonth, 1))} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-xs text-center font-medium text-gray-600 mb-1">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 text-xs">
          {blanks.map((_, i) => <div key={`blank-${i}`} />)}
          {days.map(day => {
            const hasEvent = events.some(e => isSameDay(e.start, day));
            const isCurrentDay = isToday(day);
            const isSelected = isSameDay(day, currentDate);

            return (
              <button
                key={day.toString()}
                onClick={() => {
                  setCurrentDate(day);
                  setView(Views.MONTH);
                }}
                className={`h-8 w-8 rounded-full flex items-center justify-center transition-all text-xs font-medium
                  ${isCurrentDay ? "bg-purple-600 text-white" : ""}
                  ${isSelected && !isCurrentDay ? "bg-purple-100 text-purple-700 ring-2 ring-purple-600" : ""}
                  ${hasEvent && !isCurrentDay && !isSelected ? "text-purple-700 font-bold" : ""}
                  ${!isCurrentDay && !isSelected && !hasEvent ? "hover:bg-gray-100" : ""}
                `}
              >
                {format(day, "d")}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const messages = useMemo(() => ({
    allDay: "Cả ngày",
    previous: "Trước",
    next: "Sau",
    today: "Hôm nay",
    month: "Tháng",
    week: "Tuần",
    day: "Ngày",
    agenda: "Danh sách",
    date: "Ngày",
    time: "Thời gian",
    event: "Sự kiện",
    noEventsInRange: "Không có sự kiện nào",
    showMore: (total) => `+${total} nữa`,
  }), []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg transition">
            <Plus className="w-5 h-5" />
            Thêm lịch
          </button>

          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentDate(new Date())} className="px-5 py-2 bg-white border rounded-lg text-sm font-medium hover:bg-gray-50">
              Hôm nay
            </button>

            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentDate(view === Views.MONTH ? subMonths(currentDate, 1) : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - (view === Views.WEEK ? 7 : 1)))} className="p-2 hover:bg-gray-200 rounded-lg">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold min-w-52 text-center">
                {view === Views.MONTH && format(currentDate, "MMMM yyyy")}
                {view === Views.WEEK && `${format(dateFnsStartOfWeek(currentDate), "d")} - ${format(dateFnsEndOfWeek(currentDate), "d MMM yyyy")}`}
                {view === Views.DAY && format(currentDate, "EEEE, d MMMM yyyy")}
                {view === Views.AGENDA && "Danh sách sự kiện"}
              </h2>
              <button onClick={() => setCurrentDate(view === Views.MONTH ? addMonths(currentDate, 1) : new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (view === Views.WEEK ? 7 : 1)))} className="p-2 hover:bg-gray-200 rounded-lg">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex bg-gray-100 rounded-xl p-1 shadow-sm">
            {["Month", "Week", "Day", "List"].map(v => (
              <button
                key={v}
                onClick={() => setView(Views[v.toUpperCase()])}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${view === Views[v.toUpperCase()] ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
              >
                {v === "Month" ? "Tháng" : v === "Week" ? "Tuần" : v === "Day" ? "Ngày" : "Danh sách"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <MiniCalendar />

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <h3 className="font-semibold text-lg mb-4">Bộ lọc sự kiện</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm font-medium">Hiển thị tất cả</span>
                </label>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters[key]}
                      onChange={e => setFilters(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    <div className={`w-4 h-4 rounded ${categoryColors[key]}`} />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Calendar */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden border">
            <div className="h-[720px]">
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                style={{ height: "100%", padding: "16px" }}
                view={view}
                onView={setView}
                date={currentDate}
                onNavigate={setCurrentDate}
                eventPropGetter={eventStyleGetter}
                messages={messages}
                formats={{
                  dayFormat: (date, culture, localizer) => localizer.format(date, "EEE d", culture),
                  monthHeaderFormat: (date, culture, localizer) => localizer.format(date, "MMMM yyyy", culture),
                }}
                dayPropGetter={(date) => ({
                  style: isToday(date) ? { backgroundColor: "#faf5ff" } : {},
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}