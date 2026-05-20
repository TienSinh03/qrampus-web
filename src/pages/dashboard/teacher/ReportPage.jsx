import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, ReferenceLine, Dot,
} from "recharts";
import {
  User, Mail, Building2, CheckCircle, Clock, XCircle, TrendingUp,
  CalendarDays, ChevronDown,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, parseISO, startOfWeek } from "date-fns";
import { useAttendance } from "@contexts/AttendanceContext";
import attendanceService from "@services/attendance.service";

const _now = new Date();
const FIRST_OF_MONTH = format(startOfMonth(_now), "yyyy-MM-dd");
const LAST_OF_MONTH = format(endOfMonth(_now), "yyyy-MM-dd");

const PALETTE = {
  onTime: "#22c55e",
  late: "#f59e0b",
  absent: "#ef4444",
  theory: "#3b82f6",
  practice: "#8b5cf6",
  created: "#3b82f6",
  missedNotCreated: "#fca5a5",
  scheduledNotCreated: "#cbd5e1",
  trend: "#0ea5e9",
};

const COURSE_BAR_LABELS = { onTime: "Đúng giờ", late: "Trễ", absent: "Vắng" };
const COURSE_BAR_COLORS = { onTime: PALETTE.onTime, late: PALETTE.late, absent: PALETTE.absent };

function getCourseUid(c) {
  return c.practiceGroupId ? `${c.courseSectionId}_practice_${c.practiceGroupId}` : `${c.courseSectionId}_theory`;
}

function getCourseLabel(c) {
  const base = c.courseName || c.courseCode || String(c.courseSectionId);
  if (!c.practiceGroupId) return base;
  return c.practiceGroupNumber ? `${base} - Nhóm TH${c.practiceGroupNumber}` : `${base} (TH)`;
}

function rateColor(rate) {
  if (rate >= 80) return { bar: "bg-green-500", text: "text-green-600" };
  if (rate >= 50) return { bar: "bg-amber-400", text: "text-amber-600" };
  return { bar: "bg-red-400", text: "text-red-500" };
}

function SummaryCard({ icon: Icon, title, value, iconClass, bgClass }) {
  return (
    <div className={`${bgClass} rounded-xl p-5 flex items-center gap-4 shadow-sm`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-white/60 ${iconClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-800 leading-tight">{value ?? "--"}</p>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, loading, empty, minH = "h-64", children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {loading ? (
        <div className={`${minH} flex items-center justify-center text-gray-400 text-sm`}>Đang tải...</div>
      ) : empty ? (
        <div className={`${minH} flex items-center justify-center text-gray-400 text-sm`}>Không có dữ liệu</div>
      ) : children}
    </div>
  );
}

function MiniDonut({ items, total, title }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-gray-500 font-medium mb-1 text-center">{title}</p>
      <div className="relative">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie
              data={items}
              cx="50%"
              cy="50%"
              innerRadius={46}
              outerRadius={68}
              paddingAngle={3}
              dataKey="value"
              isAnimationActive={false}
            >
              {items.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
            <Tooltip
              formatter={(val, name) => {
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return [`${val} (${pct}%)`, name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold text-slate-800">{total}</span>
          <span className="text-[10px] text-slate-400">buổi</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
        {items.map((d) => (
          <div key={d.name} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
            <span className="text-[11px] text-gray-500">{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const courseBarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload ?? {};
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 text-xs border border-gray-100 space-y-1 max-w-[240px]">
      <p className="font-semibold text-gray-700 mb-1 break-words">{d.fullName || d.name}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: COURSE_BAR_COLORS[p.dataKey] || p.fill }}>
          {COURSE_BAR_LABELS[p.dataKey] || p.name}:{" "}
          <span className="font-bold">{p.value}</span> buổi
        </p>
      ))}
    </div>
  );
};

const stackedBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 text-xs border border-gray-100 space-y-1">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.fill }}>{p.name}: {p.value} buổi</p>
      ))}
    </div>
  );
};

const lineTrendTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white shadow-lg rounded-lg p-3 text-xs border border-gray-100">
      <p className="font-semibold text-gray-700 mb-1">Tuần {label}</p>
      <p className="text-sky-600">
        Tỉ lệ ĐD: <span className="font-bold">{payload[0].value}%</span>
      </p>
    </div>
  );
};

