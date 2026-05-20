import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  FileSearchIcon,
  FilterX,
  Edit2Icon,
} from "lucide-react";
import Pagination from "../../../components/common/Pagination";
import attendanceService from "../../../services/attendance.service";


const SESSION_STATUS_CFG = {
  active:  { label: "Đang mở",       cls: "bg-emerald-100 text-emerald-700" },
  expired: { label: "Đã kết thúc",   cls: "bg-gray-100 text-gray-600" },
  invalid: { label: "Không hợp lệ",  cls: "bg-red-100 text-red-600" },
};

const LECTURER_STATUS_CFG = {
  on_time:         { label: "Đúng giờ",         cls: "bg-emerald-100 text-emerald-700" },
  late:            { label: "Trễ",               cls: "bg-yellow-100 text-yellow-700" },
  absent:          { label: "Vắng",              cls: "bg-red-100 text-red-700" },
  manual_override: { label: "Điều chỉnh thủ công", cls: "bg-blue-100 text-blue-700" },
};

const SCHEDULE_TYPE_LABEL = { theory: "Lý thuyết", practice: "Thực hành" };
const ATTENDANCE_CREATED_CFG = {
  true: { label: "Ghi nhận giờ dạy", cls: "bg-emerald-100 text-emerald-700" },
  false: { label: "Chưa ghi nhận", cls: "bg-gray-100 text-gray-600" },
};


const fmtTime = (t) => (t ? t.substring(0, 5) : "--");

