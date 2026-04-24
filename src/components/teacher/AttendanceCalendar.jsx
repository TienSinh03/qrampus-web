import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowUpRight } from "lucide-react";

const AttendanceCalendar = () => {
  const daysInMonth = Array.from({ length: 31 }, (_, i) => ({
    date: i + 1,
    sessions: [
      { id: 1, name: "Lập trình React Native", code: "RN101", slot: "Tiết 1-3", status: "success" },
      { id: 2, name: "Cơ sở dữ liệu", code: "DB202", slot: "Tiết 4-6", status: "pending" },
      { id: 3, name: "Kỹ năng mềm", code: "SK303", slot: "Tiết 7-9", status: "success" },
    ].slice(0, Math.floor(Math.random() * 4)),
  }));

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

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
            <p className="text-xs text-gray-500 font-medium">Kỳ công tháng 12/2026</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors bg-green-50 px-3 py-1 border border-gray-200 hover:bg-gray-100">
              <ArrowUpRight className="w-4 h-4" />
              Xuất Excel
            </button>
            <input type="date" className="text-xs border-none focus:ring-0 p-0 cursor-pointer" defaultValue="2026-12-01" />
            <span className="text-gray-400">→</span>
            <input type="date" className="text-xs border-none focus:ring-0 p-0 cursor-pointer" defaultValue="2026-12-31" />
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium text-gray-600">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Thành công
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Chưa tạo
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 border-t border-l border-gray-100 rounded-lg overflow-hidden shadow-sm">
          {weekDays.map((day) => (
            <div key={day} className="bg-slate-50 py-2.5 text-center text-xs font-bold text-slate-500 border-r border-b border-gray-100">
              {day}
            </div>
          ))}

          {daysInMonth.map((item, idx) => (
            <div key={idx} className="min-h-[70px] sm:min-h-[90px] p-2 border-r border-b border-gray-100 hover:bg-slate-50 transition-colors group relative">
              <span className="text-sm font-semibold text-slate-700">{item.date}</span>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {item.sessions.map((session, sIdx) => (
                  <div key={sIdx} className="group/dot relative">
                    <div className={`w-2.5 h-2.5 rounded-full shadow-sm cursor-help ${
                      session.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                    }`} />

                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 opacity-0 invisible group-hover/dot:opacity-100 group-hover/dot:visible transition-all scale-95 group-hover/dot:scale-100 pointer-events-none">
                      <div className="flex items-start gap-2 mb-2">
                        <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${session.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <p className="text-xs font-bold text-slate-800 leading-tight">{session.name}</p>
                      </div>
                      <div className="space-y-1 text-[10px] text-slate-500 font-medium ml-4">
                        <p><span className="text-slate-400 italic">Mã:</span> {session.code}</p>
                        <p><span className="text-slate-400 italic">Tiết:</span> {session.slot}</p>
                        <p className={`font-bold ${session.status === 'success' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          • {session.status === 'success' ? 'Đã tạo phiên' : 'Chưa tạo phiên'}
                        </p>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;
