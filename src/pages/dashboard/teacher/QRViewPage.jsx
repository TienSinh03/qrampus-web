import React, { useEffect, useMemo, useState } from "react";
import { SquareStar } from "lucide-react";
import { useAttendance } from "@contexts/AttendanceContext";

export default function QRViewPage() {
    const { getSessionTiming, getStats } = useAttendance();

    const [clockTick, setClockTick] = useState(0);
    const [scanStats, setScanStats] = useState(null);
    const [scanStatsSessionId, setScanStatsSessionId] = useState(null);
    const [lastCompletedStats, setLastCompletedStats] = useState(null);
    const [statsError, setStatsError] = useState(null);

    const [savedSchedule] = useState(() => {
        try {
            const rawSchedule = sessionStorage.getItem("attendanceSchedule");
            if (!rawSchedule) return null;
            return JSON.parse(rawSchedule);
        } catch (error) {
            console.error("Error loading class session for QR view:", error);
            return null;
        }
    });

    const classSessionId = savedSchedule?.id || null;

    useEffect(() => {
        const timer = setInterval(() => {
            setClockTick((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const sessionTiming = getSessionTiming(classSessionId, clockTick);
    const activeSession = sessionTiming?.session || null;
    const sessionClassInfo = activeSession?.classInfo || {};

    const displayCourseName = sessionClassInfo.course_name || savedSchedule?.courseSection?.name || "Chưa có môn học";
    const displayCourseCode = sessionClassInfo.course_code || savedSchedule?.courseSection?.code || "N/A";
    const displaySemester = savedSchedule?.courseSection?.semester || "N/A";
    const displayPracticeGroup = savedSchedule?.practiceGroup?.group_name || savedSchedule?.practiceGroup?.groupName || "";
    const displayRoomName =  savedSchedule?.room?.room_name || "N/A";
    const displayTeacherName = savedSchedule?.personnel?.full_name || "N/A";
    const displayDate = sessionClassInfo?.class_date || savedSchedule?.class_date || savedSchedule?.classDate || null;
    const displayStartHour = sessionClassInfo?.start_hour || savedSchedule?.start_hour || "";
    const displayEndHour = sessionClassInfo?.end_hour || savedSchedule?.end_hour || "";

    const getCourseInitials = (courseName) => {
        if (!courseName) return "QR";

        const words = courseName.trim().split(/\s+/).filter(Boolean);
        if (words.length === 0) return "QR";
        if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

        return `${words[0][0]}${words[1][0]}`.toUpperCase();
    };

    const formatHour = (hourValue) => {
        if (!hourValue || typeof hourValue !== "string") return "";
        return hourValue.slice(0, 5);
    };

    const formatDateLabel = (dateValue) => {
        if (!dateValue) return "";

        const date = new Date(`${dateValue}T00:00:00`);
        if (Number.isNaN(date.getTime())) return "";

        return date.toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatCountdown = (seconds) => {
        const safeSeconds = Math.max(0, Number(seconds) || 0);
        const mins = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
        const secs = String(safeSeconds % 60).padStart(2, "0");
        return `${mins}:${secs}`;
    };

    const formatScanTime = (scanTime) => {
        if (!scanTime) return "--:--";

        const date = new Date(scanTime);
        if (Number.isNaN(date.getTime())) return "--:--";

        return date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const courseInitials = getCourseInitials(displayCourseName);
    const timeRangeLabel = displayStartHour && displayEndHour
        ? `${formatHour(displayStartHour)} - ${formatHour(displayEndHour)}`
        : "Chưa có khung giờ";
    const dateLabel = formatDateLabel(displayDate);
    const scheduleLabel = dateLabel ? `${timeRangeLabel}, ${dateLabel}` : timeRangeLabel;

    const hasActiveSession = Boolean(sessionTiming?.session);
    const elapsedSeconds = sessionTiming?.elapsedSeconds ?? 0; // Thời gian đã trôi qua kể từ khi QR được tạo
    const remainingSeconds = sessionTiming?.remainingSeconds ?? 0; // Thời gian còn lại trước khi QR hết hạn
    const progressPercent = sessionTiming?.progressPercent ?? 0;
    const progressColorClass = remainingSeconds < 60 ? "bg-red-500" : "bg-emerald-500";

    // Cập nhật sinh viên quét
    useEffect(() => {
        if (!activeSession?.id) {
            return;
        }

        let isMounted = true;

        const fetchSessionStats = async () => {
            try {
                const data = await getStats(activeSession.id);
                if (!isMounted) return;

                if (data) {
                    setScanStats(data);
                    setScanStatsSessionId(activeSession.id);
                    setLastCompletedStats(data);
                    setStatsError(null);
                }
            } catch (error) {
                if (!isMounted) return;
                setStatsError(error?.message || "Không thể cập nhật danh sách điểm danh");
            }
        };

        fetchSessionStats();

        const interval = setInterval(fetchSessionStats, 3000);

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchSessionStats();
            }
        };

        // pull-to-refresh ngày khi quay lại tab
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            isMounted = false;
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [activeSession?.id, getStats]);

    let effectiveScanStats = lastCompletedStats || scanStats;

    if (activeSession?.id) {
        effectiveScanStats = scanStatsSessionId === activeSession.id ? scanStats : null;
    }

    const effectiveStatsError = hasActiveSession ? statsError : null;

    const attendedStudents = [...(effectiveScanStats?.attendances || [])].sort(
        (a, b) => new Date(b.scan_time) - new Date(a.scan_time)
    );

    const attendedCount = Number(effectiveScanStats?.stats?.attended ?? attendedStudents.length ?? 0);
    const totalStudents = Number(
        effectiveScanStats?.stats?.total
        ?? savedSchedule?.courseSection?.max_students
        ?? 0
    );
    const unscannedCount = Math.max(0, totalStudents - attendedCount);
    const timelineProgressPercent = totalStudents > 0 ? (attendedCount / totalStudents) * 100 : 0;

    const unscannedPlaceholders = useMemo(() => {
        const maxRows = Math.min(unscannedCount, 30);
        return Array.from({ length: maxRows }, (_, index) => ({
            id: `unscanned-${index + 1}`,
            label: `Sinh viên chưa quét #${index + 1}`,
        }));
    }, [unscannedCount]);

    return (
        <div className="">
            <div className="overflow-hidden bg-white shadow-xl rounded-b-3xl">
                <div className="h-12 w-full bg-gradient-to-r from-sky-400 via-cyan-300 to-orange-300" />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between px-8 py-6 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="-mt-20 h-32 w-32 rounded-3xl border-8 border-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-2xl flex items-center justify-center text-white text-5xl font-bold">
                            {courseInitials}
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {displayCourseName}
                            </h1>
                            <div className="mt-3 flex flex-wrap items-center gap-6 text-gray-600">
                                <span className="font-mono text-xl">{displayCourseCode}</span>
                                <span className="flex items-center gap-2">
                                    <SquareStar className="w-6 h-6 text-indigo-600" />
                                    <span className="font-semibold">{displaySemester}</span>
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                    Phòng: {displayRoomName}
                                </span>
                                {displayPracticeGroup ? (
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                        Nhóm: {displayPracticeGroup}
                                    </span>
                                ) : null}
                            </div>
                            <p className="mt-2 text-sm text-slate-500">Giảng viên: {displayTeacherName}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
                {/* Left: Meeting schedule */}

                <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 p-5 shadow-lg ring-1 ring-gray-200">
                    <div className="w-full max-w-md rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                        <div className="text-sm font-medium text-gray-600">
                            Thời gian đã chạy
                        </div>

                        <div className="mt-2 text-center text-5xl font-extrabold tracking-wider text-indigo-600 tabular-nums">
                            {formatCountdown(elapsedSeconds)}
                        </div>

                        <div className="mt-1 text-xs text-gray-500">
                            Còn lại: {formatCountdown(remainingSeconds)}
                        </div>

                        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${progressColorClass}`}
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            {!hasActiveSession
                                ? "Hiện chưa có phiên điểm danh đang hoạt động"
                                : (remainingSeconds < 60
                                    ? "Còn dưới 1 phút, vui lòng quét QR ngay"
                                    : "Buổi điểm danh đang diễn ra")}
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-lg font-semibold text-indigo-600">
                            Quét QR để điểm danh
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            {scheduleLabel}
                        </p>
                    </div>
                </div>

                {/* Right: Highlighted event */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex space-x-4 justify-around">

                        {/* Cột 1 */}
                        <div className="w-1/3 max-h-96 pr-2 flex flex-col">

                            {/* Tiêu đề cố định */}
                            <h2 className="text-lg font-semibold text-white bg-yellow-600 px-4 py-3 rounded-t-lg">
                                Đã điểm danh
                            </h2>

                            {/* Vùng cuộn */}
                            <div className="overflow-y-auto flex-1">

                                <div className="relative pl-12">
                                    {/* Line progress */}
                                    <div className="absolute left-5 top-2 bottom-8 w-0.5 bg-yellow-300">
                                        <div
                                            className="w-full bg-yellow-300 transition-all duration-700 ease-out"
                                            style={{
                                                height: `${timelineProgressPercent}%`,
                                            }}
                                        />
                                    </div>

                                    {attendedStudents.map((item) => (
                                        <div key={item.id} className="relative flex items-start mb-4 last:mb-0">
                                            <div className="absolute left-[-34px] top-1 flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full border-2 shadow-md transition-all bg-yellow-400" />
                                            </div>

                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {item.student?.student_code || "N/A"}
                                                </h3>
                                                <p className="mt-0.5 text-sm text-gray-600">{item.student?.full_name || "Không rõ tên"}</p>
                                                <p className="mt-0.5 text-xs text-gray-400">Quét lúc: {formatScanTime(item.scan_time)}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {attendedStudents.length === 0 && (
                                        <p className="text-sm text-gray-400 py-2">Chưa có sinh viên nào quét QR</p>
                                    )}
                                </div>

                            </div>
                        </div>


                        {/* Cột 2 */}
                        <div className="w-1/3 max-h-96 pr-2 flex flex-col">
                            {/* Tiêu đề cố định */}
                            <h2 className="text-lg font-semibold text-white bg-sky-600 px-4 py-3 rounded-t-lg">
                                Chưa điểm danh
                            </h2>

                            {/* Vùng cuộn */}
                            <div className="overflow-y-auto flex-1">

                                <div className="relative pl-12">
                                    {/* Line progress */}
                                    <div className="absolute left-5 top-2 bottom-8 w-0.5 bg-sky-200">
                                        <div
                                            className="w-full bg-sky-600 transition-all duration-700 ease-out"
                                            style={{
                                                height: `${Math.max(0, 100 - timelineProgressPercent)}%`,
                                            }}
                                        />
                                    </div>

                                    {unscannedPlaceholders.map((item) => (
                                        <div key={item.id} className="relative flex items-start mb-4 last:mb-0">
                                            <div className="absolute left-[-34px] top-1 flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full border-4 shadow-md transition-all bg-gray-300" />
                                            </div>

                                            <div className="opacity-70">
                                                <h3 className="font-medium text-gray-500">{item.label}</h3>
                                            </div>
                                        </div>
                                    ))}

                                    {unscannedCount > unscannedPlaceholders.length && (
                                        <p className="text-xs text-gray-400">...và {unscannedCount - unscannedPlaceholders.length} sinh viên khác</p>
                                    )}

                                    {unscannedCount === 0 && (
                                        <p className="text-sm text-emerald-500 py-2">Tất cả sinh viên đã quét QR</p>
                                    )}
                                </div>

                            </div>
                        </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-8 mt-8">
                        {/* 1. ĐÃ ĐIỂM DANH – Màu vàng (thành công) */}
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-yellow-500 shadow glow-yellow"></div>
                            <span className="text-sm font-medium text-gray-700">
                                Đã quét: {attendedCount}/{totalStudents || attendedCount} sinh viên
                            </span>
                        </div>

                        {/* 2. ĐANG ĐIỂM DANH – Màu xanh sky (đang xử lý) */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-sky-500 shadow"></div>
                                <div className="absolute inset-0 rounded-full bg-sky-400 animate-ping"></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                Chưa quét: {unscannedCount} sinh viên
                            </span>
                        </div>
                    </div>

                    {effectiveStatsError && (
                        <p className="mt-4 text-xs text-red-500">{effectiveStatsError}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
