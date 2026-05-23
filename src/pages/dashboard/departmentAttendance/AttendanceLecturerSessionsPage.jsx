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
  X,
  Paperclip,
  History,
  Trash2,
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

// 3 trạng thái cột "Ghi nhận chấm công":
//   recorded    — có phiên điểm danh thật
//   adjusted    — không có phiên, nhưng staff đã override thủ công
//   not_recorded — chưa có gì
const ATTENDANCE_RECORD_CFG = {
  recorded:     { label: "Ghi nhận giờ dạy",       cls: "bg-emerald-100 text-emerald-700" },
  adjusted:     { label: "Đã ghi nhận (thủ công)", cls: "bg-blue-100 text-blue-700" },
  not_recorded: { label: "Chưa ghi nhận",          cls: "bg-gray-100 text-gray-600" },
};

const ATTENDANCE_MARK_SOURCE = {
  AUTO: "AUTO",
  MANUAL: "MANUAL",
  ADMIN_OVERRIDE: "ADMIN_OVERRIDE",
};

const LECTURER_STATUS = {
  ON_TIME: "on_time",
  LATE: "late",
  ABSENT: "absent",
  MANUAL_OVERRIDE: "manual_override",
};

// Tính trạng thái cột "Ghi nhận chấm công" từ class_session shape của BE
const getAttendanceRecordStatus = (cs) => {
  if (cs?.has_attendance_session) return "recorded";
  if (cs?.attendance_mark_source === ATTENDANCE_MARK_SOURCE.ADMIN_OVERRIDE) return "adjusted";
  return "not_recorded";
};

