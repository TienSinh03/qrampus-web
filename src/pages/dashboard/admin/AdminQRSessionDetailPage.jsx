import React, { useCallback, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  Gauge,
  GraduationCap,
  Hourglass,
  RefreshCw,
  User,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAttendance } from "@contexts/AttendanceContext";

const DETAIL_STORAGE_KEY = "attendanceSessionDetail";

const readSessionDetail = () => {
  try {
    const raw = sessionStorage.getItem(DETAIL_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading attendanceSessionDetail:", error);
    return null;
  }
};

const toSafeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatDateTime = (value) => {
  if (!value) return "--/--/---- --:--:--";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--/--/---- --:--:--";

  return parsed.toLocaleString("vi-VN", { hour12: false });
};

const formatDate = (value) => {
  if (!value) return "--/--/----";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "--/--/----";

  return parsed.toLocaleDateString("vi-VN");
};

const formatTime = (value) => {
  if (!value || typeof value !== "string") return "--:--";
  return value.slice(0, 5);
};

const getSessionStatusMeta = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "active") {
    return {
      label: "Đang hoạt động",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  }

  if (normalized === "ended" || normalized === "closed") {
    return {
      label: "Đã kết thúc",
      className: "bg-slate-100 text-slate-700 border-slate-200",
    };
  }

  if (normalized === "expired") {
    return {
      label: "Đã hết hạn",
      className: "bg-amber-100 text-amber-700 border-amber-200",
    };
  }

  return {
    label: status || "Không xác định",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  };
};

const AdminQRSessionDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getStats, statsLoading, sessionStats } = useAttendance();

  const detailPayload = useMemo(
    () => location.state?.sessionDetail || readSessionDetail(),
    [location.state?.sessionDetail],
  );

  useEffect(() => {
    if (!location.state?.sessionDetail) return;
    sessionStorage.setItem(DETAIL_STORAGE_KEY, JSON.stringify(location.state.sessionDetail));
  }, [location.state?.sessionDetail]);

  const selectedSession = detailPayload?.session || null;
  const selectedSchedule = detailPayload?.schedule || null;
  const selectedCourse = detailPayload?.course || null;
  const selectedTeacher = detailPayload?.teacher || null;

  const classSessionId = selectedSession?.class_session_id || null;
  const attendanceSessionId = selectedSession?.id || null;
  console.log("Selected session:", selectedSession?.id);

  const loadStats = useCallback(async () => {
    if (!attendanceSessionId) return false;

    const response = await getStats(attendanceSessionId, selectedTeacher?.id || null);

    return Boolean(response);
  }, [attendanceSessionId, getStats, selectedTeacher?.id]);

  useEffect(() => {
    if (!attendanceSessionId) return;
    void loadStats();
  }, [attendanceSessionId, loadStats]);

  const statsData = sessionStats?.session?.id === attendanceSessionId ? sessionStats : null;
  console.log("Stats data for session:", statsData);

  const classDate = selectedSession?.class_date;
  const startHour = selectedSession?.start_hour;

  const sessionStatus = statsData?.session?.status || selectedSession?.status;
  const sessionStatusMeta = getSessionStatusMeta(sessionStatus);

  const createdAt = selectedSession?.created_at || selectedSchedule?.attendanceSession?.created_at;
  const expiresAt = statsData?.session?.expires_at || selectedSession?.expires_at;
  const sessionDurationMinutes = selectedSession?.session_duration_minutes || "--";
  const qrInterval = selectedSession?.qr_interval || selectedSchedule?.attendanceSession?.qr_interval || "--";

  const totalStudents = toSafeNumber(statsData?.stats?.total, toSafeNumber(selectedSession?.stats?.total, 0));
  const attendedCount = toSafeNumber(statsData?.stats?.attended, toSafeNumber(selectedSession?.stats?.attended, 0));
  const absentCount = Math.max(totalStudents - attendedCount, 0);
  const attendanceRate = toSafeNumber(
    statsData?.stats?.rate,
    totalStudents > 0 ? Math.round((attendedCount / totalStudents) * 1000) / 10 : 0,
  );
  const quorumMet =
    statsData?.stats?.quorum_met !== undefined ? statsData.stats.quorum_met : Boolean(selectedSession?.quorum_met);

  const attendanceRows = useMemo(() => {
    if (!Array.isArray(statsData?.attendances)) return [];

    return [...statsData.attendances].sort(
      (a, b) => new Date(b?.scan_time || 0) - new Date(a?.scan_time || 0),
    );
  }, [statsData]);

  const scheduleForResultPage = useMemo(() => {
    if (!selectedSchedule) return null;

    return {
      ...selectedSchedule,
      id: classSessionId,
      class_session_id: classSessionId || selectedSchedule?.class_session_id,
      class_date: classDate || selectedSchedule?.class_date,
      start_hour: startHour || selectedSchedule?.start_hour,
      attendanceSession: {
        ...(selectedSchedule?.attendanceSession || {}),
        id: attendanceSessionId,
        status: sessionStatus,
        created_at: createdAt,
        expires_at: expiresAt,
        session_duration_minutes: sessionDurationMinutes,
        qr_interval: qrInterval,
        quorum_met: quorumMet,
      },
    };
  }, [
    attendanceSessionId, classDate, classSessionId, createdAt, expiresAt, qrInterval, quorumMet, selectedSchedule, sessionDurationMinutes, sessionStatus, startHour,
  ]);

  const handleOpenResultPage = () => {
    if (!scheduleForResultPage) return;

    sessionStorage.setItem("attendanceSchedule", JSON.stringify(scheduleForResultPage));
    navigate("/dashboard/admin/results-qr", {
      state: { schedule: scheduleForResultPage, course: selectedCourse, teacher: selectedTeacher },
    });
  };

  if (!selectedSession || !selectedSchedule) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-slate-800">Không có dữ liệu phiên để hiển thị</p>
        <p className="mt-2 text-sm text-slate-500">
          Vui lòng quay lại tab QR Code và chọn lại phiên cần xem chi tiết.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-sky-600">Chi tiết phiên điểm danh</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{selectedCourse?.name || "Chưa có học phần"}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">{selectedCourse?.code || "---"}</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700">{selectedSchedule?.practice_group_id ? "Thực hành" : "Lý thuyết"}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">{selectedSchedule?.practice_group_name || "Chưa phân nhóm"}</span>
              <span className="rounded-full bg-violet-100 px-3 py-1 font-medium text-violet-700">Session #{selectedSession?.session_number || "--"}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${sessionStatusMeta.className}`}>
              {sessionStatusMeta.label}
            </span>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>
            <button
              type="button"
              onClick={handleOpenResultPage}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4" />
              Mở Result QR
            </button>
            <button
              type="button"
              onClick={() => void loadStats()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className={`h-4 w-4 ${statsLoading ? "animate-spin" : ""}`} />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Sĩ số phiên</p>
          <p className="mt-2 text-2xl font-bold text-indigo-700">{totalStudents}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Điểm danh thành công</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{attendedCount}</p>
        </div>
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">Vắng</p>
          <p className="mt-2 text-2xl font-bold text-rose-700">{absentCount}</p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Tỷ lệ điểm danh</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">{attendanceRate}%</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Thông tin phiên</h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-slate-500"><GraduationCap className="h-4 w-4" /> Học kỳ</span>
              <span className="font-medium text-slate-800">{selectedCourse?.semester || "Chưa cập nhật"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-slate-500"><CalendarDays className="h-4 w-4" /> Ngày học</span>
              <span className="font-medium text-slate-800">{formatDate(classDate)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-slate-500"><Clock3 className="h-4 w-4" /> Khung giờ</span>
              <span className="font-medium text-slate-800">{formatTime(startHour)} - {formatTime(selectedSchedule?.end_hour)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-slate-500"><Hourglass className="h-4 w-4" /> Thời lượng</span>
              <span className="font-medium text-slate-800">{sessionDurationMinutes} phút</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-slate-500"><Gauge className="h-4 w-4" /> Chu kỳ QR</span>
              <span className="font-medium text-slate-800">{qrInterval} giây</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-500">Phòng học</span>
              <span className="font-medium text-slate-800">{selectedSchedule?.room?.room_name || "Chưa cập nhật"}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-500">Tạo lúc</span>
              <span className="font-medium text-slate-800">{formatDateTime(createdAt)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-500">Hết hạn</span>
              <span className="font-medium text-slate-800">{formatDateTime(expiresAt)}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-500">Quorum</span>
              <span className={`font-medium ${quorumMet ? "text-emerald-700" : "text-rose-700"}`}>
                {quorumMet ? "Đạt" : "Chưa đạt"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-800">Danh sách lượt quét trong phiên</h2>
            <div className="text-xs text-slate-500">
              Người tạo: <span className="font-semibold text-slate-700">{selectedSession?.creator_name || "Chưa cập nhật"}</span>
              <span className="mx-2">|</span>
              {selectedSession?.creator_email || "Chưa cập nhật"}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">MSSV</th>
                  <th className="px-4 py-3 text-left">Họ tên</th>
                  <th className="px-4 py-3 text-left">Thời gian quét</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRows.map((item, index) => (
                  <tr key={item.id || `${item?.student?.id || "student"}-${index}`} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-slate-600">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-indigo-700">{item?.student?.student_code || "--"}</td>
                    <td className="px-4 py-3 text-slate-700">
                      <span className="inline-flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        {item?.student?.full_name || "Không rõ tên"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{formatDateTime(item?.scan_time)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {attendanceRows.length === 0 ? (
              <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-slate-500">
                <Users className="h-4 w-4" />
                Chưa có sinh viên quét trong phiên này.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQRSessionDetailPage;
