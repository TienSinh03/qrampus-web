import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Users, GraduationCap, BookOpen, Building2, FileText,
  CheckCircle, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight,
  PlusCircle, History, Calendar as CalendarIcon, Download, Loader2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend as RechartsLegend,
} from "recharts";
import * as XLSX from "xlsx";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import reportService from "@services/report.service";
import attendanceService from "@services/attendance.service";

// ─── helpers ──────────────────────────────────────────────────────────────────

const todayStr = () => new Date().toISOString().slice(0, 10);

const firstDayOfMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
};

const fmtLabel = (dateStr) => {
  if (!dateStr) return "";
  const [, mo, dd] = dateStr.split("-");
  return `${dd}/${mo}`;
};

const fmtPct = (created, total) =>
  total ? `${((created / total) * 100).toFixed(1)}%` : "0%";

// ─── Excel export ─────────────────────────────────────────────────────────────

const autoCol = (ws, data) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  ws["!cols"] = headers.map((h) => ({
    wch: Math.max(h.length, ...data.map((r) => String(r[h] ?? "").length)) + 2,
  }));
};

const exportToExcel = (apiData, fromDate, toDate) => {
  const { overview, data: days = [] } = apiData;
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Tổng quan ──
  const overviewRows = [
    { "Chỉ số": "Từ ngày", "Giá trị": fromDate },
    { "Chỉ số": "Đến ngày", "Giá trị": toDate },
    { "Chỉ số": "Tổng số buổi học", "Giá trị": overview.total_sessions },
    { "Chỉ số": "Đã tạo phiên điểm danh", "Giá trị": overview.total_created },
    { "Chỉ số": "Chưa tạo phiên điểm danh", "Giá trị": overview.total_not_created },
    {
      "Chỉ số": "Hiệu suất (%)",
      "Giá trị": fmtPct(overview.total_created, overview.total_sessions),
    },
  ];
  const wsOverview = XLSX.utils.json_to_sheet(overviewRows);
  autoCol(wsOverview, overviewRows);
  XLSX.utils.book_append_sheet(wb, wsOverview, "Tổng quan");

  // ── Sheet 2: Tổng hợp theo ngày ──
  const summaryRows = days.map((d) => ({
    "Ngày": d.date,
    "Đã tạo": d.created,
    "Chưa tạo": d.not_created,
    "Tổng": d.total,
    "Hiệu suất (%)": fmtPct(d.created, d.total),
  }));
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  autoCol(wsSummary, summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Tổng hợp theo ngày");

  // ── Sheet 3: Chi tiết buổi học ──
  const detailRows = [];
  days.forEach((day) => {
    (day.sessions || []).forEach((s) => {
      const cs = s.course_section || {};
      const p = s.personnel || {};
      detailRows.push({
        "Ngày":                  day.date,
        "Buổi số":               s.session_number,
        "Loại":                  s.schedule_type === "theory" ? "Lý thuyết" : "Thực hành",
        "Giờ bắt đầu":           s.start_hour,
        "Giờ kết thúc":          s.end_hour,
        "Trạng thái buổi học":   s.status,
        "Đã tạo phiên ĐD":       s.has_attendance_session ? "Có" : "Chưa",
        // Học phần
        "Mã học phần":           cs.code    || "",
        "Tên học phần":          cs.name    || "",
        "Học kỳ":                cs.semester|| "",
        "Số tín chỉ":            cs.credits ?? "",
        // Giảng viên
        "Mã giảng viên":         p.teacher_code || "",
        "Họ tên giảng viên":     p.full_name    || "",
        "Khoa / Bộ môn":         p.department   || "",
        "Email giảng viên":      p.email        || "",
      });
    });
  });

  if (detailRows.length) {
    const wsDetail = XLSX.utils.json_to_sheet(detailRows);
    autoCol(wsDetail, detailRows);
    XLSX.utils.book_append_sheet(wb, wsDetail, "Chi tiết buổi học");
  }

  XLSX.writeFile(wb, `diem_danh_${fromDate}_${toDate}.xlsx`);
};

// ─── Skeleton / Error states ──────────────────────────────────────────────────

const ChartSkeleton = ({ height = 360 }) => (
  <div
    className="w-full flex items-center justify-center"
    style={{ height }}
  >
    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
  </div>
);

const ChartError = ({ message, height = 360 }) => (
  <div
    className="w-full flex flex-col items-center justify-center text-red-400 gap-2"
    style={{ height }}
  >
    <AlertCircle className="w-8 h-8 opacity-60" />
    <p className="text-sm">{message}</p>
  </div>
);

const GrowthIndicator = ({ growth }) => {
  const n = Number(growth || 0);
  if (n > 0)
    return (
      <div className="flex items-center gap-1">
        <ArrowUpRight className="w-4 h-4 text-emerald-500" />
        <span className="text-sm font-medium text-emerald-500">+{n.toFixed(1)}%</span>
        <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
      </div>
    );
  if (n < 0)
    return (
      <div className="flex items-center gap-1">
        <ArrowDownRight className="w-4 h-4 text-rose-500" />
        <span className="text-sm font-medium text-rose-500">{n.toFixed(1)}%</span>
        <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
      </div>
    );
  return (
    <span className="text-sm text-gray-500 font-medium">Không đổi so với tháng trước</span>
  );
};

const CHART_H = 360; // height dùng chung cho cả bar + pie

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // ── Dashboard stats ──
  const [stats, setStats] = useState({
    students: { total: 0, growth: 0 },
    teachers: { total: 0, growth: 0 },
    courses:  { total: 0, growth: 0 },
    rooms:    { total: 0, growth: 0 },
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await reportService.getDashboardStats();
        if (res?.success && res?.data) {
          setStats({
            students: { total: res.data.students?.total || 0, growth: res.data.students?.growth || 0 },
            teachers: { total: res.data.teachers?.total || 0, growth: res.data.teachers?.growth || 0 },
            courses:  { total: res.data.courses?.total  || 0, growth: res.data.courses?.growth  || 0 },
            rooms:    { total: res.data.rooms?.total    || 0, growth: res.data.rooms?.growth    || 0 },
          });
        }
      } catch (e) {
        setStatsError(e.message || "Lỗi kết nối");
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  // ── Attendance summary ──
  const [fromDate, setFromDate] = useState(firstDayOfMonth());
  const [toDate,   setToDate]   = useState(todayStr());
  const [apiData,      setApiData]      = useState(null);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError,   setChartError]   = useState("");

  const fetchSummary = useCallback(async (from, to) => {
    setChartLoading(true);
    setChartError("");
    try {
      const res = await attendanceService.getAdminAttendanceSummary(from, to);
      if (!res?.success) throw new Error(res?.message || "Không thể tải dữ liệu");
      setApiData(res.data || null);
    } catch (e) {
      setChartError(e.message || "Lỗi tải dữ liệu điểm danh");
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => { fetchSummary(fromDate, toDate); }, []); // eslint-disable-line

  const overview = apiData?.overview ?? { total_sessions: 0, total_created: 0, total_not_created: 0 };
  const days     = apiData?.data    ?? [];

  const barData = useMemo(
    () => days.map((d) => ({ date: fmtLabel(d.date), "Đã tạo": d.created, "Chưa tạo": d.not_created })),
    [days]
  );

  const pieData = useMemo(() => [
    { name: "Đã tạo",    value: overview.total_created      },
    { name: "Chưa tạo",  value: overview.total_not_created  },
  ], [overview]);

  // ── Config ──
  const statCards = useMemo(() => [
    { label: "Tổng sinh viên", ...stats.students, icon: GraduationCap, color: "from-blue-500 to-blue-600",   path: "/dashboard/admin/students" },
    { label: "Tổng giảng viên",...stats.teachers, icon: Users,          color: "from-purple-500 to-purple-600",path: "/dashboard/admin/teachers" },
    { label: "Tổng khóa học",  ...stats.courses,  icon: BookOpen,       color: "from-amber-500 to-amber-600", path: "/dashboard/admin/courses"  },
    { label: "Tổng phòng học", ...stats.rooms,    icon: Building2,      color: "from-rose-500 to-rose-600",   path: "/dashboard/admin/rooms"    },
  ], [stats]);

  const quickActions = [
    { label: "Quản lý tài khoản", icon: Users,     color: "bg-blue-100",   text: "text-blue-600",   path: "/dashboard/admin/accounts"  },
    { label: "Quản lý khóa học",  icon: BookOpen,  color: "bg-purple-100", text: "text-purple-600", path: "/dashboard/admin/courses"   },
    { label: "Quản lý lịch học",  icon: Calendar,  color: "bg-amber-100",  text: "text-amber-600",  path: "/dashboard/admin/schedules" },
    { label: "Quản lý khảo sát",  icon: FileText,  color: "bg-emerald-100",text: "text-emerald-600",path: "/dashboard/admin/surveys"   },
  ];

  return (
    <div className="bg-gray-50 p-4 font-sans space-y-6">

      {/* ── Header ── */}
      <div>
        <div className="h-1 bg-[#153898] mb-5 rounded-full" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Quản trị</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            <Calendar className="w-4 h-4 text-[#153898]" />
            <span className="capitalize">
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 1: Stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-500 mb-1 truncate">{card.label}</p>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800">
                  {statsLoading ? <span className="animate-pulse">…</span> : card.total.toLocaleString()}
                </h3>
                <div className="mt-2 min-h-[20px]">
                  {!statsLoading && <GrowthIndicator growth={card.growth} />}
                </div>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 2: Overview sub-cards + Quick actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sub-cards (2/3) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Tổng số buổi", value: overview.total_sessions,     icon: CalendarIcon,  bg: "bg-indigo-50",  txt: "text-indigo-600"  },
            { label: "Đã tạo phiên", value: overview.total_created,      icon: CheckCircle,  bg: "bg-emerald-50", txt: "text-emerald-600" },
            { label: "Chưa tạo",     value: overview.total_not_created,  icon: PlusCircle,   bg: "bg-amber-50",   txt: "text-amber-600"   },
          ].map(({ label, value, icon: Icon, bg, txt }) => (
            <div key={label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className={`p-3 ${bg} ${txt} rounded-lg`}><Icon size={20} /></div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className={`text-xl font-bold ${txt}`}>
                  {chartLoading ? <span className="text-gray-300 animate-pulse">--</span> : value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions (1/3) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-2 gap-3 h-full">
            {quickActions.map((a, i) => (
              <button
                key={i}
                onClick={() => navigate(a.path)}
                className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left group"
              >
                <div className={`h-9 w-9 rounded-lg ${a.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
                  <a.icon className={`w-4 h-4 ${a.text}`} />
                </div>
                <p className="text-xs font-bold text-gray-800 leading-tight truncate">{a.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: Charts (equal height) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">

        {/* Bar chart (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-600" />
                Thống kê phiên điểm danh theo ngày
              </h3>
              <p className="text-[11px] text-gray-400 italic mt-0.5">
                Số buổi đã / chưa tạo phiên điểm danh — stacked bar
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Export */}
              <button
                onClick={() => apiData && exportToExcel(apiData, fromDate, toDate)}
                disabled={chartLoading || !apiData || !days.length}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="w-3.5 h-3.5" />
                Xuất Excel
              </button>

              {/* Date range */}
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
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
                  onClick={() => fetchSummary(fromDate, toDate)}
                  disabled={chartLoading}
                  className="ml-1 text-xs font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-2.5 py-1 rounded-md transition disabled:opacity-50 flex items-center gap-1"
                >
                  {chartLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Lọc"}
                </button>
              </div>
            </div>
          </div>

          {/* Chart area — cố định chiều cao */}
          <div className="flex-1" style={{ height: CHART_H }}>
            {chartLoading ? (
              <ChartSkeleton height={CHART_H} />
            ) : chartError ? (
              <ChartError message={chartError} height={CHART_H} />
            ) : barData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Không có dữ liệu trong khoảng thời gian này
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="date"
                    axisLine={false} tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 11 }} dy={8}
                  />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: "#f9fafb" }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,.1)" }}
                  />
                  <Legend
                    verticalAlign="top" align="right" iconType="circle"
                    wrapperStyle={{ paddingBottom: "16px", fontSize: "12px" }}
                  />
                  <Bar dataKey="Đã tạo"   stackId="a" fill="#10b981" barSize={24} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Chưa tạo" stackId="a" fill="#f59e0b" barSize={24} radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie chart (1/3) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <div className="mb-3">
            <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              Tỉ lệ tạo phiên
            </h3>
            <p className="text-[11px] text-gray-400 italic mt-0.5">
              {fromDate} → {toDate}
            </p>
          </div>

          {/* Chart area — cùng CHART_H */}
          <div className="flex-1 flex flex-col justify-between" style={{ height: CHART_H }}>
            {chartLoading ? (
              <ChartSkeleton height={CHART_H - 60} />
            ) : (
              <>
                <div style={{ height: CHART_H - 80 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%" cy="50%"
                        innerRadius="45%" outerRadius="65%"
                        paddingAngle={4}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,.1)" }}
                      />
                      <RechartsLegend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Stats bên dưới biểu đồ tròn */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-[11px] text-gray-500 font-medium mb-1">Đã tạo</p>
                    <p className="text-xl font-extrabold text-emerald-600">{overview.total_created}</p>
                    <p className="text-[10px] text-emerald-500 mt-0.5">
                      {fmtPct(overview.total_created, overview.total_sessions)}
                    </p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-[11px] text-gray-500 font-medium mb-1">Chưa tạo</p>
                    <p className="text-xl font-extrabold text-amber-600">{overview.total_not_created}</p>
                    <p className="text-[10px] text-amber-500 mt-0.5">
                      {fmtPct(overview.total_not_created, overview.total_sessions)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
