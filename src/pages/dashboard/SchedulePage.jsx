import React, { useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import vi from "date-fns/locale/vi";
import en from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  vi: vi,
  en: en,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) =>
    startOfWeek(date, {
      weekStartsOn: 1, // 1 = Thứ 2
    }),
  getDay,
  locales,
});

// Fake data sự kiện
const initialEvents = [
  {
    id: 1,
    title: "Khóa luận tốt nghiệp DKHTPM17A",
    start: new Date(2025, 10, 25, 9, 0), // 25/11/2025 09:00
    end: new Date(2025, 10, 25, 11, 40, 0),
    resource: { type: "meeting", note: "lịch dạy khóa luận" },
  },
  {
    id: 2,
    title: "Nhập môn lập trình 404000000 DKHTPM17A",
    start: new Date(2025, 10, 26, 14, 0),
    end: new Date(2025, 10, 26, 15, 0),
    resource: { type: "call" },
  },
  {
    id: 3,
    title: "......",
    start: new Date(2025, 10, 27, 8, 0),
    end: new Date(2025, 10, 27, 12, 0),
    resource: { type: "event" },
  },
];

const SchedulePage = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState(initialEvents);
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

  // Tuỳ chỉnh style cho sự kiện
  const eventPropGetter = (event) => {
    let backgroundColor = "#3174ad"; // mặc định

    if (event?.resource?.type === "meeting") backgroundColor = "#16a34a"; // xanh lá
    if (event?.resource?.type === "call") backgroundColor = "#eab308"; // vàng
    if (event?.resource?.type === "event") backgroundColor = "#dc2626"; // đỏ

    return {
      style: {
        backgroundColor,
        borderRadius: "8px",
        opacity: 0.9,
        border: "none",
        color: "white",
        padding: "2px 4px",
        fontSize: "0.8rem",
      },
    };
  };

  const messages = useMemo(
    () => ({
      date: "Ngày",
      time: "Thời gian",
      event: "Sự kiện",
      allDay: "Cả ngày",
      week: "Tuần",
      work_week: "Tuần làm việc",
      day: "Ngày",
      month: "Tháng",
      previous: "Trước",
      next: "Sau",
      today: "Hôm nay",
      agenda: "Danh sách",
      noEventsInRange: "Không có sự kiện trong khoảng thời gian này.",
      showMore: (total) => `+${total} sự kiện nữa`,
    }),
    []
  );

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("Nhập tiêu đề sự kiện mới:");
    if (title) {
      const newEvent = {
        id: events.length + 1,
        title,
        start,
        end,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleSelectEvent = (event) => {
    alert(`Sự kiện: ${event.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('schedulePage.title')}</h1>
          <p className="text-sm text-gray-500">
            {t('schedulePage.description')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-sm border rounded-lg"
            onClick={() => setDate(new Date())}
          >
            Hôm nay
          </button>
          <button
            className="px-3 py-1 text-sm border rounded-lg"
            onClick={() =>
              setDate(
                new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
              )
            }
          >
            ◀ Tuần trước
          </button>
          <button
            className="px-3 py-1 text-sm border rounded-lg"
            onClick={() =>
              setDate(
                new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)
              )
            }
          >
            Tuần sau ▶
          </button>

          <select
            className="px-2 py-1 text-sm border rounded-lg"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value={Views.MONTH}>Tháng</option>
            <option value={Views.WEEK}>Tuần</option>
            <option value={Views.DAY}>Ngày</option>
            <option value={Views.AGENDA}>Danh sách</option>
          </select>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow p-4 h-[700px]">
        <Calendar
          localizer={localizer}
          culture={i18n.language}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventPropGetter}
          messages={messages}
        />
      </div>
    </div>
  );
};

export default SchedulePage;
