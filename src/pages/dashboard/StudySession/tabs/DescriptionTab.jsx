import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    SquareCheck,
    SquareUser,
    Calendar,
    BookA,
    CheckCircle2,
    CalendarDays,
    FileText,
    MapPin,
    Clock,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useStudySessionOverview } from "@contexts/StudySessionOverviewContext";

const DescriptionTab = ({ schedule }) => {
    const navigate = useNavigate();
    const {
        overview,
        loading: overviewLoading,
        error: overviewError,
        fetchOverview,
    } = useStudySessionOverview();

    const activities = [
        {
            dotColor: "bg-violet-500",
            title: "Buổi học Lý thuyết 05 đã bắt đầu",
            desc: "Học phần Lập trình Thiết bị Di động - Lý thuyết (Phòng A3.05)",
            time: "12 phút trước",
        },
        {
            dotColor: "bg-emerald-500",
            title: "Hạn nộp Bài tập cá nhân 02",
            desc: "Chủ đề: Xây dựng Giao diện người dùng cơ bản",
            sub: "Thời gian còn lại: 10 giờ 15 phút",
            time: "45 phút trước (Thông báo nhắc nhở)",
        },
        {
            dotColor: "bg-sky-500",
            title: "Giáo viên đã cập nhật điểm",
            desc: "Điểm Bài tập cá nhân 01 đã được công bố. Vui lòng kiểm tra trên hệ thống.",
            time: "2 Ngày trước",
        },
    ];

    useEffect(() => {
        if (!schedule?.id) {
            return;
        }
        fetchOverview(schedule.id);
    }, [fetchOverview, schedule?.id]);

    const courseProgress = overview?.courseProgress || {};
    const leaveEvidence = overview?.leaveEvidence || {};

    const attendedSessions = Number(courseProgress.learnedSessions || 0);
    const totalSessions = Number(courseProgress.totalSessions || 0);
    const remainingSessions = Number(courseProgress.remainingSessions || 0);
    const percentage = totalSessions > 0
        ? Math.round((attendedSessions / totalSessions) * 100)
        : 0;
    const safePercentage = Math.min(Math.max(percentage, 0), 100);
    const leaveEvidenceTotal = Number(leaveEvidence.total || 0);
    const estimatedEndDate = courseProgress.estimatedEndDate
        ? format(parseISO(courseProgress.estimatedEndDate), "dd/MM/yyyy", { locale: vi })
        : "Chưa xác định";

    const circumference = 2 * Math.PI * 72;
    const strokeDashoffset = circumference - (circumference * safePercentage) / 100;

    // Format time
    const formatTime = (time) => {
        if (!time) return '';
        return time.substring(0, 5);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return { label: 'Đã hoàn thành', class: 'bg-green-100 text-green-700' };
            case 'cancelled':
                return { label: 'Đã hủy', class: 'bg-red-100 text-red-700' };
            case 'scheduled':
            default:
                return { label: 'Đã lên lịch', class: 'bg-blue-100 text-blue-700' };
        }
    };

    const statusBadge = schedule ? getStatusBadge(schedule.status) : null;

    const openLeaveEvidence = () => {
        if (!schedule?.id) {
            return;
        }
        navigate(`/dashboard/leave-management?classSessionId=${encodeURIComponent(schedule.id)}`);
    };

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Left column - About */}
            <div className="space-y-6 md:col-span-1">
                <div className="rounded-b-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-base font-semibold uppercase tracking-wide text-slate-800">
                        Thông tin lịch học
                    </h2>
                    <div className="space-y-3 text-sm">
                        {schedule?.personnel && (
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 text-green-600"><SquareUser /></span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">
                                        Giảng viên
                                    </p>
                                    <p className="text-gray-700">{schedule?.personnel?.full_name}</p>
                                    <p className="text-xs text-gray-500">{schedule?.personnel?.teacher_code}</p>
                                </div>
                            </div>
                        )}

                        {schedule?.room && (
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 text-purple-600"><MapPin /></span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">
                                        Phòng học
                                    </p>
                                    <p className="text-gray-700">{schedule?.room?.room_code}</p>
                                    <p className="text-xs text-gray-500">{schedule?.room?.room_name}</p>
                                </div>
                            </div>
                        )}

                        {schedule && (
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 text-blue-600"><Clock /></span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">
                                        Thời gian
                                    </p>
                                    <p className="text-gray-700">
                                        {formatTime(schedule.start_hour)} - {formatTime(schedule.end_hour)}
                                    </p>
                                    <p className="text-xs text-gray-500">{schedule?.day_of_week}</p>
                                </div>
                            </div>
                        )}

                        {schedule && (
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5"><SquareCheck /></span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">
                                        Trạng thái
                                    </p>
                                    {statusBadge && (
                                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusBadge.class}`}>
                                            {statusBadge.label}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {schedule && (
                            <div className="flex items-start gap-3">
                                <span className="mt-0.5 text-yellow-500"><BookA /></span>
                                <div>
                                    <p className="text-xs font-semibold text-gray-900">
                                        Loại buổi học
                                    </p>
                                    <p className="text-gray-700">
                                        {schedule?.schedule_type === 'theory' ? 'Lý thuyết' : 'Thực hành'}
                                        {schedule?.practiceGroup && ` - Nhóm ${schedule?.practiceGroup?.number_group}`}
                                    </p>
                                    <p className="text-xs text-gray-500">Buổi {schedule.session_number}</p>
                                </div>
                            </div>
                        )}

                        {schedule?.class_date && (
                            <div className="flex items-start justify-between gap-8">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 text-blue-500">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-semibold text-gray-900">
                                            Ngày học
                                        </span>
                                    </div>
                                    <p className="mt-1 text-gray-700 font-medium">
                                        {format(parseISO(schedule?.class_date), 'dd/MM/yyyy', { locale: vi })}
                                    </p>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 text-blue-500">
                                        <CalendarDays className="w-4 h-4" />
                                        <span className="text-xs font-semibold text-gray-900">
                                            Học kỳ
                                        </span>
                                    </div>
                                    <p className="mt-1 text-gray-700 font-medium">
                                        {schedule?.courseSection?.semester || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="my-5 border-slate-100" />

                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Liên hệ
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5">📞</span>
                            <div>
                                <p className="text-xs font-semibold uppercase text-slate-400">
                                    Liên hệ
                                </p>
                                <p>{schedule?.personnel?.phone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5">💬</span>
                            <div>
                                <p className="text-xs font-semibold uppercase text-slate-400">
                                    Nhắn tin
                                </p>
                                <p>{schedule?.personnel?.name || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5">✉️</span>
                            <div>
                                <p className="text-xs font-semibold uppercase text-slate-400">
                                    Email
                                </p>
                                <p>{schedule?.personnel?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* <hr className="my-5 border-slate-100" />

                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Giảng viên chung nhóm
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Học phần Lý Thuyết</span>
                            <span className="text-slate-400">02 giảng viên</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Học phần Thực hành</span>
                            <span className="text-slate-400">03 giảng viên</span>
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Middle column - Activity Timeline */}
            <div className="space-y-6 md:col-span-2">
                <div className="rounded-b-xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Thông báo gần đây
                        </h2>
                        <span className="text-xs text-slate-400">Last updates</span>
                    </div>

                    <div className="space-y-6">
                        {activities.map((a) => (
                            <div key={a.title} className="flex gap-4">
                                {/* timeline dot & line */}
                                <div className="flex flex-col items-center">
                                    <span
                                        className={`h-3 w-3 rounded-full ${a.dotColor}`}
                                    />
                                    <span className="mt-1 h-full w-px bg-slate-200" />
                                </div>

                                {/* content */}
                                <div className="flex flex-1 items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {a.title}
                                        </p>
                                        <p className="text-xs text-slate-500">{a.desc}</p>

                                        {a.badge && (
                                            <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-rose-50 px-2 py-1 text-xs text-rose-600">
                                                <span>📄</span>
                                                <span className="font-medium">{a.badge}</span>
                                            </div>
                                        )}

                                        {a.sub && (
                                            <p className="mt-2 text-xs text-slate-400">
                                                {a.sub}
                                            </p>
                                        )}
                                    </div>

                                    <span className="text-xs text-slate-400">
                                        {a.time}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom cards: Connections & Teams */}
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-b-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <h2 className="mb-5 text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Tiến độ học phần
                        </h2>

                        <div className="flex flex-col items-center justify-center gap-7">
                            {/* Donut Chart - Đỉnh cao thẩm mỹ */}
                            <div className="relative h-44 w-44">
                                <svg className="h-44 w-44 -rotate-90 transform">
                                    {/* Vòng nền */}
                                    <circle
                                        cx="88"
                                        cy="88"
                                        r="72"
                                        stroke="#f1f5f9"
                                        strokeWidth="18"
                                        fill="none"
                                    />

                                    {/* Vòng tiến độ có gradient + animation mượt */}
                                    <circle
                                        cx="88"
                                        cy="88"
                                        r="72"
                                        stroke="url(#progressGradient)"
                                        strokeWidth="18"
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                        className="transition-all duration-1500 ease-out"
                                    />

                                    {/* Gradient đẹp mắt */}
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#60a5fa" />        {/* blue-400 */}
                                            <stop offset="50%" stopColor="#34d399" />        {/* emerald-400 */}
                                            <stop offset="100%" stopColor="#10b981" />       {/* emerald-500 */}
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {/* Phần trăm + text ở giữa */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                                        {safePercentage}%
                                    </span>
                                    <span className="text-sm text-slate-500 mt-1">đã hoàn thành</span>
                                </div>
                            </div>

                            {/* Thông tin chi tiết */}
                            <div className="w-full text-center space-y-4">
                                <div className="flex items-center justify-center gap-8 text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 rounded-xl">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-2xl font-bold text-slate-800">{attendedSessions}</p>
                                            <p className="text-xs text-slate-500">Buổi đã học</p>
                                        </div>
                                    </div>

                                    <div className="h-12 w-px bg-gray-200"></div>

                                    <div className="text-left">
                                        <p className="text-2xl font-bold text-slate-800">{totalSessions}</p>
                                        <p className="text-xs text-slate-500">Tổng số buổi</p>
                                    </div>
                                </div>

                                <p className="text-sm text-slate-600 font-medium">
                                    Còn lại{" "}
                                    <span className="text-xl font-bold text-blue-600">
                                        {remainingSessions}
                                    </span>{" "}
                                    buổi • Kết thúc dự kiến:{" "}
                                    <span className="text-emerald-600 font-semibold">{estimatedEndDate}</span>
                                </p>

                                {overviewLoading && (
                                    <p className="text-xs text-slate-500">Đang tải dữ liệu tiến độ...</p>
                                )}
                                {overviewError && (
                                    <p className="text-xs text-red-600">{overviewError}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w">
                        {/* Card 1: Lịch học trong tuần */}
                        <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-yellow-200 bg-yellow-50/60 px-6 py-5 transition-all hover:border-yellow-300 hover:bg-yellow-50 hover:shadow-md">
                            {/* Left: Tiêu đề + Số + Nút */}
                            <div className="flex flex-col items-start">
                                <p className="text-sm font-medium text-yellow-800">
                                    Minh chứng phép
                                </p>

                                <p className="my-3 text-5xl font-bold text-yellow-600">{leaveEvidenceTotal}</p>

                                <button
                                    onClick={openLeaveEvidence}
                                    className="text-xs font-semibold text-blue-600 hover:text-yellow-700 transition"
                                >
                                    Xem chi tiết →
                                </button>
                            </div>

                            {/* Right: Icon lịch */}
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                                <CalendarDays className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 px-6 py-5 transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md">
                            {/* Left: Tiêu đề + Số + Nút */}
                            <div className="flex flex-col items-start">
                                <p className="text-sm font-medium text-blue-800">
                                    Tiến độ trong tuần
                                </p>

                                <p className="my-3 text-5xl font-bold text-blue-600">0</p>

                                <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
                                    Xem chi tiết →
                                </button>
                            </div>

                            {/* Right: Icon lịch */}
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
                                <FileText className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DescriptionTab;
