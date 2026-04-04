import { useState, useMemo, useEffect, useCallback } from "react";
import {
  CalendarDaysIcon,
  ChevronLeft,
  ChevronRight,
  Printer,
  RefreshCw,
  Loader2,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  parseISO,
} from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useTeacherSchedule } from "@contexts/TeacherScheduleContext";

const SchedulePage = () => {
  const navigate = useNavigate();
  const { 
    schedules, 
    loading, 
    error, 
    fetchSchedules, 
    refreshSchedules,
    getSchedulesByWeek 
  } = useTeacherSchedule();

  /* ================= STATE ================= */
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [monthCursor, setMonthCursor] = useState(new Date());

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  /* ================= WEEK ================= */
  const weekDates = useMemo(() => {
    const days = eachDayOfInterval({
      start: currentWeekStart,
      end: endOfWeek(currentWeekStart, { weekStartsOn: 1 }),
    });

    return days.map((date) => ({
      raw: date,
      dayName: format(date, "EEEE", { locale: vi }),
      date: format(date, "dd/MM/yyyy"),
    }));
  }, [currentWeekStart]);

  const weekSchedules = useMemo(() => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return getSchedulesByWeek(currentWeekStart, weekEnd);
  }, [currentWeekStart, getSchedulesByWeek]);

  /* ================= MONTH ================= */
  const monthDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(monthCursor), {
          weekStartsOn: 1,
        }),
        end: endOfWeek(endOfMonth(monthCursor), {
          weekStartsOn: 1,
        }),
      }),
    [monthCursor]
  );

  /* ================= ACTION ================= */
  const goToPreviousWeek = () =>
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  const goToNextWeek = () =>
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  const goToCurrentWeek = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const handleRefresh = useCallback(() => {
    refreshSchedules();
  }, [refreshSchedules]);

  /* ================= UTILS ================= */
  /**
   * Get shift (Sáng/Chiều/Tối) based on start_hour
   */
  const getShiftFromHour = (startHour) => {
    if (!startHour) return null;
    const hour = parseInt(startHour.split(":")[0], 10);
    
    if (hour < 12) return "Sáng";
    if (hour < 18) return "Chiều";
    return "Tối";
  };

  /**
   * Format time from "HH:mm:ss" to "HH:mm"
   */
  const formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

  /**
   * Check if schedule date matches target date
   */
  const isSameDate = (scheduleDate, targetDateStr) => {
    if (!scheduleDate) return false;
    const scheduleFormatted = format(parseISO(scheduleDate), "dd/MM/yyyy");
    return scheduleFormatted === targetDateStr;
  };

  /**
   * Get status style
   */
  const getStatusStyle = (status, scheduleType) => {
    if (status === 'cancelled') {
      return { bg: "bg-red-100", border: "border-red-400", text: "text-red-700" };
    }
    if (status === 'completed') {
      return { bg: "bg-green-100", border: "border-green-400", text: "text-green-700" };
    }
    // scheduled - default
    if (scheduleType === 'practice') {
      return { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-700" };
    }
    return { bg: "bg-gray-100", border: "border-gray-400", text: "text-gray-700" };
  };

  /**
   * Get schedule type label
   */
  const getScheduleTypeLabel = (type) => {
    return type === 'theory' ? 'Lý thuyết' : 'Thực hành';
  };

  /* ================= JSX ================= */
  // Loading state
  if (loading && schedules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Đang tải lịch dạy...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && schedules.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleRefresh}
            className="btn-blue flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2">
      <div className="mx-auto">
        {/* HEADER */}
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="bg-white  shadow-sm border p-4 flex flex-wrap justify-between gap-4">
          <h2 className="text-xl font-semibold text-blue-900">
            Lịch học, lịch thi theo tuần
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-gray">Tất cả</button>
            <button className="btn-blue">Lịch học</button>
            <button className="btn-blue">Lịch thi</button>

            {/* MONTH PICKER */}
            <div className="relative">
              <div
                onClick={() => setShowMonthPicker(!showMonthPicker)}
                className="flex items-center gap-2 border rounded-xl px-3 py-2 cursor-pointer hover:shadow"
              >
                <div className="w-9 h-9 flex items-center justify-center bg-blue-100 text-blue-700 rounded-lg">
                  <CalendarDaysIcon className="w-5 h-5" />
                </div>
                <input
                  readOnly
                  value={`${weekDates[0]?.date} - ${weekDates[6]?.date}`}
                  className="w-44 text-sm font-medium text-center bg-transparent outline-none"
                />
              </div>

              {showMonthPicker && (
                <div className="absolute z-50 top-full mt-2 bg-white border rounded-xl shadow-xl p-4 w-72">
                  <div className="flex justify-between mb-3">
                    <button onClick={() => setMonthCursor(subWeeks(monthCursor, 4))}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-semibold">
                      {format(monthCursor, "MMMM yyyy", { locale: vi })}
                    </span>
                    <button onClick={() => setMonthCursor(addWeeks(monthCursor, 4))}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-xs text-center">
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                      <div key={d} className="font-medium text-gray-500">
                        {d}
                      </div>
                    ))}

                    {monthDays.map((day) => (
                      <button
                        key={day.toString()}
                        onClick={() => {
                          setCurrentWeekStart(
                            startOfWeek(day, { weekStartsOn: 1 })
                          );
                          setShowMonthPicker(false);
                        }}
                        className={`py-2 rounded hover:bg-blue-100 ${format(day, "MM") !== format(monthCursor, "MM")
                          ? "text-gray-300"
                          : ""
                          }`}
                      >
                        {format(day, "d")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION */}
            <button 
              onClick={handleRefresh}
              disabled={loading}
              className="btn-gray"
            >
              <RefreshCw className={`w-4 h-4 inline mr-1 ${loading ? 'animate-spin' : ''}`} /> Làm mới
            </button>
            <button className="btn-gray">
              <Printer className="w-4 h-4 inline mr-1" />
              In lịch
            </button>
            <button onClick={goToCurrentWeek} className="btn-blue">
              <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
              Hiện tại
            </button>
            <button onClick={goToPreviousWeek} className="icon-btn">
              <ChevronLeft />
            </button>
            <button onClick={goToNextWeek} className="icon-btn">
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-b-xl shadow border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sky-500 text-white">
              <tr>
                <th className="py-4 w-32">Ca học</th>
                {weekDates.map((d) => (
                  <th key={d.date} className="py-4">
                    <div>{d.dayName}</div>
                    <div className="text-lg font-bold">{d.date}</div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {["Sáng", "Chiều", "Tối"].map((shift) => (
                <tr key={shift} className="border-t">
                  <td className="py-6 px-4 font-medium">{shift}</td>

                  {weekDates.map((d, idx) => {
                    const matchedSchedules = weekSchedules.filter((schedule) => {
                      return (
                        isSameDate(schedule.class_date, d.date) &&
                        getShiftFromHour(schedule.start_hour) === shift
                      );
                    });

                    return (
                      <td key={idx} className="h-36 p-2 border-l align-top">
                        <div className="flex flex-col gap-2">
                          {matchedSchedules.map((schedule) => {
                            const style = getStatusStyle(schedule.status, schedule.schedule_type);
                            
                            return (
                              <button 
                                key={schedule.id} 
                                className="cursor-pointer w-full text-left"
                                onClick={() => navigate('/dashboard/study-session', { 
                                  state: { schedule: schedule }
                                })}
                              >
                                <div
                                  className={`border-2 rounded-lg p-3 w-full ${style.bg} ${style.border} hover:shadow-md transition-shadow`}
                                >
                                  <div className="flex flex-col space-y-1">
                                    <div className="font-bold text-sm">
                                      <span className="text-blue-600 hover:underline">
                                        {schedule.courseSection?.name || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {schedule.courseSection?.code}
                                    </div>

                                    <div className="text-xs space-y-0.5 mt-1">
                                      <div>
                                        <span className="font-medium">Giờ:</span>{" "}
                                        {formatTime(schedule.start_hour)} - {formatTime(schedule.end_hour)}
                                      </div>
                                      <div>
                                        <span className="font-medium">Phòng:</span>{" "}
                                        {schedule.room?.room_code || 'N/A'}
                                      </div>
                                      <div>
                                        <span className="font-medium">Buổi:</span>{" "}
                                        {schedule.session_number}
                                      </div>
                                      <div>
                                        <span className="font-medium">Loại:</span>{" "}
                                        {getScheduleTypeLabel(schedule.schedule_type)}
                                        {schedule.practiceGroup && (
                                          <span className="ml-1">
                                            (Nhóm {schedule.practiceGroup.number_group})
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Status badge */}
                                    <div className="mt-2">
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${style.text} ${style.bg} border ${style.border}`}>
                                        {schedule.status === 'completed' ? 'Đã hoàn thành' : 
                                         schedule.status === 'cancelled' ? 'Đã hủy' : 'Đã lên lịch'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap items-center gap-6 text-sm p-6">
          <div className="flex items-center gap-2">
            <span className="w-6 h-4 bg-gray-100 border border-gray-400 rounded-sm" />
            <span className="text-gray-700">Lý thuyết</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-4 bg-blue-100 border border-blue-400 rounded-sm" />
            <span className="text-gray-700">Thực hành</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-4 bg-green-100 border border-green-400 rounded-sm" />
            <span className="text-gray-700">Đã hoàn thành</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-6 h-4 bg-red-100 border border-red-400 rounded-sm" />
            <span className="text-gray-700">Đã hủy</span>
          </div>
        </div>

        {/* Summary info */}
        {schedules.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-6 mb-6">
            <p className="text-sm text-blue-800">
              Tổng số buổi dạy trong tuần này: <strong>{weekSchedules.length}</strong>
              {weekSchedules.length > 0 && (
                <span className="ml-2">
                  (Lý thuyết: {weekSchedules.filter(s => s.schedule_type === 'theory').length}, 
                  Thực hành: {weekSchedules.filter(s => s.schedule_type === 'practice').length})
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage;
