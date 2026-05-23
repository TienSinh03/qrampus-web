import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2, AlertTriangle, Clock, XCircle, FilterX, RefreshCw,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import attendanceService from "@services/attendance.service";
import { DEPARTMENTS } from "@constants/departments";

const STATUS_META = {
  on_time:         { label: "Đúng giờ",        color: "#10b981" },
  late:            { label: "Trễ",             color: "#f59e0b" },
  manual_override: { label: "Điều chỉnh thủ công", color: "#3b82f6" },
  absent:          { label: "Vắng",            color: "#ef4444" },
};

const EMPTY_FILTERS = {
  semester: "",
  department: "",
  teacher_id: "",
  course_section_id: "",
  from_date: "",
  to_date: "",
};

const fmtBucketLabel = (bucket, granularity) => {
  if (!bucket) return "—";
  if (granularity === "month") {
    const [y, m] = bucket.split("-");
    return `T${parseInt(m, 10)}/${y}`;
  }
  // week: 2026-W18
  const [y, w] = bucket.split("-W");
  return `Tuần ${parseInt(w, 10)}/${y}`;
};

export default function AttendanceStatisticsPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);

  const [semesters, setSemesters] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [courses, setCourses] = useState([]);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // ─── Load semesters lần đầu, default chọn semester mới nhất ───
  useEffect(() => {
    attendanceService.getStatsFilterSemesters()
      .then((res) => {
        const list = Array.isArray(res?.data) ? res.data : [];
        setSemesters(list);
        if (list.length > 0) {
          // Backend đã trả về DESC, lấy phần tử đầu
          const latest = list[0];
          setFilters((prev) => ({ ...prev, semester: latest }));
          setAppliedFilters((prev) => ({ ...prev, semester: latest }));
        }
      })
      .catch((err) => toast.error(err?.message || "Không tải được danh sách học kỳ"));
  }, []);

  // ─── Load personnel theo department ───
  useEffect(() => {
    attendanceService.getStatsFilterPersonnel(filters.department || undefined)
      .then((res) => {
        setPersonnel(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setPersonnel([]);
      });
    // Khi đổi khoa, reset teacher + course đã chọn
    setFilters((prev) => ({ ...prev, teacher_id: "", course_section_id: "" }));
  }, [filters.department]);

  // ─── Load courses theo teacher ───
  useEffect(() => {
    if (!filters.teacher_id) {
      setCourses([]);
      setFilters((prev) => ({ ...prev, course_section_id: "" }));
      return;
    }
    attendanceService.getStatsFilterTeacherCourses(filters.teacher_id, filters.semester || undefined)
      .then((res) => {
        setCourses(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setCourses([]);
      });
  }, [filters.teacher_id, filters.semester]);

  // ─── Fetch statistics ───
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getAttendanceStatistics({
        semester: appliedFilters.semester || undefined,
        department: appliedFilters.department || undefined,
        teacher_id: appliedFilters.teacher_id || undefined,
        course_section_id: appliedFilters.course_section_id || undefined,
        from_date: appliedFilters.from_date || undefined,
        to_date: appliedFilters.to_date || undefined,
      });
      setStats(res?.data || null);
    } catch (err) {
      console.error("[AttendanceStatistics] fetch failed", err);
      const msg = err?.details?.message || err?.message || "Không tải được thống kê";
      toast.error(msg);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    if (appliedFilters.semester) fetchStats();
  }, [fetchStats, appliedFilters.semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => setAppliedFilters({ ...filters });
  const resetFilters = () => {
    const reset = { ...EMPTY_FILTERS, semester: semesters[0] || "" };
    setFilters(reset);
    setAppliedFilters(reset);
  };

  const kpi = stats?.kpi || {};
  const buckets = stats?.time_buckets?.data || [];
  const granularity = stats?.time_buckets?.granularity || "week";
  const topList = stats?.top_list || { type: "teacher", data: [] };

  // Donut data
  const donutData = useMemo(() => ([
    { name: STATUS_META.on_time.label,         value: kpi.on_time || 0,         color: STATUS_META.on_time.color },
    { name: STATUS_META.late.label,            value: kpi.late || 0,            color: STATUS_META.late.color },
    { name: STATUS_META.manual_override.label, value: kpi.manual_override || 0, color: STATUS_META.manual_override.color },
    { name: STATUS_META.absent.label,          value: kpi.absent || 0,          color: STATUS_META.absent.color },
  ].filter((d) => d.value > 0)), [kpi]);

  // Stacked bar data
  const stackedData = useMemo(() => (
    buckets.map((b) => ({
      bucket: fmtBucketLabel(b.bucket, granularity),
      "Đúng giờ":             b.on_time,
      "Trễ":                  b.late,
      "Điều chỉnh thủ công":  b.manual_override,
      "Vắng":                 b.absent,
    }))
  ), [buckets, granularity]);

  // Top list horizontal bar data
  const topBarData = useMemo(() => (
    (topList.data || []).map((r) => ({
      name: topList.type === "teacher"
        ? `${r.full_name || r.teacher_code} (${r.teacher_code})`
        : `${r.code} — ${(r.name || "").slice(0, 30)}`,
      "Đúng giờ":             r.on_time,
      "Trễ":                  r.late,
      "Điều chỉnh thủ công":  r.manual_override,
      "Vắng":                 r.absent,
      _id: r.teacher_id || r.course_section_id,
    })).reverse()  // reverse để top 1 nằm trên cùng trong horizontal bar
  ), [topList]);

  const onTopBarClick = (data) => {
    if (!data?._id) return;
    if (topList.type === "teacher") {
      setFilters((prev) => ({ ...prev, teacher_id: data._id, course_section_id: "" }));
      setAppliedFilters((prev) => ({ ...prev, teacher_id: data._id, course_section_id: "" }));
    } else {
      setFilters((prev) => ({ ...prev, course_section_id: data._id }));
      setAppliedFilters((prev) => ({ ...prev, course_section_id: data._id }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto p-4 space-y-4">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800 -mx-4 -mt-4" />

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3 px-1">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Thống kê chấm công giảng viên</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Tổng quan tình hình chấm công theo học kỳ, khoa, giảng viên và học phần.
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1 text-sm border border-blue-300 text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Làm mới
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Học kỳ *</label>
              <select
                name="semester" value={filters.semester} onChange={handleChange}
                className="w-full rounded-lg border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {semesters.length === 0 && <option value="">-- Đang tải --</option>}
                {semesters.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Khoa</label>
              <select
                name="department" value={filters.department} onChange={handleChange}
                className="w-full rounded-lg border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Tất cả --</option>
                {DEPARTMENTS.map((d) => (<option key={d} value={d}>{d}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Giảng viên</label>
              <select
                name="teacher_id" value={filters.teacher_id} onChange={handleChange}
                className="w-full rounded-lg border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Tất cả --</option>
                {personnel.map((p) => (
                  <option key={p.id} value={p.id}>{p.full_name} ({p.teacher_code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Học phần</label>
              <select
                name="course_section_id" value={filters.course_section_id} onChange={handleChange}
                disabled={!filters.teacher_id}
                className="w-full rounded-lg border px-2 py-2 text-sm disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{filters.teacher_id ? "-- Tất cả --" : "Chọn GV trước"}</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Từ ngày</label>
              <input
                type="date" name="from_date" value={filters.from_date} onChange={handleChange}
                className="w-full rounded-lg border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Đến ngày</label>
              <input
                type="date" name="to_date" value={filters.to_date} onChange={handleChange}
                className="w-full rounded-lg border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg"
            >
              <FilterX className="w-4 h-4" /> Đặt lại
            </button>
            <button
              onClick={applyFilters}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium"
            >
              Áp dụng
            </button>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <KpiCard
            icon={CheckCircle2}
            label="Tỷ lệ chấm công"
            value={`${kpi.attendance_rate ?? 0}%`}
            hint={`${kpi.total_sessions ?? 0} tổng buổi`}
            color="emerald"
          />
          <KpiCard
            icon={CheckCircle2}
            label="Đúng giờ"
            value={`${kpi.on_time_rate ?? 0}%`}
            hint={`${kpi.on_time ?? 0} buổi`}
            color="emerald"
          />
          <KpiCard
            icon={Clock}
            label="Trễ giờ"
            value={`${kpi.late_rate ?? 0}%`}
            hint={`${kpi.late ?? 0} buổi · TB trễ ${kpi.avg_late_minutes ?? 0} phút`}
            color="amber"
          />
          <KpiCard
            icon={XCircle}
            label="Vắng"
            value={`${kpi.absent_rate ?? 0}%`}
            hint={`${kpi.absent ?? 0} buổi cần xử lý`}
            color="red"
          />
        </div>

        {/* DONUT + STACKED BAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* DONUT */}
          <div className="bg-white border rounded-lg p-4 lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Cơ cấu trạng thái</h3>
            {donutData.length === 0 ? (
              <EmptyChart message="Không có dữ liệu" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={90}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} buổi`, name]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* STACKED BAR */}
          <div className="bg-white border rounded-lg p-4 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Xu hướng theo {granularity === "month" ? "tháng" : "tuần"}
            </h3>
            {stackedData.length === 0 ? (
              <EmptyChart message="Không có dữ liệu trong khoảng thời gian này" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stackedData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Đúng giờ"            stackId="a" fill={STATUS_META.on_time.color} />
                  <Bar dataKey="Trễ"                 stackId="a" fill={STATUS_META.late.color} />
                  <Bar dataKey="Điều chỉnh thủ công" stackId="a" fill={STATUS_META.manual_override.color} />
                  <Bar dataKey="Vắng"                stackId="a" fill={STATUS_META.absent.color} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* TOP 10 HORIZONTAL BAR */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Top 10 {topList.type === "teacher" ? "giảng viên" : "học phần"} cần lưu ý
            <span className="text-xs text-gray-500 font-normal ml-1">
              (sắp xếp theo số buổi vắng + điều chỉnh thủ công · click để zoom)
            </span>
          </h3>
          {topBarData.length === 0 ? (
            <EmptyChart message="Chưa có dữ liệu" />
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(300, topBarData.length * 35)}>
              <BarChart
                data={topBarData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={220}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Đúng giờ"            stackId="a" fill={STATUS_META.on_time.color} onClick={onTopBarClick} cursor="pointer" />
                <Bar dataKey="Trễ"                 stackId="a" fill={STATUS_META.late.color}    onClick={onTopBarClick} cursor="pointer" />
                <Bar dataKey="Điều chỉnh thủ công" stackId="a" fill={STATUS_META.manual_override.color} onClick={onTopBarClick} cursor="pointer" />
                <Bar dataKey="Vắng"                stackId="a" fill={STATUS_META.absent.color}  onClick={onTopBarClick} cursor="pointer" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

// ────────────── Small components ──────────────

function KpiCard({ icon: Icon, label, value, hint, color = "blue" }) {
  const colorMap = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-emerald-100" },
    amber:   { bg: "bg-amber-50",   text: "text-amber-700",   iconBg: "bg-amber-100"   },
    red:     { bg: "bg-red-50",     text: "text-red-700",     iconBg: "bg-red-100"     },
    blue:    { bg: "bg-blue-50",    text: "text-blue-700",    iconBg: "bg-blue-100"    },
  }[color] || {};

  return (
    <div className={`rounded-lg ${colorMap.bg} p-4 border`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-600">{label}</p>
          <p className={`text-2xl font-bold ${colorMap.text} mt-1`}>{value}</p>
          {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
        </div>
        <div className={`p-2 rounded-lg ${colorMap.iconBg}`}>
          <Icon className={`w-5 h-5 ${colorMap.text}`} />
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="h-64 flex items-center justify-center text-sm text-gray-400 italic">
      {message}
    </div>
  );
}
