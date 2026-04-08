import React, { useEffect, useState } from "react";
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

import { QRCodeSVG } from "qrcode.react";


const QRPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getSessionTiming } = useAttendance();

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

  const currentSchedule = schedule || savedSchedule;
  const classSessionId = currentSchedule?.id || currentSchedule?.class_session_id || null;
  const practiceGroupName = currentSchedule?.practiceGroup?.group_name || currentSchedule?.practiceGroup?.groupName || "N/A";

  const persistAttendanceSchedule = () => {
    if (!currentSchedule) return;
    sessionStorage.setItem('attendanceSchedule', JSON.stringify(currentSchedule));
  };
  const meetings = [
    // Thành công (<= 20 giây)
    {
      name: "Nguyễn Văn An",
      date: "26 Nov",
      time: "08:00 - 08:05",
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-sky-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
    },
    {
      name: "Trần Thị Bình",
      date: "26 Nov",
      time: "08:15 - 08:25", // 10s
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-pink-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
    },
    {
      name: "Lê Văn Cường",
      date: "26 Nov",
      time: "08:30 - 08:40", // 10s
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-orange-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
    },
    {
      name: "Phạm Thu Duyên",
      date: "26 Nov",
      time: "09:00 - 09:15", // 15s
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-green-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
    },
    {
      name: "Hoàng Minh Đức",
      date: "26 Nov",
      time: "09:30 - 09:50", // 20s
      tag: "Thành công",
      tagColor: "bg-violet-100 text-violet-600",
      avatarBg: "bg-red-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
    },

    // Cho phép (<= 30 giây)
    {
      name: "Đỗ Thị Giang",
      date: "26 Nov",
      time: "10:00 - 10:25", // 25s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-cyan-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/6.png",
    },
    {
      name: "Vũ Văn Hùng",
      date: "26 Nov",
      time: "10:30 - 11:00", // 30s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-lime-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/7.png",
    },
    {
      name: "Nguyễn Thị Hương",
      date: "26 Nov",
      time: "11:05 - 11:30", // 25s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-indigo-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/8.png",
    },
    {
      name: "Trần Văn Khoa",
      date: "26 Nov",
      time: "11:35 - 11:58", // 23s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-amber-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
    },
    {
      name: "Lê Minh Lý",
      date: "26 Nov",
      time: "13:00 - 13:28", // 28s
      tag: "Cho phép",
      tagColor: "bg-yellow-100 text-yellow-600",
      avatarBg: "bg-teal-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
    },

    // Vượt mức (<= 40 giây)
    {
      name: "Phạm Văn Nam",
      date: "26 Nov",
      time: "13:30 - 14:05", // 35s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-blue-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
    },
    {
      name: "Hoàng Thị Oanh",
      date: "26 Nov",
      time: "14:10 - 14:50", // 40s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-purple-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
    },
    {
      name: "Đỗ Minh Quân",
      date: "26 Nov",
      time: "15:00 - 15:35", // 35s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-rose-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
    },
    {
      name: "Vũ Thị Sen",
      date: "26 Nov",
      time: "15:40 - 16:18", // 38s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-fuchsia-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/6.png",
    },
    {
      name: "Nguyễn Văn Tài",
      date: "26 Nov",
      time: "16:20 - 16:59", // 39s
      tag: "Vượt mức",
      tagColor: "bg-orange-100 text-orange-600",
      avatarBg: "bg-violet-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/7.png",
    },

    // Không (<= 5 phút)
    {
      name: "Trần Thị Uyên",
      date: "26 Nov",
      time: "17:00 - 17:30", // 30s (dưới 5 phút)
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
    },
    {
      name: "Lê Văn Vinh",
      date: "26 Nov",
      time: "17:40 - 18:25", // 45s (dưới 5 phút)
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
    },
    {
      name: "Phạm Thị Xuân",
      date: "26 Nov",
      time: "18:30 - 19:00", // 30s
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
    },
    {
      name: "Hoàng Minh Yến",
      date: "26 Nov",
      time: "19:05 - 19:43", // 38s
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
    },
    {
      name: "Đỗ Văn Zũng",
      date: "26 Nov",
      time: "20:00 - 20:50", // 50s
      tag: "Không",
      tagColor: "bg-gray-100 text-red-600",
      avatarBg: "bg-lightgray-100",
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
    },
  ];

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

  const sessionTiming = getSessionTiming(classSessionId, sessionClockTick);
  const hasActiveSession = Boolean(sessionTiming?.session);
  const sessionTotalSeconds = sessionTiming?.totalSeconds ?? 0;
  const sessionElapsedSeconds = sessionTiming?.elapsedSeconds ?? 0; // Thời gian đã trôi qua kể từ khi QR được tạo
  const sessionRemainingSeconds = sessionTiming?.remainingSeconds ?? 0; // Thời gian còn lại trước khi QR hết hạn
  
  const sessionDurationMinutes = sessionTotalSeconds > 0 ? Math.ceil(sessionTotalSeconds / 60) : 0;
  const sessionProgress = sessionTotalSeconds > 0
    ? Math.round((sessionElapsedSeconds / sessionTotalSeconds) * 100)
    : 0;

  const formatCountdown = (seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const mins = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
    const secs = String(safeSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const sessionClassInfo = sessionTiming?.session?.classInfo || {};
  const courseName = sessionClassInfo?.course_name || currentSchedule?.courseSection?.name || "Chưa có học phần";
  const courseCode = sessionClassInfo?.course_code || currentSchedule?.courseSection?.code || "N/A";
  const semesterLabel = currentSchedule?.courseSection?.semester || "N/A";
  const teacherName = currentSchedule?.personnel?.full_name || "N/A";
  const courseDescription = currentSchedule?.courseSection?.description || "Học phần đang được cập nhật mô tả.";

  const classDateRaw = sessionClassInfo?.class_date || currentSchedule?.class_date || currentSchedule?.classDate;
  const startHourRaw = sessionClassInfo?.start_hour || currentSchedule?.start_hour || "";
  const endHourRaw = sessionClassInfo?.end_hour || currentSchedule?.end_hour || "";

  const classDateObj = classDateRaw ? new Date(`${classDateRaw}T00:00:00`) : null;
  const isValidClassDate = classDateObj && !Number.isNaN(classDateObj.getTime());

  const dayLabel = isValidClassDate  ? classDateObj.toLocaleDateString("en-US", { day: "2-digit" }) : "--";
  const monthLabel = isValidClassDate ? classDateObj.toLocaleDateString("en-US", { month: "short" }) : "N/A";

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

  const getDisplayTag = (tag) => (tag === "Thành công" ? "Thành công" : "Vắng");
  const getDisplayTagColor = (tag) =>
    tag === "Thành công"
      ? "bg-violet-100 text-violet-600"
      : "bg-red-100 text-red-600";

  const successCount = meetings.filter((m) => m.tag === "Thành công").length;
  const absentCount = meetings.filter((m) => m.tag !== "Thành công").length;
  const strangeDeviceCount = meetings.filter((m) => m.tag === "Vượt mức").length;

  const classSize = currentSchedule?.courseSection?.max_students || 50;
  const qrCreatedCount = 1;
  const attendedSessionCount = 12;
  const capturedImageCount = meetings.length;

  const isSessionEnded = classSessionId ? !hasActiveSession : currentSchedule?.attendanceSession?.status === "ended";
  const locationStatsCount = successCount;

  return (
    <div className="space-y-6">


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard
          title="SĨ SỐ"
          value={classSize.toLocaleString("vi-VN")}
          percent="(Học phần)"
          positive={true}
          subtitle="Tổng số sinh viên học phần"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />

        <StatsCard
          title="SỐ QR ĐÃ TẠO"
          value={qrCreatedCount.toLocaleString("vi-VN")}
          percent="(Hiện tại)"
          positive={true}
          subtitle="Mã QR đã tạo cho buổi học"
          icon={<UserPlus className="w-6 h-6 text-rose-600" />}
          iconBg="bg-rose-100"
        />

        <StatsCard
          title="SỐ BUỔI ĐÃ ĐIỂM DANH"
          value={attendedSessionCount.toLocaleString("vi-VN")}
          percent="(Học kỳ)"
          positive={true}
          subtitle="Tổng buổi đã thực hiện điểm danh"
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
                      QR không còn hiệu lực. Vui lòng tạo phiên điểm danh mới.
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
            <button onClick={() => navigate('/dashboard/results-qr')} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"   title="Xem danh sách điểm danh hôm nay">
              <View className="w-4 h-4" />
            </button>
          </div>
          <div className="mb-4 flex gap-2 text-xs font-medium">
            <button className="rounded-full bg-violet-400 px-3 py-1 text-white shadow-sm">
              Thành công
            </button>
            <button className="rounded-full bg-red-400 px-3 py-1 text-white hover:bg-red-500">
              Vắng
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto pr-2">
            {meetings.map((m, index) => (
              <div
                key={m.name}
                className={`flex items-center justify-between rounded-xl px-2 py-2 hover:bg-slate-50
                  ${index !== meetings.length - 1 ? "mb-3" : ""}
                `}
                onClick={() => navigate('/dashboard/results-qr-detail-user')}
                style={{ cursor: "pointer" }}

              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${m.avatarBg} text-lg`}
                  >
                    <img src={m.avatar_url} alt={m.name} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{m.name}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <span>📅</span>
                      <span>{m.date}</span>
                      <span className="mx-1">|</span>
                      <span>{m.time}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getDisplayTagColor(m.tag)}`}
                >
                  {getDisplayTag(m.tag)}
                </span>
              </div>
            ))}
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
