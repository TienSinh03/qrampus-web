import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Users, BookOpen, Layers, Play, Square, UserCheck, Maximize2, AlertCircle, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';
import { useAttendance } from '@contexts/AttendanceContext';
import { useTeacherSchedule } from '@contexts/TeacherScheduleContext';

const FinalAttendancePage = () => {
    const [schedule, setSchedule] = useState(null);
    const [loadError, setLoadError] = useState(false);
    const location = useLocation();

    const {
        activeSession,
        currentQR,
        createSession,
        closeSession,
        getNextQR,
        checkActiveSession,
        syncActiveSession,
        createLoading,
        closeLoading,
        setActiveSession
    } = useAttendance();
    const { fetchClassSessionDetail } = useTeacherSchedule();

    const [isStarted, setIsStarted] = useState(false);
    const [sessionClockTick, setSessionClockTick] = useState(0);
    const [duration, setDuration] = useState(5); 
    const QR_INTERVAL = 10; 

    const isRefreshingQR = useRef(false);
    const isEndingSession = useRef(false);
    const hasLoaded = useRef(false);

    // backup: load schedule and check for active session on mount
    useEffect(() => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;

        const loadAndResumeSession = async () => {
            try {
                const savedSchedule = sessionStorage.getItem('attendanceSchedule');
                const routeSchedule = location.state?.schedule;
                const initialSchedule = routeSchedule || (savedSchedule ? JSON.parse(savedSchedule) : null);

                if (initialSchedule) {
                    let detailedSchedule = initialSchedule;

                    try {
                        const response = await fetchClassSessionDetail(initialSchedule.id);
                        if (response?.success && response.data) {
                            detailedSchedule = response.data;
                        }
                    } catch {
                        // fall back to the schedule passed from study-session
                    }

                    setSchedule(detailedSchedule);

                    let activeSessionData = null;
                    try {
                        activeSessionData = await syncActiveSession(detailedSchedule.id);
                    } catch {
                        activeSessionData = checkActiveSession(detailedSchedule.id);
                    }

                    if (activeSessionData) {

                        setActiveSession(activeSessionData);

                        const now = new Date();
                        const expiresAt = new Date(activeSessionData.expires_at);
                        const remainingSeconds = Math.max(0, Math.floor((expiresAt - now) / 1000));
                        
                        if (remainingSeconds > 0) {

                            const sessionDurationMinutes = activeSessionData.session_duration_minutes;
                            setDuration(sessionDurationMinutes);
                        
                            console.log('Fetching current QR for session:', activeSessionData.id);
                            await getNextQR(activeSessionData.id);

                            setIsStarted(true);
                        } else {
                            console.log('Active session has expired');
                        }
                    }
                } else {
                    setLoadError(true);
                }
            } catch (error) {
                console.error('Error loading schedule/session:', error);
                setLoadError(true);
            }
        };

        loadAndResumeSession();
    }, [checkActiveSession, fetchClassSessionDetail, getNextQR, location.state?.schedule, setActiveSession, syncActiveSession]);

    const classInfo = schedule ? {
        maHocPhan: schedule.courseSection?.code || "N/A",
        tenMonHoc: schedule.courseSection?.name || "N/A",
        tietHoc: `${schedule.start_hour?.substring(0, 5) || ''} - ${schedule.end_hour?.substring(0, 5) || ''}`,
        giangVien: schedule.personnel?.full_name || "N/A",
        siSo: schedule.courseSection?.max_students || 0,
        hinhThuc: schedule.schedule_type === 'theory' ? 'Lý thuyết' : 'Thực hành',
        nhom: schedule.practiceGroup?.group_name || schedule.practiceGroup?.groupName || "",
        phongHoc: schedule.room?.room_name || schedule.room?.roomName || "N/A",
        classDate: schedule.class_date || schedule.classDate,
        sessionNumber: schedule.session_number || schedule.sessionNumber,
        classSessionId: schedule.id
    } : null;

    const [screen, setScreen] = useState({
        w: window.innerWidth,
        h: window.innerHeight
    });

    useEffect(() => {
        const resize = () => {
            setScreen({
                w: window.innerWidth,
                h: window.innerHeight
            });
        };
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        if (!isStarted) return;

        const timer = setInterval(() => {
            setSessionClockTick((prev) => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isStarted]);

    const totalDurationSeconds = useMemo(() => {
        if (activeSession?.session_duration_minutes) {
            return Number(activeSession.session_duration_minutes) * 60;
        }
        return duration * 60;
    }, [activeSession?.session_duration_minutes, duration]);

    const timeLeft = useMemo(() => {
        void sessionClockTick;

        if (!isStarted) return 0;

        if (!activeSession?.expires_at) {
            return totalDurationSeconds;
        }

        const expiresAtMs = new Date(activeSession.expires_at).getTime();
        if (Number.isNaN(expiresAtMs)) return 0;

        return Math.max(0, Math.floor((expiresAtMs - Date.now()) / 1000));
    }, [isStarted, activeSession?.expires_at, totalDurationSeconds, sessionClockTick]);

    const qrTimeLeft = useMemo(() => {
        void sessionClockTick;

        if (!isStarted || !currentQR?.expires_at) return 0;

        const qrExpiresAtMs = new Date(currentQR.expires_at).getTime();
        if (Number.isNaN(qrExpiresAtMs)) return QR_INTERVAL;

        return Math.max(0, Math.floor((qrExpiresAtMs - Date.now()) / 1000));
    }, [isStarted, currentQR?.expires_at, QR_INTERVAL, sessionClockTick]);

    const progress = isStarted && totalDurationSeconds > 0
        ? (timeLeft / totalDurationSeconds) * 100
        : 0;

    // Xử lý qr tiếp theo khi hết hạn 
    const handleGetNextQR = useCallback(async () => {
        if (!activeSession || isRefreshingQR.current) {
            return;
        }
        
        isRefreshingQR.current = true;

        try {
            const result = await getNextQR(activeSession.id);
            if (!result) {
                setIsStarted(false);
            }
        } catch (error) {
            console.error('Error refreshing QR:', error);
            setIsStarted(false);
        } finally {
            isRefreshingQR.current = false;
        }

    }, [activeSession, getNextQR]);

    // Xử lý kết thúc phiên điểm danh
    const handleSessionEnd = useCallback(async () => {
        if (activeSession) {
            await closeSession(activeSession.id);
        }
        setIsStarted(false);
    }, [activeSession, closeSession]);

    // đồng bộ kết thúc phiên theo expires_at
    useEffect(() => {
        if (!isStarted || !activeSession || timeLeft > 0 || isEndingSession.current) {
            return;
        }

        isEndingSession.current = true;
        handleSessionEnd().finally(() => {
            isEndingSession.current = false;
        });
    }, [isStarted, timeLeft, activeSession, handleSessionEnd]);

    // tự động refresh QR theo expires_at thực tế
    useEffect(() => {
        if (!isStarted || !activeSession || !currentQR || qrTimeLeft > 0) {
            return;
        }

        handleGetNextQR();
    }, [isStarted, qrTimeLeft, activeSession, currentQR, currentQR?.id, handleGetNextQR]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // Xử lý bắt đầu phiên điểm danh
    const handleStart = async () => {
        if (!classInfo?.classSessionId) {
            console.error('Missing class session ID');
            return;
        }

        const result = await createSession(
            classInfo.classSessionId,
            duration, 
            QR_INTERVAL 
        );

        if (result) {
            setIsStarted(true);
        }
    };

    const handleStop = async () => {
        if (activeSession) {
            const confirmed = window.confirm('Bạn có chắc muốn dừng phiên điểm danh?');
            if (confirmed) {
                await handleSessionEnd();
            }
        } else {
            setIsStarted(false);
        }
    };

    const qrSize = Math.min(
        screen.w * 0.9,
        screen.h * 0.8,
        900
    );

    // load lỗi
    if (loadError || !schedule) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                        Không tìm thấy thông tin lịch học
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Vui lòng quay lại trang lịch học và chọn buổi học để tạo điểm danh.
                    </p>
                    <button
                        onClick={() => window.close()}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Đóng trang này
                    </button>
                </div>
            </div>
        );
    }

    if (!classInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="text-slate-700 min-h-screen">

            {!isStarted ? (
                /* ================= SETUP ================= */
                <div className="mx-auto space-y-8">

                    {/* CLASS INFO */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                            <h1 className="text-2xl font-semibold text-gray-800">
                                {classInfo.tenMonHoc}
                            </h1>
                            <p className="text-sm text-slate-500 mt-2">
                                Mã học phần: <span className="font-semibold text-slate-700">{classInfo.maHocPhan}</span>
                            </p>
                        </div>

                        {/* Main Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y">
                            {[
                                { icon: Users, label: "Sĩ số", value: `${classInfo.siSo} SV` },
                                { icon: BookOpen, label: "Hình thức", value: classInfo.hinhThuc },
                                { icon: Layers, label: "Nhóm", value: classInfo.nhom || "Không có" },
                                { icon: UserCheck, label: "Giảng viên", value: classInfo.giangVien },
                            ].map((item, i) => (
                                <div key={i} className="p-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                        <item.icon size={14} />
                                        {item.label}
                                    </div>
                                    <p className="font-semibold text-gray-800 truncate">{item.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Additional Details */}
                        <div className="border-t bg-slate-50 p-4 space-y-3">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Phòng học</p>
                                    <p className="text-sm font-semibold text-gray-800">{classInfo.phongHoc}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Tiết học</p>
                                    <p className="text-sm font-semibold text-gray-800">{classInfo.tietHoc}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Ngày học</p>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {classInfo.classDate 
                                            ? new Date(classInfo.classDate).toLocaleDateString('vi-VN')
                                            : "N/A"
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1">Buổi học</p>
                                    <p className="text-sm font-semibold text-gray-800">Buổi {classInfo.sessionNumber || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CONTROL */}
                    <div className="max-w-2xl mx-auto space-y-8 py-8">

                        {/* INFO SECTION */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">ℹ️ Hướng dẫn sử dụng</h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li>• Chọn thời gian điểm danh (2, 3 hoặc 5 phút)</li>
                                <li>• Click <span className="font-semibold">"Bắt đầu điểm danh"</span> để khởi động phiên</li>
                                <li>• Mã QR sẽ tự động cập nhật theo khoảng thời gian được cài đặt</li>
                                <li>• Sinh viên sẽ quét mã QR để điểm danh</li>
                                <li>• Nhấn <span className="font-semibold">"Dừng phiên"</span> để kết thúc khi hoàn thành</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold mb-4 text-center">
                                ⏱️ Chọn thời gian điểm danh
                            </h2>

                            <div className="grid grid-cols-3 gap-4">
                                {[2, 3, 5].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setDuration(t)}
                                        disabled={createLoading}
                                        className={`
                                            py-4 rounded-xl border-2 font-semibold transition
                                            ${duration === t
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg'
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'}
                                            ${createLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}
                                    >
                                        {t} phút
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* STATISTICS */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4 text-center">
                                <p className="text-xs text-purple-600 font-medium mb-1">Sĩ số lớp</p>
                                <p className="text-3xl font-bold text-purple-700">{classInfo.siSo}</p>
                                <p className="text-xs text-purple-500 mt-1">sinh viên</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4 text-center">
                                <p className="text-xs text-orange-600 font-medium mb-1">Thời gian điểm danh</p>
                                <p className="text-3xl font-bold text-orange-700">{duration}</p>
                                <p className="text-xs text-orange-500 mt-1">phút</p>
                            </div>
                            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4 text-center">
                                <p className="text-xs text-indigo-600 font-medium mb-1">Hình thức</p>
                                <p className="text-2xl font-bold text-indigo-700">{classInfo.hinhThuc}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            disabled={createLoading}
                            className="w-full py-5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {createLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Đang tạo phiên...
                                </>
                            ) : (
                                <>
                                    <Play size={20} />
                                    Bắt đầu điểm danh
                                </>
                            )}
                        </button>

                    </div>
                </div>
            ) : (
                /* ================= RUNNING ================= */
                <div className="fixed inset-0 bg-white z-50 flex flex-col">

                    {/* TOP BAR */}
                    <div className="flex justify-between items-center px-4 py-3 border-b">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                <Maximize2 size={18} className="text-emerald-500" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium line-clamp-1">{classInfo.tenMonHoc}</p>
                                <p className="text-slate-400 text-xs">{classInfo.nhom}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleStop}
                                disabled={closeLoading}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
                            >
                                {closeLoading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Đang đóng...
                                    </>
                                ) : (
                                    <>
                                        <Square size={14} />
                                        Dừng phiên
                                    </>
                                )}
                            </button>

                            <div className="text-right">
                                <p className="text-xs text-slate-400">Thời gian</p>
                                <div className={`text-2xl font-semibold ${timeLeft < 60 ? 'text-red-500' : ''}`}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>                            
                        </div>
                    </div>

                    {/* CENTER */}
                    <div className="flex-1 flex flex-col items-center justify-center px-4">

                        {/* QR */}
                        <div className="bg-white p-4 rounded-2xl border shadow-sm">
                            {currentQR ? (
                                <QRCodeSVG
                                    value={JSON.stringify({
                                        qr_token: currentQR.qr_token,
                                        attendance_session_id: activeSession?.id,
                                        qr_instance_id: currentQR.id,
                                        course_section_id: schedule?.course_section_id,
                                    })}
                                    size={qrSize}
                                    level="M"
                                />
                            ) : (
                                <div 
                                    className="flex items-center justify-center"
                                    style={{ width: qrSize, height: qrSize }}
                                >
                                    <Loader2 className="animate-spin text-gray-400" size={48} />
                                </div>
                            )}
                        </div>

                        {/* TEXT */}
                        <div className="text-center mt-4 space-y-2">
                            <p className="text-sm text-slate-400">
                                Quét mã để điểm danh
                            </p>
                            {currentQR && (
                                <p className="text-xs text-slate-300">
                                    Mã QR sẽ làm mới sau: {qrTimeLeft}s
                                </p>
                            )}
                        </div>

                        {/* PROGRESS */}
                        <div className="w-full max-w-md mt-4">
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ${
                                        timeLeft < 60 ? 'bg-red-500' : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default FinalAttendancePage;