const fmtDate = (d) => {
  if (!d) return "--";
  const date = new Date(d);
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const parseSemester = (s) => {
  if (!s) return { year: "", sem: "" };
  const [year, sem] = s.split("-");
  return { year: year || "", sem: sem || "" };
};


const EMPTY_FILTERS = {
  course_code:   "",
  course_name:   "",
  academic_year: "",
  sem_num:       "",  // "1" | "2"
  status:        "",
  from_date:     "",
  to_date:       "",
};

const splitSemester = (semStr) => {
  if (!semStr) return { academic_year: "", sem_num: "" };
  const [year, sem] = semStr.split("-");
  return { academic_year: year || "", sem_num: sem || "" };
};

const buildInitialFilters = (courseCode) => {
  if (!courseCode) return EMPTY_FILTERS;
  return {
    ...EMPTY_FILTERS,
    course_code: courseCode,
  };
};

const getScheduleTypeOrder = (scheduleType) => {
  if (scheduleType === "theory") return 0;
  if (scheduleType === "practice") return 1;
  return 2;
};

const getInitials = (name) => {
  if (!name) return "?";
  const words = name.trim().split(" ");
  if (words.length >= 2) return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  return name[0].toUpperCase();
};

const AttendanceLecturerSessionsPage = ({
  lecturerId = null,
  courseCode = "",
  teacher    = null,  // object { full_name, teacher_code, department, email, avatar_url }
  onBack    = null,
  backLabel = null,
}) => {
  const initialFilters = buildInitialFilters(courseCode);

  const [sessions,    setSessions]    = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [pagination,  setPagination]  = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [expanded,    setExpanded]    = useState(false);
  const [filters,     setFilters]     = useState(initialFilters);
  const [tempFilters, setTempFilters] = useState(initialFilters);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Build query params từ filters hiện tại
  const buildParams = useCallback(() => {
    const p = { page: currentPage, limit: 20 };
    if (lecturerId) p.lecturer_id = lecturerId;
    if (courseCode) p.course_code = courseCode;
    return p;
  }, [lecturerId, courseCode, currentPage]);

  // Fetch dữ liệu
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getLecturerAttendanceSessions(buildParams());
      setSessions(Array.isArray(res?.data) ? res.data : []);
      setPagination(res?.meta?.pagination ?? { total: 0, page: 1, limit: 20, totalPages: 0 });
    } catch (err) {
      console.error("Error fetching lecturer attendance sessions:", err);
      setSessions([]);
      toast.error(err?.message || "Không thể tải danh sách phiên điểm danh");
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Filter handlers
  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setTempFilters(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  };

  const orderedSessions = [...sessions].sort((left, right) => {
    // 1. Mã môn học ASC
    const codeLeft  = left?.course_section?.code  || "";
    const codeRight = right?.course_section?.code || "";
    if (codeLeft !== codeRight) return codeLeft.localeCompare(codeRight);

    // 2. Loại buổi: lý thuyết trước, thực hành sau
    const typeLeft  = getScheduleTypeOrder(left?.class_session?.schedule_type);
    const typeRight = getScheduleTypeOrder(right?.class_session?.schedule_type);
    if (typeLeft !== typeRight) return typeLeft - typeRight;

    // 3. Ngày dạy ASC
    const dateLeft  = left?.class_session?.class_date  || "";
    const dateRight = right?.class_session?.class_date || "";
    if (dateLeft !== dateRight) return dateLeft.localeCompare(dateRight);

    // 4. Giờ bắt đầu ASC
    const timeLeft  = left?.class_session?.start_hour  || "";
    const timeRight = right?.class_session?.start_hour || "";
    return timeLeft.localeCompare(timeRight);
  });

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Stripe */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800 mb-4" />

          {/* Breadcrumb */}
          {onBack && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {backLabel || "Quay lại"}
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-800 font-semibold">
                {courseCode ? `Công dạy: ${courseCode}` : "Công dạy"}
              </span>
            </div>
          )}

          {/* ── TEACHER INFO CARD ────────────────────────────────────────── */}
          {teacher && (
            <div className="bg-white border rounded-lg px-5 py-4 mb-4 flex items-center gap-4 shadow-sm">
              {/* Avatar */}
              {teacher.avatar_url ? (
                <img
                  src={teacher.avatar_url}
                  alt={teacher.full_name}
                  className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-blue-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl flex-shrink-0 border-2 border-blue-200">
                  {getInitials(teacher.full_name)}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Dòng 1: Tên + mã */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-gray-800 text-base truncate">
                    {teacher.full_name || "—"}
                  </span>
                  {(teacher.teacher_code || teacher.code) && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                      {teacher.teacher_code || teacher.code}
                    </span>
                  )}
                </div>

                {/* Dòng 2: Khoa/Viện */}
                <div className="text-sm text-gray-600 mt-0.5 flex items-center gap-1.5">
                  <span className="font-medium text-gray-500">Khoa/Viện:</span>
                  <span>{teacher.department || "—"}</span>
                </div>

                {/* Dòng 3: Email */}
                <div className="text-sm text-gray-600 mt-0.5 flex items-center gap-1.5">
                  <span className="font-medium text-gray-500">Email:</span>
                  <span className="truncate">{teacher.email || "—"}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── FILTER PANEL ─────────────────────────────────────────────── */}
          <div className="bg-white border p-6 mb-0">
            {/* Filter header */}
            <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
              </svg>
              <span>Bộ lọc</span>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center text-blue-600 hover:text-blue-800 ml-auto"
              >
                {expanded ? (
                  <><ArrowUp size={16} className="mr-1" />Thu gọn</>
                ) : (
                  <ArrowDown size={16} />
                )}
              </button>
            </div>

            {/* Filter fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã môn học</label>
                <input
                  type="text"
                  name="course_code"
                  value={tempFilters.course_code}
                  onChange={handleTempChange}
                  readOnly={!!courseCode}
                  placeholder="Ví dụ: INT3104"
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${courseCode ? "bg-gray-50 text-gray-500 cursor-not-allowed" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên môn học</label>
                <input
                  type="text"
                  name="course_name"
                  value={tempFilters.course_name}
                  onChange={handleTempChange}
                  placeholder="Tìm theo tên môn học"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Năm học</label>
                <select
                  name="academic_year"
                  value={tempFilters.academic_year}
                  onChange={handleTempChange}
                  className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Tất cả năm học --</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Học kỳ</label>
                <select
                  name="sem_num"
                  value={tempFilters.sem_num}
                  onChange={handleTempChange}
                  className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Tất cả học kỳ --</option>
                  <option value="1">Học kỳ 1</option>
                  <option value="2">Học kỳ 2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái phiên</label>
                <select
                  name="status"
                  value={tempFilters.status}
                  onChange={handleTempChange}
                  className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Tất cả trạng thái --</option>
                  <option value="active">Đang mở</option>
                  <option value="expired">Đã kết thúc</option>
                  <option value="invalid">Không hợp lệ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                <input
                  type="date"
                  name="from_date"
                  value={tempFilters.from_date}
                  onChange={handleTempChange}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                <input
                  type="date"
                  name="to_date"
                  value={tempFilters.to_date}
                  onChange={handleTempChange}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={handleApplyFilters}
                className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-100 focus:outline-none focus:ring-1 focus:ring-blue-400 transition-all"
                title="Tìm kiếm"
              >
                <FileSearchIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all"
                title="Xoá bộ lọc"
              >
                <FilterX className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── TABLE ────────────────────────────────────────────────────── */}
          <div className="w-full overflow-x-auto rounded-b-xl border border-slate-200 bg-white shadow mb-4">
            <table className="w-full table-auto border-collapse text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-slate-100">
                <tr className="border-b">
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Mã MH</th>
                  <th className="h-12 px-4 min-w-[200px] text-xs font-semibold text-slate-600 uppercase">Tên môn học</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Kỳ / Năm</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Ngày dạy</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Giờ học</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Loại buổi</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Ghi nhận chấm công</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">Số nhóm</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Trạng thái buổi học</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-gray-400">
                      Không tìm thấy phiên điểm danh nào
                    </td>
                  </tr>
                ) : (
                  orderedSessions.map((session) => {
                    const cs     = session.class_session  || {};
                    const course = session.course_section || {};
                    const { year, sem } = parseSemester(course.semester);

                    const statusCfg    = SESSION_STATUS_CFG[session.status]  || { label: session.status,               cls: "bg-gray-100 text-gray-600" };
                    const attendanceCreatedCfg = ATTENDANCE_CREATED_CFG[String(Boolean(cs.has_attendance_session))];
                    const groupNumber = cs.number_group ?? null;

                    return (
                      <tr
                        key={session.id}
                        className="border-b hover:bg-slate-50 transition-colors h-12"
                      >
                        {/* Mã MH */}
                        <td className="px-4 py-2 font-semibold text-blue-700">
                          {course.code || "--"}
                        </td>

                        {/* Tên môn học */}
                        <td className="px-4 py-2 max-w-[240px] truncate" title={course.name}>
                          {course.name || "--"}
                        </td>

                        {/* Kỳ / Năm */}
                        <td className="px-4 py-2 text-gray-600">
                          {year && sem ? `HK${sem} / ${year}` : course.semester || "--"}
                        </td>

                        {/* Ngày dạy */}
                        <td className="px-4 py-2">{fmtDate(cs.class_date)}</td>

                        {/* Giờ */}
                        <td className="px-4 py-2 text-gray-600">
                          {fmtTime(cs.start_hour)} – {fmtTime(cs.end_hour)}
                        </td>

                        {/* Loại buổi */}
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              cs.schedule_type === "practice"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-sky-100 text-sky-700"
                            }`}
                          >
                            {SCHEDULE_TYPE_LABEL[cs.schedule_type] || cs.schedule_type || "--"}
                          </span>
                        </td>

                        {/* Ghi nhận chấm công */}
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${attendanceCreatedCfg.cls}`}>
                            {attendanceCreatedCfg.label}
                          </span>
                        </td>

                        {/* Số nhóm */}
                        <td className="px-4 py-2 text-center font-semibold text-gray-700">
                          {groupNumber !== null && groupNumber !== undefined ? groupNumber : "--"}
                        </td>

                        {/* Trạng thái phiên */}
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusCfg.cls}`}>
                            {statusCfg.label}
                          </span>
                        </td>

                        <td>
                          {/* //chỉnh sửa công cho giảng viên */}
                          <button
                            onClick={() => handleManualAdjust(session)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <Edit2Icon className="w-4 h-4 inline-block mr-1" />
                            Điều chỉnh công
                          </button>
                            
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-2 mb-4">
            <span className="text-sm text-gray-500">
              Tổng: <strong>{pagination.total || 0}</strong> phiên điểm danh
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages || 1}
              onPageChange={(page) => setCurrentPage(page)}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLecturerSessionsPage;
