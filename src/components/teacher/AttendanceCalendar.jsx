import React, { useMemo, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Calendar as CalendarIcon, ArrowUpRight, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const WEEK_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTH_NAMES_VI = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

const pad2 = (n) => String(n).padStart(2, '0');
const toDateStr = (y, m, d) => `${y}-${pad2(m + 1)}-${pad2(d)}`;
const firstOfMonth = (y, m) => new Date(y, m, 1);
const lastOfMonth = (y, m) => new Date(y, m + 1, 0);

const autoCol = (rows) =>
  Object.keys(rows[0] || {}).map((k) => ({
    wch: Math.max(k.length, ...rows.map((r) => String(r[k] ?? '').length)) + 2,
  }));

/**
 * Props:
 *   data      — workload data[] từ API (mỗi item: { date, sessions[], created, not_created })
 *   overview  — { total_sessions, total_created, total_not_created, week_sessions }
 *   loading   — boolean
 *   fromDate  — YYYY-MM-DD (để init tháng hiển thị)
 *   onFilter  — (from: string, to: string) => void  (gọi khi chuyển tháng)
 */
const AttendanceCalendar = ({ data = [], overview = {}, loading = false, fromDate, onFilter }) => {
  const initDate = fromDate ? new Date(fromDate + 'T00:00:00') : new Date();
  const [displayDate, setDisplayDate] = useState(initDate);

  useEffect(() => {
    if (fromDate) setDisplayDate(new Date(fromDate + 'T00:00:00'));
  }, [fromDate]);

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  // Map dateStr → day data
  const sessionMap = useMemo(() => {
    const m = {};
    data.forEach((d) => { m[d.date] = d; });
    return m;
  }, [data]);

  // Calendar grid
  const startOffset = (firstOfMonth(year, month).getDay() + 6) % 7; // Mon=0
  const daysInMonth = lastOfMonth(year, month).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  const navigate = (delta) => {
    const next = new Date(year, month + delta, 1);
    setDisplayDate(next);
    const ny = next.getFullYear();
    const nm = next.getMonth();
    onFilter?.(toDateStr(ny, nm, 1), lastOfMonth(ny, nm).toISOString().slice(0, 10));
  };

  const exportToExcel = () => {
    if (!data.length) return;
    const wb = XLSX.utils.book_new();

    // Sheet 1: Tổng quan
    const overviewRows = [
      { 'Chỉ số': 'Tổng buổi dạy', 'Giá trị': overview.total_sessions ?? 0 },
      { 'Chỉ số': 'Đã tạo phiên ĐD', 'Giá trị': overview.total_created ?? 0 },
      { 'Chỉ số': 'Chưa tạo phiên ĐD', 'Giá trị': overview.total_not_created ?? 0 },
      { 'Chỉ số': 'Buổi trong tuần này', 'Giá trị': overview.week_sessions ?? 0 },
    ];
    const ws1 = XLSX.utils.json_to_sheet(overviewRows);
    ws1['!cols'] = autoCol(overviewRows);
    XLSX.utils.book_append_sheet(wb, ws1, 'Tổng quan');

    // Sheet 2: Chi tiết theo buổi
    const rows = data.flatMap((d) =>
      (d.sessions || []).map((s) => ({
        'Ngày': d.date,
        'Thứ': d.day_of_week,
        'Mã học phần': s.course_section?.code ?? '',
        'Tên học phần': s.course_section?.name ?? '',
        'Loại': s.schedule_type === 'theory' ? 'Lý thuyết' : 'Thực hành',
        'Bắt đầu': s.start_hour ?? '',
        'Kết thúc': s.end_hour ?? '',
        'Phòng': s.room?.room_code ?? '',
        'Nhóm': s.practice_group?.group_name ?? '',
        'Trạng thái': s.status ?? '',
        'Phiên ĐD': s.has_attendance_session ? 'Đã tạo' : 'Chưa tạo',
      }))
    );
    if (rows.length) {
      const ws2 = XLSX.utils.json_to_sheet(rows);
      ws2['!cols'] = autoCol(rows);
      XLSX.utils.book_append_sheet(wb, ws2, 'Chi tiết buổi dạy');
    }

    XLSX.writeFile(wb, `ChamCong_${MONTH_NAMES_VI[month]}_${year}.xlsx`);
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-sm">
            <CalendarIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Lịch Chấm Công</h3>
            <p className="text-xs text-gray-500 font-medium">
              {MONTH_NAMES_VI[month]} {year}
              {overview.total_sessions > 0 && (
                <span className="ml-2 text-indigo-600 font-semibold">
                  · {overview.total_created}/{overview.total_sessions} buổi đã tạo ĐD
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-medium text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Đã tạo
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" /> Chưa tạo
            </div>
          </div>

          {/* Month navigation */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg">
            <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-50 rounded-l-lg transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-xs font-semibold text-gray-700 px-2 min-w-[90px] text-center">
              {MONTH_NAMES_VI[month]} {year}
            </span>
            <button onClick={() => navigate(1)} className="p-1.5 hover:bg-gray-50 rounded-r-lg transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Export */}
          <button
            onClick={exportToExcel}
            disabled={!data.length}
            className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Excel
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Đang tải...</div>
        ) : (
          <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-lg overflow-hidden shadow-sm">
            {/* Week day headers */}
            {WEEK_DAYS.map((d) => (
              <div key={d} className="bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-500 border-r border-b border-gray-100">
                {d}
              </div>
            ))}

            {/* Cells */}
            {Array.from({ length: totalCells }, (_, i) => {
              const dayNum = i - startOffset + 1;
              const isValidDay = dayNum >= 1 && dayNum <= daysInMonth;
              const dateStr = isValidDay ? toDateStr(year, month, dayNum) : null;
              const dayData = dateStr ? sessionMap[dateStr] : null;
              const isToday = dateStr === today;

              if (!isValidDay) {
                return <div key={i} className="min-h-[70px] sm:min-h-[90px] border-r border-b border-gray-100 bg-slate-50/30" />;
              }

              return (
                <div
                  key={i}
                  className={`min-h-[70px] sm:min-h-[90px] p-2 border-r border-b border-gray-100 hover:bg-slate-50 transition-colors relative ${
                    isToday ? 'bg-blue-50/40' : ''
                  }`}
                >
                  {/* Day number */}
                  <span className={`text-sm font-semibold ${
                    isToday
                      ? 'w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-xs'
                      : 'text-slate-700'
                  }`}>
                    {dayNum}
                  </span>

                  {/* Session dots */}
                  {dayData && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {(dayData.sessions || []).map((session, sIdx) => (
                        <div key={sIdx} className="group/dot relative">
                          <div
                            className={`w-2.5 h-2.5 rounded-full shadow-sm cursor-help ${
                              session.has_attendance_session
                                ? 'bg-emerald-500'
                                : 'bg-amber-400 animate-pulse'
                            }`}
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 opacity-0 invisible group-hover/dot:opacity-100 group-hover/dot:visible transition-all scale-95 group-hover/dot:scale-100 pointer-events-none">
                            <div className="flex items-start gap-2 mb-2">
                              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${session.has_attendance_session ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                              <p className="text-xs font-bold text-slate-800 leading-tight">
                                {session.course_section?.name || 'Chưa có tên'}
                              </p>
                            </div>
                            <div className="space-y-1 text-[10px] text-slate-500 font-medium ml-4">
                              <p><span className="italic text-slate-400">Mã:</span> {session.course_section?.code}</p>
                              <p><span className="italic text-slate-400">Giờ:</span> {session.start_hour?.slice(0,5)} – {session.end_hour?.slice(0,5)}</p>
                              <p><span className="italic text-slate-400">Phòng:</span> {session.room?.room_code ?? '--'}</p>
                              <p className={`font-bold ${session.has_attendance_session ? 'text-emerald-600' : 'text-amber-500'}`}>
                                {session.has_attendance_session ? '✓ Đã tạo phiên ĐD' : '✗ Chưa tạo phiên ĐD'}
                              </p>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