// Chỉ cho phép điều chỉnh khi: chưa có phiên ĐD VÀ (đang vắng hoặc chưa có trạng thái)
const canManuallyAdjust = (cs) => {
  if (!cs) return false;
  if (cs.has_attendance_session) return false;
  const s = cs.lecturer_attendance_status;
  return s == null || s === LECTURER_STATUS.ABSENT;
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

// Chỉ cho phép 2 trạng thái khi điều chỉnh: vẫn giữ Vắng (revert), hoặc Điều chỉnh thủ công (override)
const ADJUST_STATUS_OPTIONS = [
  { value: LECTURER_STATUS.MANUAL_OVERRIDE, label: "Điều chỉnh thủ công (ghi nhận có dạy)" },
  { value: LECTURER_STATUS.ABSENT,          label: "Vắng" },
];

const MAX_EVIDENCE_FILES = 5;
const MAX_EVIDENCE_SIZE_MB = 10;

const fmtDateTime = (d) => {
  if (!d) return "--";
  const date = new Date(d);
  return date.toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// BE đã resolve sang full URL bằng resolvePublicUrl, FE chỉ cần dùng nguyên
const buildEvidenceUrl = (url) => url || "#";

const AdjustModal = ({ session, onClose, onSubmit, submitting }) => {
  const cs     = session?.class_session  || {};
  const course = session?.course_section || {};

  const [status,      setStatus]      = useState(LECTURER_STATUS.MANUAL_OVERRIDE);
  const [checkinTime, setCheckinTime] = useState(cs.start_hour?.slice(0, 5) || "");
  const [reason,      setReason]      = useState("");
  const [files,       setFiles]       = useState([]);
  const [history,     setHistory]     = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const showCheckin = status === LECTURER_STATUS.MANUAL_OVERRIDE;

  // Load history khi mở modal — bắt đầu với loading=true để không phải setState đồng bộ trong effect
  useEffect(() => {
    const csId = cs.id;
    if (!csId) return;
    let cancelled = false;
    attendanceService.getAdjustmentHistory(csId)
      .then((res) => {
        if (cancelled) return;
        setHistory(Array.isArray(res?.data) ? res.data : []);
      })
      .catch(() => { if (!cancelled) setHistory([]); })
      .finally(() => { if (!cancelled) setLoadingHistory(false); });
    return () => { cancelled = true; };
  }, [cs.id]);

  const handleFilesChange = (e) => {
    const picked = Array.from(e.target.files || []);
    const accepted = [];
    for (const f of picked) {
      if (!f.type.startsWith("image/")) {
        toast.error(`File "${f.name}" không phải ảnh`);
        continue;
      }
      if (f.size > MAX_EVIDENCE_SIZE_MB * 1024 * 1024) {
        toast.error(`File "${f.name}" vượt quá ${MAX_EVIDENCE_SIZE_MB}MB`);
        continue;
      }
      accepted.push(f);
    }
    const combined = [...files, ...accepted].slice(0, MAX_EVIDENCE_FILES);
    if (files.length + accepted.length > MAX_EVIDENCE_FILES) {
      toast.warning(`Tối đa ${MAX_EVIDENCE_FILES} ảnh minh chứng`);
    }
    setFiles(combined);
    e.target.value = ""; // reset input để có thể chọn lại cùng file
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do điều chỉnh");
      return;
    }

    let lecturer_checkin_at = null;
    if (showCheckin && checkinTime) {
      lecturer_checkin_at = `${cs.class_date}T${checkinTime}:00`;
    }

    onSubmit({
      lecturer_attendance_status: status,
      lecturer_checkin_at,
      late_minutes: 0,
      reason: reason.trim(),
      evidence: files,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-gray-800">Điều chỉnh công giảng viên</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Session info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-5 text-sm text-gray-600 space-y-1">
            <div><span className="font-medium text-gray-700">Môn học:</span> {course.name || "--"}</div>
            <div><span className="font-medium text-gray-700">Ngày dạy:</span> {fmtDate(cs.class_date)}</div>
            <div>
              <span className="font-medium text-gray-700">Giờ học:</span>{" "}
              {fmtTime(cs.start_hour)} – {fmtTime(cs.end_hour)}
            </div>
            {cs.lecturer_attendance_status && (
              <div>
                <span className="font-medium text-gray-700">Trạng thái hiện tại:</span>{" "}
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${LECTURER_STATUS_CFG[cs.lecturer_attendance_status]?.cls || "bg-gray-100 text-gray-600"}`}>
                  {LECTURER_STATUS_CFG[cs.lecturer_attendance_status]?.label || cs.lecturer_attendance_status}
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái mới <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              >
                {ADJUST_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Chọn "Điều chỉnh thủ công" nếu xác minh giảng viên đã dạy nhưng không có phiên điểm danh.
              </p>
            </div>

            {showCheckin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giờ ghi nhận có mặt</label>
                <input
                  type="time"
                  value={checkinTime}
                  onChange={(e) => setCheckinTime(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do điều chỉnh <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Vd: Giảng viên có dạy nhưng quên tạo phiên điểm danh, đã xác minh qua danh sách sinh viên ký tay..."
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                required
              />
            </div>

            {/* Evidence upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh minh chứng <span className="text-gray-400 text-xs font-normal">(tối đa {MAX_EVIDENCE_FILES} ảnh, mỗi ảnh ≤ {MAX_EVIDENCE_SIZE_MB}MB)</span>
              </label>
              <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 cursor-pointer text-sm">
                <Paperclip className="w-4 h-4" />
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesChange}
                  className="hidden"
                />
              </label>
              {files.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {files.map((f, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 text-sm bg-gray-50 px-2 py-1 rounded">
                      <span className="truncate flex-1">{f.name}</span>
                      <span className="text-xs text-gray-400">{(f.size / 1024 / 1024).toFixed(2)}MB</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm disabled:opacity-60"
              >
                {submitting ? "Đang lưu..." : "Lưu điều chỉnh"}
              </button>
            </div>
          </form>

          {/* History */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <History className="w-4 h-4" />
              Lịch sử điều chỉnh ({history.length})
            </div>
            {loadingHistory ? (
              <div className="text-xs text-gray-400">Đang tải...</div>
            ) : history.length === 0 ? (
              <div className="text-xs text-gray-400">Chưa có lần điều chỉnh nào.</div>
            ) : (
              <ul className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="border rounded-lg p-3 bg-gray-50 text-sm">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-medium text-gray-700">
                        {h.adjusted_by?.full_name || h.adjusted_by?.user_name || "—"}
                      </span>
                      <span className="text-xs text-gray-500">{fmtDateTime(h.adjusted_at)}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className={`inline-block px-1.5 py-0.5 rounded ${LECTURER_STATUS_CFG[h.old?.lecturer_attendance_status]?.cls || "bg-gray-100"}`}>
                        {LECTURER_STATUS_CFG[h.old?.lecturer_attendance_status]?.label || h.old?.lecturer_attendance_status || "—"}
                      </span>
                      {" → "}
                      <span className={`inline-block px-1.5 py-0.5 rounded ${LECTURER_STATUS_CFG[h.new?.lecturer_attendance_status]?.cls || "bg-gray-100"}`}>
                        {LECTURER_STATUS_CFG[h.new?.lecturer_attendance_status]?.label || h.new?.lecturer_attendance_status || "—"}
                      </span>
                    </div>
                    {h.reason && (
                      <div className="mt-1 text-xs text-gray-600 italic">"{h.reason}"</div>
                    )}
                    {Array.isArray(h.evidence) && h.evidence.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {h.evidence.map((ev, i) => (
                          <a
                            key={i}
                            href={buildEvidenceUrl(ev.url)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline bg-white px-2 py-0.5 rounded border"
                          >
                            <Paperclip className="w-3 h-3" />
                            {ev.originalname || `minh-chung-${i + 1}`}
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceLecturerSessionsPage = ({
  lecturerId = null,
  courseCode = "",
  teacher    = null,  // object { full_name, teacher_code, department, email, avatar_url }
  onBack    = null,
  backLabel = null,
}) => {
  const initialFilters = buildInitialFilters(courseCode);

  const [sessions,      setSessions]      = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [pagination,    setPagination]    = useState({ total: 0, page: 1, limit: 20, totalPages: 0 });
  const [currentPage,   setCurrentPage]   = useState(1);
  const [expanded,      setExpanded]      = useState(false);
  const [filters,       setFilters]       = useState(initialFilters);
  const [tempFilters,   setTempFilters]   = useState(initialFilters);
  const [adjustTarget,  setAdjustTarget]  = useState(null);
  const [submitting,    setSubmitting]    = useState(false);

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

  const handleManualAdjust = (session) => setAdjustTarget(session);

  const handleSubmitAdjust = async (payload) => {
    const classSessionId = adjustTarget?.class_session?.id || adjustTarget?.id;
    if (!classSessionId) return;
    try {
      setSubmitting(true);
      await attendanceService.manualAdjustLecturerAttendance(classSessionId, payload);
      toast.success("Điều chỉnh công giảng viên thành công");
      setAdjustTarget(null);
      fetchSessions();
    } catch (err) {
      toast.error(err?.message || "Có lỗi xảy ra khi điều chỉnh công");
    } finally {
      setSubmitting(false);
    }
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
    <>
    {adjustTarget && (
      <AdjustModal
        session={adjustTarget}
        onClose={() => setAdjustTarget(null)}
        onSubmit={handleSubmitAdjust}
        submitting={submitting}
      />
    )}
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
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Trạng thái GV</th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-gray-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-gray-400">
                      Không tìm thấy phiên điểm danh nào
                    </td>
                  </tr>
                ) : (
                  orderedSessions.map((session) => {
                    const cs     = session.class_session  || {};
                    const course = session.course_section || {};
                    const { year, sem } = parseSemester(course.semester);

                    const statusCfg          = SESSION_STATUS_CFG[session.status] || { label: session.status, cls: "bg-gray-100 text-gray-600" };
                    const lecturerStatusCfg  = cs.lecturer_attendance_status
                      ? (LECTURER_STATUS_CFG[cs.lecturer_attendance_status] || { label: cs.lecturer_attendance_status, cls: "bg-gray-100 text-gray-600" })
                      : null;
                    const attendanceRecordCfg = ATTENDANCE_RECORD_CFG[getAttendanceRecordStatus(cs)];
                    const canAdjust = canManuallyAdjust(cs);
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
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${attendanceRecordCfg.cls}`}>
                            {attendanceRecordCfg.label}
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

                        {/* Trạng thái GV */}
                        <td className="px-4 py-2">
                          {lecturerStatusCfg ? (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${lecturerStatusCfg.cls}`}>
                              {lecturerStatusCfg.label}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">--</span>
                          )}
                        </td>

                        {/* Hành động */}
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleManualAdjust(session)}
                            disabled={!canAdjust}
                            title={
                              canAdjust
                                ? "Điều chỉnh trạng thái chấm công"
                                : "Chỉ điều chỉnh được khi chưa có phiên điểm danh và GV đang ở trạng thái vắng"
                            }
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:text-gray-300"
                          >
                            <Edit2Icon className="w-4 h-4" />
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
    </>
  );
};

export default AttendanceLecturerSessionsPage;
