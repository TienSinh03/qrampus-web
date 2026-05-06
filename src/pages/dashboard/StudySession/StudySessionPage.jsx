import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DescriptionTab from "./tabs/DescriptionTab";
import StudentStudySession from "./tabs/StudentStudySession";
import ScheduleStudySession from "./tabs/ScheduleStudySession";
import QRCodeTab from "./tabs/QRCodeTab";
import { FileImage, FileUser, Calendar, QrCode, SquareStar, ScanQrCode, AlertCircle, Activity } from "lucide-react";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { useAttendance } from "@contexts/AttendanceContext";

const StudySessionPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState("description");
    const { checkActiveSession, syncActiveSession } = useAttendance();
    
    // Get schedule from navigate state
    const scheduleFromState = location.state?.schedule;
    const [schedule, setSchedule] = useState(scheduleFromState || null);
    const [hasActiveSession, setHasActiveSession] = useState(schedule?.has_active_session || false);
    const [checkingSession, setCheckingSession] = useState(false);
    // If no schedule in state, you might want to redirect or fetch it
    useEffect(() => {
        if (!scheduleFromState) {
            console.warn('No schedule data found in navigation state');
            // Optional: redirect back or fetch schedule by ID from URL params
        } else {
            setSchedule(scheduleFromState);
        }
    }, [scheduleFromState]);

    // Kiểm tra active session khi load page hoặc khi schedule thay đổi
    useEffect(() => {
        if (!schedule?.id) return;

        if (schedule?.has_active_session) {
            setHasActiveSession(true);
            return;
        }

        setCheckingSession(true);
        const check = async () => {
            try {
                let activeSessionData = checkActiveSession(schedule.id);
                if (!activeSessionData) {
                    activeSessionData = await syncActiveSession(schedule.id);
                }
                setHasActiveSession(!!activeSessionData);
            } catch (error) {
                console.error('Error checking active session:', error);
                setHasActiveSession(false);
            } finally {
                setCheckingSession(false);
            }
        };
        check();
    }, [schedule?.id, checkActiveSession, syncActiveSession, schedule?.has_active_session]);

    // Lắng nghe realtime khi GV tạo/đóng phiên điểm danh để cập nhật UI ngay lập tức
    const handleAttendanceClick = () => {
        // Lưu schedule vào sessionStorage
        sessionStorage.setItem('attendanceSchedule', JSON.stringify(schedule));
        
        if (hasActiveSession) {
            // Nếu có active session, mở tab với session đang chạy
            window.open('/dashboard/results-qr-extend-student', '_blank');
        } else {
            // Nếu chưa có, mở tab để tạo mới
            window.open('/dashboard/results-qr-extend-student', '_blank');
        }
    };

    const renderTab = () => {
        if (!schedule) {
            return (
                <div className="flex items-center justify-center p-8 text-gray-500">
                    <div className="text-center">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p>Không tìm thấy thông tin lịch học</p>
                        <button 
                            onClick={() => navigate('/dashboard/schedule')}
                            className="mt-4 btn-blue"
                        >
                            Quay lại lịch học
                        </button>
                    </div>
                </div>
            );
        }

        switch (currentTab) {
            case "description":
                return <DescriptionTab schedule={schedule} />;
            case "student":
                return <StudentStudySession schedule={schedule} />;
            case "schedule":
                return <ScheduleStudySession schedule={schedule} />;
            case "qr":
                return <QRCodeTab schedule={schedule} />;
            default:
                return <DescriptionTab schedule={schedule} />;
        }
    };

    // Format display data from schedule
    const courseCode = schedule?.courseSection?.code || 'N/A';
    const courseName = schedule?.courseSection?.name || 'Chưa có tên môn học';
    const semester = schedule?.courseSection?.semester || 'N/A';
    const scheduleType = schedule?.schedule_type === 'theory' ? 'Lý thuyết' : 'Thực hành';
    const practiceGroupName = schedule?.practiceGroup?.group_name || null;

    return (
      <div className="mx-auto">
            {/* HEADER - bạn giữ nguyên code UI ở trên của bạn */}
            <div className="overflow-hidden bg-white shadow-sm">
                {/* Cover */}
                <div className="h-10 w-full bg-[linear-gradient(120deg,#7dd3fc_0%,#67e8f9_25%,#a5f3fc_25%,#a5f3fc_50%,#fed7aa_50%,#fed7aa_75%,#fecaca_75%,#fecaca_100%)]" />

                {/* Info row */}
                <div className="flex flex-col items-start gap-4 px-6 pb-4 pt-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar card */}
                        <div className="-mt-16 h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-indigo-100 shadow-sm">
                            <div className="flex h-full w-full items-center justify-center text-5xl">
                                {schedule?.schedule_type === 'practice' ? '💻' : '📚'}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                {courseName}
                            </h2>
                            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span className="font-medium">{courseCode}</span>
                                <span className="flex items-center gap-1">
                                    <SquareStar className="w-5 h-5" />
                                    {semester}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-5 h-5" />
                                    {schedule?.class_date && format(parseISO(schedule.class_date), 'dd/MM/yyyy', { locale: vi })}
                                </span>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                    {scheduleType}
                                    {practiceGroupName && ` - ${practiceGroupName}`}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-2 transition-all duration-200 w-full md:w-auto ${
                            hasActiveSession 
                                ? 'border border-orange-500 text-orange-500 hover:bg-orange-50 focus:ring-orange-500'
                                : 'border border-teal-500 text-teal-500 hover:bg-teal-50 focus:ring-teal-500'
                        }`}
                        title={hasActiveSession ? "Xem phiên điểm danh đang hoạt động" : "Tạo điểm danh mới"} 
                        onClick={handleAttendanceClick}
                        disabled={checkingSession}
                    >
                        {checkingSession ? (
                            <>
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span>Đang kiểm tra...</span>
                            </>
                        ) : hasActiveSession ? (
                            <>
                                <Activity className="w-5 h-5 animate-pulse" />
                                <span>Phiên đang hoạt động</span>
                            </>
                        ) : (
                            <>
                                <ScanQrCode className="w-5 h-5" />
                                <span>Tạo điểm danh</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 py-3 border-t border-slate-100 md:hidden">
                    <select
                        value={currentTab}
                        onChange={(e) => setCurrentTab(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-violet-500"
                    >
                        <option value="description"> Mô tả</option>
                        <option value="student">Sinh viên</option>
                        <option value="schedule">Lịch học</option>
                        <option value="qr">Lịch sử điểm danh</option>
                    </select>
                </div>
                <div className="hidden md:flex border-t border-slate-100 px-6">
                    <button
                        onClick={() => setCurrentTab("description")}
                        className={`relative -mb-px mr-4 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium ${currentTab === "description"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-slate-500"
                            }`}
                    >
                        <FileImage className="w-4 h-4" /> Mô tả
                    </button>

                    <button
                        onClick={() => setCurrentTab("student")}
                        className={`relative -mb-px mr-4 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium ${currentTab === "student"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-slate-500"
                            }`}
                    >
                        <FileUser className="w-4 h-4" /> Sinh viên
                    </button>

                    <button
                        onClick={() => setCurrentTab("schedule")}
                        className={`relative -mb-px mr-4 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium ${currentTab === "schedule"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-slate-500"
                            }`}
                    >
                        <Calendar className="w-4 h-4" /> Lịch học
                    </button>

                    <button
                        onClick={() => setCurrentTab("qr")}
                        className={`relative -mb-px mr-4 flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium ${currentTab === "qr"
                            ? "border-violet-500 text-violet-600"
                            : "border-transparent text-slate-500"
                            }`}
                    >
                        <QrCode className="w-4 h-4" /> Lịch sử điểm danh
                    </button>
                </div>
            </div>
            {/* --- CONTENT --- */}
            <div>{renderTab()}</div>


        </div>
    );
};

export default StudySessionPage;
