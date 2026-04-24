import React, { useEffect, useMemo, useState } from "react";
// import { useTranslation } from 'react-i18next';
import StatsCard from "../../../components/common/StatsCard";
import {
  CirclePlus, Trash2, LockKeyhole, CloudUpload, Eye, MoreVertical,
  PencilLine, Users, UserCheck, UserX, UserPlus, SquareStar, SquareCheck,
  SquareUser,
  Calendar,
  CalendarClock,
  PieChart,
  ExternalLink,
  AlarmClockCheck,
  CircleCheckBig,
  GalleryThumbnails,
  MapPin,
  Delete,
  View,
} from "lucide-react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAttendance } from "@contexts/AttendanceContext";
import { useTeacherSchedule } from "@contexts/TeacherScheduleContext";
import { useStudySessionOverview } from "@contexts/StudySessionOverviewContext";

import { QRCodeSVG } from "qrcode.react";


const QRPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getSessionTiming, getStats, getLatestCompletedSessionSnapshot } = useAttendance();
  const {
    todaySchedules,
    todayLoading,
    todayError,
    fetchTodaySchedules,
    refreshTodaySchedules,
  } = useTeacherSchedule();

  const {
    overview: classSessionOverview,
    loading: classSessionOverviewLoading,
    error: classSessionOverviewError,
    currentClassSessionId: overviewClassSessionId,
    fetchOverview: fetchClassSessionOverview,
    refreshOverview: refreshClassSessionOverview,
  } = useStudySessionOverview();

  // const { t } = useTranslation();
  const schedule = location.state?.schedule;

  const [savedSchedule] = useState(() => {
    try {
      const raw = sessionStorage.getItem('attendanceSchedule');
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (error) {
      console.error('Error loading attendance schedule from sessionStorage:', error);
      return null;
    }
  });

  const [selectedSchedule, setSelectedSchedule] = useState(() => schedule || savedSchedule || null);

  useEffect(() => {
    if (!schedule) return;
    setSelectedSchedule(schedule);
    sessionStorage.setItem('attendanceSchedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    fetchTodaySchedules();
  }, [fetchTodaySchedules]);

  const currentSchedule = selectedSchedule;
  const classSessionId = currentSchedule?.id || currentSchedule?.class_session_id || null;
  const practiceGroupName = currentSchedule?.practiceGroup?.group_name || currentSchedule?.practiceGroup?.groupName || "Chưa phân nhóm";

  useEffect(() => {
    if (!classSessionId) return;
    fetchClassSessionOverview(classSessionId);
  }, [classSessionId, fetchClassSessionOverview]);

  const sortedTodaySchedules = useMemo(() => {
    if (!Array.isArray(todaySchedules)) return [];

    return [...todaySchedules].sort((a, b) => {
      const first = String(a?.start_hour || '');
      const second = String(b?.start_hour || '');
      return first.localeCompare(second);
    });
  }, [todaySchedules]);

  const toSessionKey = (value) => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  const handleSelectSchedule = (scheduleItem) => {
    if (!scheduleItem) return;
    setSelectedSchedule(scheduleItem);
    sessionStorage.setItem('attendanceSchedule', JSON.stringify(scheduleItem));
    setLiveStats(null);
    setStatsError(null);

    const nextClassSessionId = scheduleItem?.id || scheduleItem?.class_session_id;
    if (nextClassSessionId) {
      refreshClassSessionOverview(nextClassSessionId);
    }
  };

  const persistAttendanceSchedule = () => {
    if (!currentSchedule) return;
    sessionStorage.setItem('attendanceSchedule', JSON.stringify(currentSchedule));
  };

  const [liveStats, setLiveStats] = useState(null);
  const [statsError, setStatsError] = useState(null);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [sessionClockTick, setSessionClockTick] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      const timeString = now.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const dateString = now.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      setTime(timeString);
      setDate(dateString);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionClockTick((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sessionTiming = getSessionTiming(classSessionId, sessionClockTick, { fallbackToAny: false });
  const anyActiveSessionTiming = getSessionTiming(null, sessionClockTick);
  const anyActiveClassSessionId = anyActiveSessionTiming?.session?.class_session_id || null;
  const hasActiveSession = Boolean(sessionTiming?.session);
  const sessionTotalSeconds = sessionTiming?.totalSeconds ?? 0;
  const sessionElapsedSeconds = sessionTiming?.elapsedSeconds ?? 0; // Thời gian đã trôi qua kể từ khi QR được tạo
  const sessionRemainingSeconds = sessionTiming?.remainingSeconds ?? 0; // Thời gian còn lại trước khi QR hết hạn
  
  const sessionDurationMinutes = sessionTotalSeconds > 0 ? Math.ceil(sessionTotalSeconds / 60) : 0;
  const sessionProgress = sessionTotalSeconds > 0
    ? Math.round((sessionElapsedSeconds / sessionTotalSeconds) * 100)
    : 0;
  const completedSnapshot = getLatestCompletedSessionSnapshot(classSessionId);

  useEffect(() => {
    if (!classSessionId || !hasActiveSession) {
      return;
    }

    const interval = setInterval(() => {
      refreshClassSessionOverview(classSessionId);
    }, 10000);

    return () => clearInterval(interval);
  }, [classSessionId, hasActiveSession, refreshClassSessionOverview]);

  useEffect(() => {
    const currentKey = toSessionKey(classSessionId);
    const activeKey = toSessionKey(anyActiveClassSessionId);

    if (!activeKey || activeKey === currentKey || hasActiveSession) {
      return;
    }

    const matchedSchedule = sortedTodaySchedules.find((item) => {
      const itemKey = toSessionKey(item?.id || item?.class_session_id);
      return itemKey === activeKey;
    });

    if (!matchedSchedule) {
      return;
    }

    setSelectedSchedule(matchedSchedule);
    sessionStorage.setItem('attendanceSchedule', JSON.stringify(matchedSchedule));
    setLiveStats(null);
    setStatsError(null);
  }, [anyActiveClassSessionId, classSessionId, hasActiveSession, sortedTodaySchedules]);

  useEffect(() => {
    if (!hasActiveSession || !sessionTiming?.session?.id) {
      setLiveStats(null);
      setStatsError(null);
      setIsStatsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchStats = async () => {
      setIsStatsLoading(true);
      try {
        const data = await getStats(sessionTiming.session.id);
        if (!isMounted) return;

        if (data) {
          setLiveStats(data);
          setStatsError(null);
        }
      } catch (error) {
        if (!isMounted) return;
        setStatsError(error?.message || 'Không thể tải thống kê điểm danh');
      } finally {
        if (isMounted) {
          setIsStatsLoading(false);
        }
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [hasActiveSession, sessionTiming?.session?.id, getStats]);

  const effectiveStats = hasActiveSession ? liveStats : completedSnapshot?.raw || null;
  const attendanceRows = Array.isArray(effectiveStats?.attendances)
    ? [...effectiveStats.attendances].sort((a, b) => new Date(b.scan_time) - new Date(a.scan_time))
    : [];

  const formatCountdown = (seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const mins = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
    const secs = String(safeSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const sessionClassInfo = sessionTiming?.session?.classInfo || {};
  const courseName = sessionClassInfo?.course_name || currentSchedule?.courseSection?.name || "Chưa có học phần";
  const courseCode = sessionClassInfo?.course_code || currentSchedule?.courseSection?.code || "Chưa có mã học phần";
  const semesterLabel = currentSchedule?.courseSection?.semester || "Chưa cập nhật học kỳ";
  const teacherName = currentSchedule?.personnel?.full_name || "Chưa cập nhật giảng viên";
  const courseDescription = currentSchedule?.courseSection?.description || "Học phần đang được cập nhật mô tả.";

  const classDateRaw = sessionClassInfo?.class_date || currentSchedule?.class_date || currentSchedule?.classDate;
  const startHourRaw = sessionClassInfo?.start_hour || currentSchedule?.start_hour || "";
  const endHourRaw = sessionClassInfo?.end_hour || currentSchedule?.end_hour || "";

  const classDateObj = classDateRaw ? new Date(`${classDateRaw}T00:00:00`) : null;
  const isValidClassDate = classDateObj && !Number.isNaN(classDateObj.getTime());

  const dayLabel = isValidClassDate  ? classDateObj.toLocaleDateString("en-US", { day: "2-digit" }) : "--";
  const monthLabel = isValidClassDate ? classDateObj.toLocaleDateString("en-US", { month: "short" }) : "--";

  const formatHour = (hourValue) => {
    if (!hourValue || typeof hourValue !== "string") return "";

    return hourValue.slice(0, 5);
  };

  const timeRange = startHourRaw && endHourRaw ? `${formatHour(startHourRaw)} - ${formatHour(endHourRaw)}` : "Chưa có khung giờ";

  const classDateLabel = isValidClassDate
    ? classDateObj.toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    : "Chưa có ngày học";

  const formatScanDate = (scanTime) => {
    if (!scanTime) return '--/--';

    const date = new Date(scanTime);
    if (Number.isNaN(date.getTime())) return '--/--';

    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const formatScanHour = (scanTime) => {
    if (!scanTime) return '--:--';

    const date = new Date(scanTime);
    if (Number.isNaN(date.getTime())) return '--:--';

    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  //helper number
  const toCount = (value, fallback = 0) => {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? parsedValue : fallback;
  };

  const attendanceOverview = classSessionOverview?.attendanceOverview || {};
  const latestSessionOverview = attendanceOverview?.latestSession || {};

  const classSize = toCount(
    attendanceOverview?.totalStudents,
    toCount(classSessionOverview?.classSession?.totalStudents, toCount(currentSchedule?.courseSection?.max_students, 0))
  );

  const computedStrangeDeviceCount = attendanceRows.filter((item) => item?.device_match === false || item?.device_verified === false).length;

  // Điểm danh thành công
  const successCount = hasActiveSession 
    ? toCount(effectiveStats?.stats?.attended, toCount(attendanceRows.length, 0))
    : toCount(latestSessionOverview?.attendedCount, toCount(effectiveStats?.stats?.attended, toCount(attendanceRows.length, 0)));

  // Vắng mặt
  const absentCount = hasActiveSession
    ? Math.max(0, classSize - successCount)
    : Math.max(0, toCount(latestSessionOverview?.absentCount, classSize - successCount));

  // Thiết bị lạ
  const strangeDeviceCount = hasActiveSession
    ? (computedStrangeDeviceCount > 0 ? computedStrangeDeviceCount : toCount(latestSessionOverview?.strangeDeviceCount, 0))
    : toCount(latestSessionOverview?.strangeDeviceCount, computedStrangeDeviceCount);

  // Số QR đã tạo
  const qrCreatedCount = hasActiveSession
    ? toCount(effectiveStats?.stats?.qr_generated, toCount(attendanceOverview?.qrGeneratedCount, 0))
    : toCount(attendanceOverview?.qrGeneratedCount, toCount(effectiveStats?.stats?.qr_generated, 0));

  // Số phiên điểm danh đã tạo  
  const attendedSessionCount = toCount(attendanceOverview?.attendanceSessionCount, 0);
  const capturedImageCount = Number(effectiveStats?.stats?.captured_images ?? effectiveStats?.stats?.photos ?? attendanceRows.length);

  const isSessionEnded = classSessionId ? !hasActiveSession : currentSchedule?.attendanceSession?.status === "ended";
  const locationStatsCount = attendanceRows.filter((item) => item?.location_match === true || item?.location_verified === true).length || successCount;

  if (!currentSchedule) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-white to-blue-50 border border-sky-100 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Điểm danh QR</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800">Chưa chọn buổi học để tạo phiên</h2>
          <p className="mt-2 text-sm text-slate-500">
            Để giao diện rõ ràng và không bị N/A, hệ thống chỉ hiển thị dashboard chi tiết sau khi bạn chọn một lịch học cụ thể.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/schedule')}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Mở trang Lịch học
            </button>
            <button
              type="button"
              onClick={refreshTodaySchedules}
              disabled={todayLoading}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {todayLoading ? 'Đang tải lịch hôm nay...' : 'Làm mới lịch hôm nay'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Lịch dạy hôm nay</h3>
            <span className="text-xs text-slate-400">Bấm chọn để vào nhanh màn QR</span>
          </div>

          {todayError && !todayLoading ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <p>{todayError}</p>
            </div>
          ) : null}

          {todayLoading && sortedTodaySchedules.length === 0 ? (
            <div className="space-y-3">
              <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-16 rounded-xl bg-slate-100 animate-pulse" />
            </div>
          ) : null}

          {!todayLoading && sortedTodaySchedules.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
              Hôm nay chưa có lịch dạy nào. Bạn có thể chọn buổi khác tại trang Lịch học.
            </div>
          ) : null}

          <div className="space-y-3">
            {sortedTodaySchedules.map((item) => {
              const itemCourseName = item?.courseSection?.name || item?.course_name || 'Chưa có tên học phần';
              const itemCourseCode = item?.courseSection?.code || item?.course_code || '---';
              const itemRoom = item?.room?.room_name || item?.room_name || 'Chưa phân phòng';
              const itemGroup = item?.practiceGroup?.group_name || item?.practice_group_name || 'Không chia nhóm';
              const itemTime = `${String(item?.start_hour || '').slice(0, 5)} - ${String(item?.end_hour || '').slice(0, 5)}`;

              return (
                <button
                  key={item?.id || `${itemCourseCode}-${itemTime}`}
                  type="button"
                  onClick={() => handleSelectSchedule(item)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{itemCourseName}</p>
                      <p className="text-xs text-slate-500">{itemCourseCode} • {itemRoom} • {itemGroup}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {itemTime}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {classSessionOverviewError && overviewClassSessionId === classSessionId ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
          {classSessionOverviewError}
        </div>
      ) : null}

      {classSessionOverviewLoading ? (
        <p className="text-xs text-slate-400">Đang tải tổng quan buổi học...</p>
      ) : null}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard
          title="SĨ SỐ"
          value={classSize.toLocaleString("vi-VN")}
          percent="(Buổi này)"
          positive={true}
          subtitle="SV đã đăng ký (LT/TH tách riêng)"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />

        <StatsCard
          title="SỐ QR ĐÃ TẠO"
          value={qrCreatedCount.toLocaleString("vi-VN")}
          percent="(Buổi này)"
          positive={true}
          subtitle="Tổng QR qua các phiên điểm danh"
          icon={<UserPlus className="w-6 h-6 text-rose-600" />}
          iconBg="bg-rose-100"
        />

        <StatsCard
          title="SỐ PHIÊN ĐIỂM DANH"
          value={attendedSessionCount.toLocaleString("vi-VN")}
          percent="(Buổi này)"
          positive={true}
          subtitle="Số phiên điểm danh đã tạo"
          icon={<CalendarClock className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-100"
        />

        <StatsCard
          title="SỐ HÌNH ẢNH ĐÃ CHỤP"
          value={capturedImageCount.toLocaleString("vi-VN")}
          percent="(Cập nhật)"
          positive={true}
          subtitle="Ảnh điểm danh đã ghi nhận"
          icon={<GalleryThumbnails className="w-6 h-6 text-yellow-600" />}
          iconBg="bg-yellow-100"
        />

      </div>
      <div className="grid gap-6 xl:grid-cols-3">

        <div className="rounded-2xl bg-white shadow-sm">
          <div className="h-32 w-full overflow-hidden rounded-t-2xl bg-[radial-gradient(circle_at_top,_#e5e7eb,_#cbd5f5)] flex flex-col justify-end px-4 pb-4">
            <p className="text-xl font-bold text-slate-800">{time}</p>
            <p className="text-sm text-slate-500 capitalize">{date}</p>
            <a
              onClick={() => {
                persistAttendanceSchedule();
                window.open('/dashboard/results-qr-extend-student', '_blank');
              }}
              className="mt-2 inline-flex items-center justify-center h-10 px-4 py-3 rounded-full text-slate-500 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all duration-300 ease-in-out shadow-md porter cursor-pointer"
            >
              <View className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Màn hình điểm danh dành cho sinh viên</span>
            </a>


          </div>


          {/* QR CODE */}
          <div className="flex flex-col items-center justify-center pt-2">
            {isSessionEnded ? (
              <div className="w-full max-w-sm rounded-2xl border border-red-200/80 bg-gradient-to-br from-red-50 via-rose-50 to-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                    <UserX className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-red-700">Phiên đã kết thúc</p>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                        Phiên đã kết thúc
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-red-600">
                      QR không còn hiệu lực. Bạn vẫn có thể xem lại kết quả phiên gần nhất ở danh sách bên phải.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 via-green-50 to-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <CircleCheckBig className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">Phiên đang diễn ra</p>
                      <p className="text-xs text-emerald-600">QR đang hoạt động cho sinh viên quét</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>
            )}

            <div className="mt-3 w-full max-w-sm rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Tiến độ phiên</span>
                <span className="font-semibold text-emerald-600">{sessionProgress}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${sessionProgress}%` }}
                />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg bg-white p-2">
                  <p className="text-slate-400">Đã quét</p>
                  <p className="font-semibold text-emerald-600">{successCount}</p>
                </div>
                <div className="rounded-lg bg-white p-2">
                  <p className="text-slate-400">Vắng</p>
                  <p className="font-semibold text-red-600">{absentCount}</p>
                </div>
                <div className="rounded-lg bg-white p-2">
                  <p className="text-slate-400">Thiết bị lạ</p>
                  <p className="font-semibold text-amber-600">{strangeDeviceCount}</p>
                </div>
              </div>
            </div>

            {/* thời lượng điểm danh */}
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <AlarmClockCheck className="w-5 h-5" />
              <span>
                {hasActiveSession
                  ? `Thời lượng phiên: ${sessionDurationMinutes} phút | Đã chạy: ${formatCountdown(sessionElapsedSeconds)} | Còn lại: ${formatCountdown(sessionRemainingSeconds)}`
                  : "Hiện chưa có phiên điểm danh đang hoạt động"}
              </span>
            </div>

            <button
              onClick={() => {
                persistAttendanceSchedule();
                navigate('/dashboard/qrcode-fullscreen');
              }}
              className="mt-2 inline-flex h-10 p-3 items-center justify-center rounded-full text-slate-500 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all duration-300 ease-in-out shadow-md"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="ml-2 text-sm font-medium">Chi tiết điểm danh</span>
            </button>


          </div>
        </div>

        {/* THÔNG TIN HỌC PHẦN */}

        <div className="rounded-2xl bg-white shadow-sm">
          {/* Image */}
          <div className="h-32 w-full overflow-hidden rounded-t-2xl bg-[radial-gradient(circle_at_top,_#e5e7eb,_#cbd5f5)] flex items-end">
            <h2 className="px-4 pb-4 text-lg font-semibold text-slate-800 drop-shadow-sm">
              {courseName}
            </h2>
          </div>


          <div className="p-6">
            {/* Header event */}
            <div className="mb-6 flex gap-2">
              <div className="flex h-16 w-24 flex-col items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <span className="text-xs font-medium">{monthLabel}</span>
                <span className="text-xl font-bold">{dayLabel}</span>
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Mã học phần: {courseCode}
                </h2>
                <p className="mt-1 inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                  Nhóm thực hành: {practiceGroupName}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                  {courseDescription}
                </p>
              </div>
            </div>

            {/* Status buttons */}
            <div className="mb-6 flex items-center justify-between text-xs">
              <button className="flex flex-col items-center gap-1 text-yellow-500 hover:text-yellow-200">
                <SquareStar className="w-5 h-5 " />
                <span>{semesterLabel}</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-yellow-500 hover:text-yellow-200">
                <SquareStar className="w-5 h-5 " />
                <span>{classDateObj ? classDateObj.getFullYear() : "N/A"}</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-green-600 hover:text-slate-700">
                <SquareCheck className="w-5 h-5 " />
                <span>{hasActiveSession ? "ĐANG TẠO QR" : "CHƯA KÍCH HOẠT"}</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-violet-600">
                <SquareUser className="w-5 h-5 " />
                <span>{teacherName}</span>
              </button>

            </div>
            {/* Lịch sử điểm danh gần nhất */}
            <div className="space-y-3 text-xs text-slate-600 border-t pt-4 border-slate-200">
              <div className="flex items-start gap-3">
                <CalendarClock className="w-5 h-5 " />
                <div>
                  <p>{`${classDateLabel}, ${timeRange}`}</p>
                  <p className="text-slate-400">Lịch hiện tại</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <SquareUser className="w-5 h-5 " />
                <div>
                  <p>Tạo bởi</p>
                  <p className="text-slate-400">
                    {teacherName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PieChart className="w-5 h-5 " />
                <div>
                  <p>Tổng SV:</p>
                  <p className="text-slate-400">
                    {`${successCount}/${classSize} SV`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* chứa bảng điểm danh hiện tại*/}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Điểm danh hôm nay
            </h2>
            {/* mở ra danh sách KQ hôm đó */}
            <button
              onClick={() => navigate('/dashboard/results-qr')}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              title="Xem danh sách điểm danh hôm nay"
              disabled={!hasActiveSession}
            >
              <View className="h-4 w-4" />
              Xem danh sách
            </button>
          </div>
          <div className="mb-4 flex gap-2 text-xs font-medium">
            <button className="rounded-full bg-violet-400 px-3 py-1 text-white shadow-sm">
              Thành công: {successCount}
            </button>
            <button className="rounded-full bg-red-400 px-3 py-1 text-white hover:bg-red-500">
              Vắng: {absentCount}
            </button>
          </div>

          {statsError ? (
            <p className="mb-3 text-xs text-red-500">{statsError}</p>
          ) : null}

          {isStatsLoading ? (
            <p className="mb-3 text-xs text-slate-400">Đang cập nhật dữ liệu điểm danh...</p>
          ) : null}

          <div className="max-h-72 overflow-y-auto pr-2">
            {attendanceRows.map((item, index) => (
              <div
                key={item.id || `${item?.student?.student_code || index}-${item?.scan_time || index}`}
                className={`flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-50
                  ${index !== attendanceRows.length - 1 ? "mb-3" : ""}
                `}
                onClick={() => navigate('/dashboard/results-qr')}
                style={{ cursor: "pointer" }}

              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg overflow-hidden"
                  >
                    {item?.student?.avatar_url ? (
                      <img src={item.student.avatar_url} alt={item?.student?.full_name || 'Sinh viên'} />
                    ) : (
                      <span className="text-xs font-semibold text-slate-600">
                        {(item?.student?.full_name || 'SV').slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item?.student?.full_name || 'Không rõ tên'}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span>📅</span>
                      <span>{formatScanDate(item?.scan_time)}</span>
                      <span className="mx-1">|</span>
                      <span>{formatScanHour(item?.scan_time)}</span>
                    </div>
                  </div>
                </div>

                <span
                  className="rounded-full px-3 py-1 text-xs font-medium bg-violet-100 text-violet-600"
                >
                  Thành công
                </span>
              </div>
            ))}

            {attendanceRows.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-500">
                {hasActiveSession
                  ? 'Chưa có sinh viên quét trong phiên hiện tại.'
                  : completedSnapshot
                    ? 'Phiên gần nhất chưa có dữ liệu quét.'
                    : 'Chưa có dữ liệu phiên gần nhất. Hãy tạo phiên điểm danh mới.'}
              </div>
            ) : null}
          </div>
        </div>


      </div>

      <div className=" bg-white shadow-sm">
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-emerald-700">SV điểm danh thành công</p>
              <CircleCheckBig className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-emerald-700">{successCount}</p>
          </div>

          <div className="rounded-xl border border-red-100 bg-red-50/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-red-700">SV vắng</p>
              <UserX className="h-5 w-5 text-red-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-red-700">{absentCount}</p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-amber-700">Thiết bị lạ</p>
              <LockKeyhole className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-amber-700">{strangeDeviceCount}</p>
          </div>

          <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-sky-700">Thống kê vị trí</p>
              <MapPin className="h-5 w-5 text-sky-600" />
            </div>
            <p className="mt-3 text-2xl font-bold text-sky-700">{locationStatsCount}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default QRPage;