export default function ReportPage() {
  const { fetchTeacherAttendanceDashboard } = useAttendance();
  const hasInitSemester = useRef(false);
  const courseDropdownRef = useRef(null);

  // ── filter state ──
  const [semester, setSemester] = useState("");
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [fromDate, setFromDate] = useState(FIRST_OF_MONTH);
  const [toDate, setToDate] = useState(LAST_OF_MONTH);

  // ── data state ──
  const [dashboardData, setDashboardData] = useState({
    teacher: null,
    summary: {},
    availableSemesters: [],
    courseProgress: [],
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const [workloadData, setWorkloadData] = useState(null);
  const [workloadLoading, setWorkloadLoading] = useState(false);

  // Close course dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(e.target)) {
        setCourseDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reload dashboard whenever semester changes (auto-init pattern same as Timekeeping)
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setDashboardLoading(true);
      try {
        const params = semester ? { semester } : {};
        const res = await fetchTeacherAttendanceDashboard(params);
        if (!isMounted) return;
        if (res?.success && res?.data) {
          const payload = res.data;
          const availableSemesters = Array.isArray(payload.availableSemesters) ? payload.availableSemesters : [];
          setDashboardData({
            teacher: payload.teacher || null,
            summary: payload.summary || {},
            availableSemesters,
            courseProgress: Array.isArray(payload.courseProgress) ? payload.courseProgress : [],
          });
          setSelectedCourseIds([]); // reset course filter when semester data reloads
          if (!hasInitSemester.current && !semester && availableSemesters.length > 0) {
            hasInitSemester.current = true;
            setSemester(availableSemesters[0]); // triggers second fetch with specific semester
          } else if (!hasInitSemester.current) {
            hasInitSemester.current = true;
          }
        }
      } catch {
        // silently fail; data stays as previous
      } finally {
        if (isMounted) setDashboardLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [semester, fetchTeacherAttendanceDashboard]);

  // Workload fetch (by date range, independent of semester)
  const fetchWorkload = useCallback(async (from, to) => {
    setWorkloadLoading(true);
    try {
      const res = await attendanceService.getTeacherAttendanceWorkload(from, to);
      setWorkloadData(res?.data ?? res);
    } catch {
      setWorkloadData(null);
    } finally {
      setWorkloadLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkload(FIRST_OF_MONTH, LAST_OF_MONTH);
  }, [fetchWorkload]);

  const handleFromChange = (e) => {
    const val = e.target.value;
    setFromDate(val);
    fetchWorkload(val, toDate);
  };
  const handleToChange = (e) => {
    const val = e.target.value;
    setToDate(val);
    fetchWorkload(fromDate, val);
  };

  // Unique courses available for the current semester (theory and practice as separate entries)
  const uniqueCourses = useMemo(() => {
    const map = new Map();
    for (const c of dashboardData.courseProgress) {
      const uid = getCourseUid(c);
      if (!map.has(uid)) {
        map.set(uid, { id: uid, name: getCourseLabel(c), code: c.courseCode });
      }
    }
    return Array.from(map.values());
  }, [dashboardData.courseProgress]);

  const toggleCourse = (id) =>
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Filtered course progress (client-side, no extra API call)
  const filteredCourseProgress = useMemo(() => {
    const all = dashboardData.courseProgress || [];
    if (selectedCourseIds.length === 0) return all;
    return all.filter((c) => selectedCourseIds.includes(getCourseUid(c)));
  }, [dashboardData.courseProgress, selectedCourseIds]);

  // Summary derived from filtered courses
  const filteredSummary = useMemo(() => {
    if (selectedCourseIds.length === 0) return dashboardData.summary || {};
    return filteredCourseProgress.reduce(
      (acc, c) => ({
        totalTeachingSessions: acc.totalTeachingSessions + (c.totalTeachingSessions || 0),
        onTimeCheckins: acc.onTimeCheckins + (c.onTimeCheckins || 0),
        lateCheckins: acc.lateCheckins + (c.lateCheckins || 0),
        absentCheckins: acc.absentCheckins + (c.absentCheckins || 0),
      }),
      { totalTeachingSessions: 0, onTimeCheckins: 0, lateCheckins: 0, absentCheckins: 0 }
    );
  }, [filteredCourseProgress, selectedCourseIds, dashboardData.summary]);

  const filteredAttendanceRate = useMemo(() => {
    if (selectedCourseIds.length === 0) return dashboardData.summary?.attendanceRate ?? null;
    const total = filteredSummary.totalTeachingSessions || 0;
    const success = (filteredSummary.onTimeCheckins || 0) + (filteredSummary.lateCheckins || 0);
    return total > 0 ? Math.round((success / total) * 100) : 0;
  }, [filteredSummary, selectedCourseIds, dashboardData.summary]);

  // Attendance distribution donut (from filtered courseProgress)
  const attendanceDonut = useMemo(() => {
    const items = [
      { name: "Đúng giờ", value: filteredSummary.onTimeCheckins ?? 0, color: PALETTE.onTime },
      { name: "Trễ", value: filteredSummary.lateCheckins ?? 0, color: PALETTE.late },
      { name: "Vắng", value: filteredSummary.absentCheckins ?? 0, color: PALETTE.absent },
    ];
    return { items, total: items.reduce((s, d) => s + d.value, 0) };
  }, [filteredSummary]);

  // Theory vs Practice donut (from filtered courseProgress, not workload)
  const scheduleTypeDonut = useMemo(() => {
    let theory = 0;
    let practice = 0;
    for (const c of filteredCourseProgress) {
      const sessions = c.totalTeachingSessions || 0;
      if (c.practiceGroupId) practice += sessions;
      else theory += sessions;
    }
    const items = [
      { name: "Lý thuyết", value: theory, color: PALETTE.theory },
      { name: "Thực hành", value: practice, color: PALETTE.practice },
    ];
    return { items, total: theory + practice };
  }, [filteredCourseProgress]);

  // Course progress bars (grouped by composite uid — phân biệt LT và TH)
  const courseProgressBars = useMemo(() => {
    const map = new Map();
    for (const item of filteredCourseProgress) {
      const uid = getCourseUid(item);
      if (!map.has(uid)) {
        map.set(uid, { name: getCourseLabel(item), onTime: 0, late: 0, total: 0 });
      }
      const g = map.get(uid);
      g.onTime += item.onTimeCheckins ?? 0;
      g.late += item.lateCheckins ?? 0;
      g.total += item.totalTeachingSessions ?? 0;
    }
    return Array.from(map.values())
      .map((g) => ({
        name: g.name,
        rate: g.total > 0 ? Math.round(((g.onTime + g.late) / g.total) * 100) : 0,
        done: g.onTime + g.late,
        total: g.total,
      }))
      .sort((a, b) => a.rate - b.rate);
  }, [filteredCourseProgress]);

  // Course comparison grouped bar chart (onTime / late / absent per course, phân biệt LT/TH)
  const courseComparisonData = useMemo(() => {
    const map = new Map();
    for (const c of filteredCourseProgress) {
      const uid = getCourseUid(c);
      const fullName = getCourseLabel(c);
      if (!map.has(uid)) {
        map.set(uid, {
          fullName,
          name: fullName.length > 22 ? fullName.slice(0, 22) + "…" : fullName,
          onTime: 0,
          late: 0,
          absent: 0,
        });
      }
      const g = map.get(uid);
      g.onTime += c.onTimeCheckins || 0;
      g.late += c.lateCheckins || 0;
      g.absent += c.absentCheckins || 0;
    }
    return Array.from(map.values());
  }, [filteredCourseProgress]);

  // Weekly trend line (from workload — date-range filtered)
  const weekLineData = useMemo(() => {
    const map = new Map();
    for (const d of workloadData?.data ?? []) {
      let dateObj;
      try { dateObj = parseISO(d.date); } catch { dateObj = new Date(d.date); }
      const ws = startOfWeek(dateObj, { weekStartsOn: 1 });
      const key = format(ws, "yyyy-MM-dd");
      const label = format(ws, "dd/MM");
      if (!map.has(key)) map.set(key, { key, label, created: 0, total: 0 });
      const g = map.get(key);
      g.created += d.created ?? 0;
      g.total += (d.created ?? 0) + (d.not_created ?? 0);
    }
    return Array.from(map.values())
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((g) => ({
        week: g.label,
        rate: g.total > 0 ? Math.round((g.created / g.total) * 100) : 0,
      }));
  }, [workloadData]);

  // Stacked daily bar (from workload — date-range filtered)
  const stackedData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (workloadData?.data ?? []).map((d) => {
      let dateObj;
      try { dateObj = parseISO(d.date); } catch { dateObj = new Date(d.date); }
      const isPast = dateObj < today;
      const notCreated = d.not_created ?? 0;
      return {
        date: format(dateObj, "dd/MM"),
        created: d.created ?? 0,
        notCreatedMissed: isPast ? notCreated : 0,
        notCreatedScheduled: isPast ? 0 : notCreated,
      };
    });
  }, [workloadData]);

  const teacher = dashboardData.teacher ?? {};
  const bothDonutsEmpty = attendanceDonut.total === 0 && scheduleTypeDonut.total === 0;

  const courseFilterLabel = selectedCourseIds.length === 0 ? "Tất cả môn học"
      : selectedCourseIds.length === 1 ? (uniqueCourses.find((c) => c.id === selectedCourseIds[0])?.name ?? "1 môn") : `${selectedCourseIds.length} môn đã chọn`;

  return (
    <div className="min-h-screen bg-gray-50 space-y-5">

      {/* Teacher info */}
      {(teacher.fullName || teacher.department || teacher.email) && (
        <div className="bg-white shadow-sm border border-gray-100 px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {teacher.fullName && (
              <span className="font-semibold text-gray-800">{teacher.fullName}</span>
            )}
            {teacher.department && (
              <span className="text-gray-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> {teacher.department}
              </span>
            )}
            {teacher.email && (
              <span className="text-gray-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> {teacher.email}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="bg-white shadow-sm border border-gray-100 px-6 py-4">
        <div className="flex flex-wrap items-end gap-5">

          {/* Semester */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Học kỳ</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              disabled={dashboardLoading}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[180px] disabled:opacity-60"
            >
              <option value="">-- Tất cả --</option>
              {dashboardData.availableSemesters.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Course multi-select */}
          <div className="flex flex-col gap-1" ref={courseDropdownRef}>
            <label className="text-xs font-medium text-gray-500">Môn học</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCourseDropdownOpen((o) => !o)}
                disabled={uniqueCourses.length === 0 || dashboardLoading}
                className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-[230px] disabled:opacity-60"
              >
                <span className="flex-1 text-left truncate text-gray-700">{courseFilterLabel}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${courseDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {courseDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 min-w-[270px] max-h-72 flex flex-col">
                  {/* "All" option */}
                  <div className="p-2 border-b border-gray-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => setSelectedCourseIds([])}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
                        selectedCourseIds.length === 0
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      Tất cả môn học
                    </button>
                  </div>

                  {/* Course list */}
                  <div className="overflow-y-auto flex-1 p-2 space-y-0.5">
                    {uniqueCourses.map((c) => (
                      <label
                        key={c.id}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition text-sm ${
                          selectedCourseIds.includes(c.id)
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCourseIds.includes(c.id)}
                          onChange={() => toggleCourse(c.id)}
                          className="w-3.5 h-3.5 accent-blue-600 shrink-0"
                        />
                        <span className="truncate" title={c.name}>{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Date range (for workload charts) */}
          <div className="flex items-end gap-3 ml-auto">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Từ ngày <span className="text-gray-400 font-normal">(biểu đồ theo ngày/tuần)</span>
              </label>
              <input
                type="date"
                value={fromDate}
                max={toDate}
                onChange={handleFromChange}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Đến ngày</label>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                onChange={handleToChange}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>

        {/* Active course filter chips */}
        {selectedCourseIds.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {selectedCourseIds.map((id) => {
              const c = uniqueCourses.find((x) => x.id === id);
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
                >
                  {c?.name ?? id}
                  <button
                    type="button"
                    onClick={() => toggleCourse(id)}
                    className="hover:text-blue-900 leading-none"
                  >
                    ×
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              onClick={() => setSelectedCourseIds([])}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <SummaryCard
          icon={CalendarDays} title="Tổng buổi dạy"
          value={filteredSummary.totalTeachingSessions}
          iconClass="text-blue-600" bgClass="bg-blue-50"
        />
        <SummaryCard
          icon={CheckCircle} title="Đúng giờ"
          value={filteredSummary.onTimeCheckins}
          iconClass="text-green-600" bgClass="bg-green-50"
        />
        <SummaryCard
          icon={Clock} title="Trễ"
          value={filteredSummary.lateCheckins}
          iconClass="text-amber-600" bgClass="bg-amber-50"
        />
        <SummaryCard
          icon={XCircle} title="Vắng"
          value={filteredSummary.absentCheckins}
          iconClass="text-red-600" bgClass="bg-red-50"
        />
        <SummaryCard
          icon={TrendingUp} title="Tỉ lệ điểm danh"
          value={filteredAttendanceRate != null ? `${filteredAttendanceRate}%` : undefined}
          iconClass="text-purple-600" bgClass="bg-purple-50 col-span-2 sm:col-span-1"
        />
      </div>

      {/* Row 1: double donut | course progress bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <ChartCard
          title="Phân bố buổi dạy"
          subtitle="Trái: đúng giờ / trễ / vắng — Phải: lý thuyết / thực hành"
          loading={dashboardLoading}
          empty={!dashboardLoading && bothDonutsEmpty}
          minH="h-56"
        >
          <div className="flex justify-around items-start pt-2 flex-wrap gap-4">
            <MiniDonut
              items={attendanceDonut.items}
              total={attendanceDonut.total}
              title="Đúng giờ / Trễ / Vắng"
            />
            <MiniDonut
              items={scheduleTypeDonut.items}
              total={scheduleTypeDonut.total}
              title="Lý thuyết / Thực hành"
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Tiến độ điểm danh theo môn"
          subtitle="Xanh ≥ 80% · Vàng 50–79% · Đỏ < 50%"
          loading={dashboardLoading}
          empty={!dashboardLoading && courseProgressBars.length === 0}
          minH="h-56"
        >
          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-1">
            {courseProgressBars.map((c) => {
              const { bar, text } = rateColor(c.rate);
              return (
                <div key={c.name}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-gray-700 truncate max-w-[68%]" title={c.name}>
                      {c.name}
                    </span>
                    <span className={`text-xs font-bold ${text} ml-2 shrink-0`}>
                      {c.rate}% ({c.done}/{c.total})
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${bar} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${c.rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Course comparison grouped bar chart */}
      <ChartCard
        title="So sánh điểm danh theo môn học"
        subtitle={
          selectedCourseIds.length > 0
            ? `${selectedCourseIds.length} môn được chọn · số buổi đúng giờ / trễ / vắng`
            : "Tất cả môn học · số buổi đúng giờ / trễ / vắng — chọn môn học để lọc"
        }
        loading={dashboardLoading}
        empty={!dashboardLoading && courseComparisonData.length === 0}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={courseComparisonData}
            margin={{ top: 4, right: 16, left: 0, bottom: 48 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={64}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip content={courseBarTooltip} />
            <Legend
              iconType="square"
              iconSize={10}
              formatter={(v) => (
                <span className="text-xs text-gray-600">{COURSE_BAR_LABELS[v] ?? v}</span>
              )}
            />
            <Bar dataKey="onTime" name="onTime" fill={PALETTE.onTime} radius={[3, 3, 0, 0]} />
            <Bar dataKey="late" name="late" fill={PALETTE.late} radius={[3, 3, 0, 0]} />
            <Bar dataKey="absent" name="absent" fill={PALETTE.absent} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Row 3: weekly trend line + stacked daily bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <ChartCard
          title="Xu hướng điểm danh theo tuần"
          subtitle={`${fromDate} → ${toDate} · tỉ lệ buổi đã tạo ĐD / tổng buổi — đường tham chiếu 80%`}
          loading={workloadLoading}
          empty={!workloadLoading && weekLineData.length < 2}
          minH="h-56"
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={weekLineData} margin={{ top: 8, right: 24, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <ReferenceLine
                y={80}
                stroke="#22c55e"
                strokeDasharray="5 3"
                label={{ value: "80%", position: "right", fontSize: 10, fill: "#22c55e" }}
              />
              <Tooltip content={lineTrendTooltip} />
              <Line
                type="monotone"
                dataKey="rate"
                name="Tỉ lệ ĐD"
                stroke={PALETTE.trend}
                strokeWidth={2.5}
                dot={<Dot r={4} fill={PALETTE.trend} stroke="#fff" strokeWidth={2} />}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Phân bố buổi dạy theo ngày"
          subtitle={`${fromDate} → ${toDate}`}
          loading={workloadLoading}
          empty={!workloadLoading && stackedData.length === 0}
          minH="h-56"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stackedData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip content={stackedBarTooltip} />
              <Legend
                iconType="square"
                iconSize={10}
                formatter={(v) => {
                  const labels = {
                    created: "Đã điểm danh",
                    notCreatedMissed: "Chưa ĐD (đã qua)",
                    notCreatedScheduled: "Chưa ĐD (sắp tới)",
                  };
                  return <span className="text-xs text-gray-600">{labels[v] ?? v}</span>;
                }}
              />
              <Bar dataKey="created" name="created" stackId="a" fill={PALETTE.created} />
              <Bar dataKey="notCreatedMissed" name="notCreatedMissed" stackId="a" fill={PALETTE.missedNotCreated} />
              <Bar dataKey="notCreatedScheduled" name="notCreatedScheduled" stackId="a" fill={PALETTE.scheduledNotCreated} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

    </div>
  );
}
