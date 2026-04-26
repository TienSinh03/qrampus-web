import React, { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import {
  Users, BookOpen, Building2, FileText,
  CheckCircle, Calendar, PlusCircle, History,
  ArrowUpRight, ArrowDownRight, RefreshCw, Download,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend,
} from "recharts";
import { useNavigate } from "react-router-dom";
import attendanceService from "@services/attendance.service";

const TODAY = new Date().toISOString().slice(0, 10);
const FIRST_OF_MONTH = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  .toISOString()
  .slice(0, 10);

const BAR_COLORS = { success: "#10b981", missed: "#f59e0b" };
const PIE_COLORS = ["#10b981", "#f59e0b"];

const fmt = (dateStr) => {
  if (!dateStr) return "";
  const [, m, d] = dateStr.split("-");
  return `${d}/${m}`;
};

const StatCard = ({ label, value, icon: Icon, gradient, loading }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
    <div className="flex justify-between items-start">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500 mb-1 truncate">{label}</p>
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800">
          {loading ? <span className="animate-pulse text-gray-300">...</span> : (value ?? 0).toLocaleString()}
        </h3>
      </div>
      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

const SubCard = ({ label, value, icon: Icon, bg, text, loading }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
    <div className={`p-3 ${bg} rounded-lg ${text}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-xl font-bold text-gray-800">
        {loading ? <span className="animate-pulse">...</span> : (value ?? 0).toLocaleString()}
      </p>
    </div>
  </div>
);

export default function AttendanceDashboardPage() {
  const navigate = useNavigate();

  const [fromDate, setFromDate] = useState(FIRST_OF_MONTH);
  const [toDate, setToDate] = useState(TODAY);

  const [summary, setSummary] = useState(null);
  const [todayStats, setTodayStats] = useState(null);
  const [loadingChart, setLoadingChart] = useState(true);
  const [loadingToday, setLoadingToday] = useState(true);

  const fetchSummary = useCallback(async () => {
    setLoadingChart(true);
    try {
      const res = await attendanceService.getAdminAttendanceSummary(fromDate, toDate);
      setSummary(res?.data || res);
    } catch {
      setSummary(null);
    } finally {
      setLoadingChart(false);
    }
  }, [fromDate, toDate]);

  const fetchToday = useCallback(async () => {
    setLoadingToday(true);
    try {
      const res = await attendanceService.getScheduleTodayStats();
      setTodayStats(res?.data || res);
    } catch {
      setTodayStats(null);
    } finally {
      setLoadingToday(false);
    }
  }, []);

  useEffect(() => { fetchSummary(); }, [fetchSummary]);
  useEffect(() => { fetchToday(); }, [fetchToday]);

  const overview = summary?.overview || { total_sessions: 0, total_created: 0, total_not_created: 0 };
  const efficiency = overview.total_sessions > 0
    ? ((overview.total_created / overview.total_sessions) * 100).toFixed(1)
    : "0.0";

  const chartData = (summary?.data || []).map((d) => ({
    date: fmt(d.date),
    success: d.created,
    missed: d.not_created,
  }));

  const exportToExcel = () => {
    if (!summary) return;
    const wb = XLSX.utils.book_new();
    const autoCol = (rows) =>
      Object.keys(rows[0] || {}).map((k) => ({
        wch: Math.max(k.length, ...rows.map((r) => String(r[k] ?? "").length)) + 2,
      }));

    // Sheet 1: Tổng quan
    const overviewRows = [
      { "Chỉ số": "Từ ngày", "Giá trị": fromDate },
      { "Chỉ số": "Đến ngày", "Giá trị": toDate },
      { "Chỉ số": "Tổng buổi học", "Giá trị": overview.total_sessions },
      { "Chỉ số": "Đã tạo phiên ĐD", "Giá trị": overview.total_created },
      { "Chỉ số": "Chưa tạo phiên ĐD", "Giá trị": overview.total_not_created },
      { "Chỉ số": "Hiệu suất (%)", "Giá trị": efficiency },
      { "Chỉ số": "Hôm nay - Tổng", "Giá trị": todayStats?.total ?? 0 },
      { "Chỉ số": "Hôm nay - Đã tạo", "Giá trị": todayStats?.created ?? 0 },
      { "Chỉ số": "Hôm nay - Chưa tạo", "Giá trị": todayStats?.not_created ?? 0 },
    ];
    const ws1 = XLSX.utils.json_to_sheet(overviewRows);
    ws1["!cols"] = autoCol(overviewRows);
    XLSX.utils.book_append_sheet(wb, ws1, "Tổng quan");

    // Sheet 2: Tổng hợp theo ngày
    const dailyRows = (summary.data || []).map((d) => ({
      "Ngày": d.date,
      "Tổng buổi": d.total,
      "Đã tạo ĐD": d.created,
      "Chưa tạo ĐD": d.not_created,
    }));
    if (dailyRows.length) {
      const ws2 = XLSX.utils.json_to_sheet(dailyRows);
      ws2["!cols"] = autoCol(dailyRows);
      XLSX.utils.book_append_sheet(wb, ws2, "Theo ngày");
    }

    // Sheet 3: Chi tiết buổi học
    const detailRows = (summary.data || []).flatMap((d) =>
      (d.sessions || []).map((s) => ({
        "Ngày": d.date,
        "Mã học phần": s.course_section?.code ?? "",
        "Tên học phần": s.course_section?.name ?? "",
        "Học kỳ": s.course_section?.semester ?? "",
        "Mã GV": s.personnel?.teacher_code ?? "",
        "Giảng viên": s.personnel?.full_name ?? "",
        "Khoa": s.personnel?.department ?? "",
        "Giờ bắt đầu": s.start_hour ?? "",
        "Giờ kết thúc": s.end_hour ?? "",
        "Phòng": s.room?.room_code ?? "",
        "Loại lịch": s.schedule_type === "theory" ? "Lý thuyết" : "Thực hành",
        "Trạng thái buổi": s.status ?? "",
        "Đã tạo ĐD": s.has_attendance_session ? "Có" : "Không",
      }))
    );
    if (detailRows.length) {
      const ws3 = XLSX.utils.json_to_sheet(detailRows);
      ws3["!cols"] = autoCol(detailRows);
      XLSX.utils.book_append_sheet(wb, ws3, "Chi tiết buổi học");
    }

    const fileName = `ThongKeCongDay_${fromDate}_${toDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const quickActions = [
    { label: "Lịch dạy", sub: "Quản lý", icon: Calendar, color: "bg-blue-100", text: "text-blue-600", path: "/dashboard/attendance-schedule" },
    { label: "Kết quả ĐD", sub: "Quản lý", icon: CheckCircle, color: "bg-purple-100", text: "text-purple-600", path: "/dashboard/attendance-results" },
    { label: "Lịch học", sub: "Quản lý", icon: BookOpen, color: "bg-amber-100", text: "text-amber-600", path: "/dashboard/admin/schedules" },
    { label: "Báo cáo", sub: "Quản lý", icon: FileText, color: "bg-emerald-100", text: "text-emerald-600", path: "/dashboard/reports" },
  ];

  return (
    <div className="bg-gray-50 p-4 font-sans">
      {/* Header */}
      <div className="mb-8">
        <div className="h-1 bg-[#153898] mb-6 rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Dashboard Bộ phận Quản lý Công
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <Calendar className="w-4 h-4 text-[#153898]" />
            <span className="capitalize">
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard label="Công đã tạo (kỳ lọc)" value={overview.total_created} icon={CheckCircle} gradient="from-blue-500 to-blue-600" loading={loadingChart} />
        <StatCard label="Công chưa tạo (kỳ lọc)" value={overview.total_not_created} icon={PlusCircle} gradient="from-purple-500 to-purple-600" loading={loadingChart} />
        <StatCard label="Tổng buổi học (kỳ lọc)" value={overview.total_sessions} icon={History} gradient="from-amber-500 to-amber-600" loading={loadingChart} />
        <StatCard label={`Hiệu suất (${fromDate} → ${toDate})`} value={`${efficiency}%`} icon={Building2} gradient="from-rose-500 to-rose-600" loading={loadingChart} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left: sub-cards + chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub-cards hôm nay */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SubCard label="Tổng công dạy hôm nay" value={todayStats?.total} icon={Calendar} bg="bg-indigo-50" text="text-indigo-600" loading={loadingToday} />
            <SubCard label="Công dạy đã tạo ĐD" value={todayStats?.created} icon={CheckCircle} bg="bg-emerald-50" text="text-emerald-600" loading={loadingToday} />
            <SubCard label="Công dạy chưa tạo ĐD" value={todayStats?.not_created} icon={PlusCircle} bg="bg-amber-50" text="text-amber-600" loading={loadingToday} />
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  Thống kê Công dạy
                </h3>
                <p className="text-xs text-gray-500 italic mt-1">* Số buổi học đã tạo / chưa tạo phiên điểm danh</p>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 flex-wrap">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent border-none text-xs focus:ring-0 cursor-pointer text-gray-600"
                />
                <span className="text-gray-400 text-xs font-bold">→</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-transparent border-none text-xs focus:ring-0 cursor-pointer text-gray-600"
                />
                <button
                  onClick={fetchSummary}
                  className="flex items-center gap-1 text-xs text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Lọc
                </button>
                <button
                  onClick={exportToExcel}
                  disabled={!summary || loadingChart}
                  className="flex items-center gap-1 text-xs text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1 rounded transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Excel
                </button>
              </div>
            </div>

            <div className="h-[320px] w-full">
              {loadingChart ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Đang tải...
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Không có dữ liệu trong khoảng thời gian này
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                    <Tooltip
                      cursor={{ fill: "#f9fafb" }}
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                    />
                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: "20px", fontSize: "12px" }} />
                    <Bar dataKey="success" name="Đã tạo" stackId="a" fill={BAR_COLORS.success} barSize={24} radius={[0, 0, 0, 0]} />
                    <Bar dataKey="missed" name="Chưa tạo" stackId="a" fill={BAR_COLORS.missed} barSize={24} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Right: quick actions + pie chart */}
        <div className="flex flex-col gap-6 self-start">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                    <action.icon className={`w-5 h-5 ${action.text}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 leading-tight truncate">{action.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 hidden sm:block">{action.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {loadingChart ? (
              <div className="h-[250px] flex items-center justify-center text-gray-400 text-sm">Đang tải...</div>
            ) : (
              <>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Đã tạo", value: overview.total_created },
                          { name: "Chưa tạo", value: overview.total_not_created },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {PIE_COLORS.map((color, i) => <Cell key={i} fill={color} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} />
                      <RechartsLegend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm text-gray-500">
                    Hiệu suất tạo phiên:{" "}
                    <span className="font-bold text-emerald-600">{efficiency}%</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
