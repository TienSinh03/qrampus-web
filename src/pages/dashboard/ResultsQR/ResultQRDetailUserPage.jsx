import React, { useEffect, useMemo, useState } from 'react';
import {
    SquareStar, MapPin, Monitor, Clock, Calendar,
    CheckCircle2, XCircle, Info, User, Phone, Mail, GraduationCap
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAttendance } from '@contexts/AttendanceContext';

const getSafeDate = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const formatDisplayDate = (value) => {
    const parsed = getSafeDate(value);
    if (!parsed) return '--/--/----';
    return format(parsed, 'dd/MM/yyyy', { locale: vi });
};

const formatDisplayTime = (value) => {
    const parsed = getSafeDate(value);
    if (!parsed) return 'N/A';

    return parsed.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'present':
            return 'Thành công';
        case 'absent':
            return 'Vắng';
        case 'excused':
            return 'Có phép';
        case 'not_yet':
            return 'Chưa diễn ra';
        default:
            return 'Không xác định';
    }
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'present':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'absent':
            return 'bg-rose-100 text-rose-700 border-rose-200';
        case 'excused':
            return 'bg-sky-100 text-sky-700 border-sky-200';
        case 'not_yet':
            return 'bg-slate-100 text-slate-700 border-slate-200';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'present':
            return <CheckCircle2 className="w-4 h-4" />;
        case 'absent':
            return <XCircle className="w-4 h-4" />;
        case 'excused':
            return <Info className="w-4 h-4" />;
        case 'not_yet':
            return <Info className="w-4 h-4" />;
        default:
            return null;
    }
};

const ResultQRDetailUserPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { fetchStudentAttendanceProgress } = useAttendance();

    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const detailPayload = useMemo(() => {
        if (location.state?.detailPayload) {
            return location.state.detailPayload;
        }
    }, [location.state]);

    const schedule = detailPayload?.schedule || null;
    const fallbackStudent = detailPayload?.student || {};
    const studentId = fallbackStudent?.studentId || fallbackStudent?.id || null;
    const courseSectionId = detailPayload?.courseSectionId || schedule?.course_section_id || null;
    const practiceGroupId = detailPayload?.practiceGroupId || null;

    useEffect(() => {
        let isMounted = true;

        const loadStudentProgress = async () => {
            if (!studentId || !courseSectionId) {
                if (isMounted) {
                    setError('Thiếu thông tin sinh viên hoặc học phần để xem tiến độ học.');
                    setLoading(false);
                }
                return;
            }

            setLoading(true);
            setError('');

            const result = await fetchStudentAttendanceProgress({
                studentId,
                courseSectionId,
                practiceGroupId,
                page: 1,
                limit: 100,
            });

            if (!isMounted) return;

            if (result.success) {
                setAttendanceData(result.data);
            } else {
                setError(result.error || 'Không thể tải nhật ký điểm danh sinh viên.');
            }

            setLoading(false);
        };

        loadStudentProgress();

        return () => {
            isMounted = false;
        };
    }, [studentId, courseSectionId, practiceGroupId, fetchStudentAttendanceProgress]);

    const records = useMemo(
        () => attendanceData?.records ?? [],
        [attendanceData?.records],
    );

    const firstRecord = records[0] || null;

    const courseCode = firstRecord?.course?.code || schedule?.courseSection?.code || 'N/A';
    const courseName = firstRecord?.course?.name || schedule?.courseSection?.name || 'Chưa có tên môn học';
    const semester = firstRecord?.course?.semester || schedule?.courseSection?.semester || 'N/A';
    const headerClassDate = firstRecord?.classSession?.classDate || schedule?.class_date || null;
    const theoryTotalRecords = attendanceData?.scheduleTypeProgress?.theory?.totalRecords || 0;
    const practiceTotalRecords = attendanceData?.scheduleTypeProgress?.practice?.totalRecords || 0;

    const scheduleTypeLabel = theoryTotalRecords > 0 && practiceTotalRecords > 0 ? 'Lý thuyết + Thực hành'
            : practiceTotalRecords > 0 ? 'Thực hành' : 'Lý thuyết';

    const practiceGroupName =  schedule?.practiceGroup?.group_name || null;

    const studentInfo = {
        full_name: fallbackStudent?.fullName || '--',
        student_code: fallbackStudent?.studentCode || '--',
        email: fallbackStudent?.email || '--',
        class_name: fallbackStudent?.className || '--',
        major: fallbackStudent?.major || '--',
        dob: fallbackStudent?.dob ? formatDisplayDate(fallbackStudent.dob) : '--',
        phone: fallbackStudent?.phone || '--',
        avatar_url: fallbackStudent?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendanceData?.student?.fullName || fallbackStudent?.fullName || 'SV')}`,
    };

    const attendanceHistory = useMemo(() => {
        return records.map((record) => {
            const statusKey = record?.attendance?.status || 'absent';
            const scheduleTypeTag = record?.classSession?.scheduleType === 'practice' ? 'TH' : 'LT';

            return {
                id: record?.classSession?.id,
                session: `[${scheduleTypeTag}] Buổi ${record?.classSession?.sessionNumber || '--'}: ${record?.course?.name || 'Không xác định'}`,
                statusKey,
                status: getStatusLabel(statusKey),
                location: statusKey === 'excused' ? 'Hệ thống xác nhận' : record?.room?.name || 'Chưa xác định',
                scanTime: formatDisplayTime(record?.attendance?.scanTime),
                qrCreated: record?.classSession?.startHour ? record.classSession.startHour.slice(0, 8) : 'N/A',
                date: formatDisplayDate(record?.classSession?.classDate),
                device: 'N/A',
                isStrangeDevice: false,
                isDifferentLocation: false,
            };
        });
    }, [records]);

    if (!detailPayload) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm text-center">
                <p className="text-lg font-semibold text-slate-800">Không tìm thấy dữ liệu sinh viên</p>
                <p className="text-sm text-slate-500 mt-2">Vui lòng quay lại danh sách sinh viên và chọn lại bản ghi cần xem.</p>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm text-center text-slate-600">
                Đang tải nhật ký điểm danh...
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm text-center">
                <p className="text-red-600 font-semibold">{error}</p>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto space-y-6 pb-12">
            <div className="overflow-hidden bg-white shadow-sm">
                <div className="h-10 w-full bg-[linear-gradient(120deg,#7dd3fc_0%,#67e8f9_25%,#a5f3fc_25%,#a5f3fc_50%,#fed7aa_50%,#fed7aa_75%,#fecaca_75%,#fecaca_100%)]" />

                <div className="flex flex-col items-start gap-4 px-6 pb-4 pt-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="-mt-16 h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-indigo-100 shadow-sm">
                            <div className="flex h-full w-full items-center justify-center text-5xl">
                                {practiceTotalRecords > 0 && theoryTotalRecords === 0 ? '💻' : '📚'}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-slate-900">{courseName}</h2>
                            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span className="font-medium">{courseCode}</span>
                                <span className="flex items-center gap-1">
                                    <SquareStar className="w-5 h-5" />
                                    {semester}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-5 h-5" />
                                    {formatDisplayDate(headerClassDate)}
                                </span>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                                    {scheduleTypeLabel}
                                    {practiceGroupName && ` - ${practiceGroupName}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Student Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 text-center flex flex-col items-center">
                            {/* Avatar đặt ở đây cho hợp lý */}
                            <div className="relative mb-4">
                                <img 
                                    src={studentInfo.avatar_url} 
                                    alt="Student Avatar" 
                                    className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-8 h-8 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-black text-slate-800">{studentInfo.full_name}</h3>
                            <p className="text-indigo-500 font-bold text-sm tracking-widest uppercase">MSSV: {studentInfo.student_code}</p>
                        </div>
                        
                        <div className="px-8 pb-8 space-y-4">
                            <div className="p-4 rounded-2xl bg-slate-50 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2"><GraduationCap className="w-4 h-4"/> Lớp:</span>
                                    <span className="text-slate-700 font-bold">{studentInfo.class_name}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2"><User className="w-4 h-4"/> Ngành:</span>
                                    <span className="text-slate-700 font-bold truncate ml-4">{studentInfo.major}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400 flex items-center gap-2"><Calendar className="w-4 h-4"/> Ngày sinh:</span>
                                    <span className="text-slate-700 font-bold">{studentInfo.dob}</span>
                                </div>
                            </div>

                            <div className="space-y-3 px-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><Mail className="w-4 h-4"/></div>
                                    <span className="text-xs font-bold text-slate-600 truncate">{studentInfo.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><Phone className="w-4 h-4"/></div>
                                    <span className="text-xs font-bold text-slate-600">{studentInfo.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Attendance History Timeline */}
                <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Nhật ký điểm danh</h3>
                        <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Real-time Tracking
                        </div>
                    </div>

                    {attendanceHistory.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                            Không có bản ghi điểm danh cho bộ lọc hiện tại.
                        </div>
                    ) : (
                        <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                            {attendanceHistory.map((item) => (
                                <div key={item.id} className="relative pl-12 group">
                                    <div className="absolute left-0 top-1 w-10 h-10 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm group-hover:border-indigo-400 transition-colors z-10">
                                        <Calendar className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                                    </div>

                                    <div className="p-6 rounded-3xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                            <div>
                                                <h4 className="font-black text-slate-800 text-lg">{item.session}</h4>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Ngày thực hiện:</span>
                                                    <span className="text-xs font-bold text-slate-500">{item.date}</span>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[11px] font-black border uppercase tracking-widest ${getStatusStyle(item.statusKey)}`}>
                                                {getStatusIcon(item.statusKey)}
                                                {item.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 pt-4 border-t border-slate-100/50">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Thời gian quét</span>
                                                        <span className="text-sm font-black text-slate-700">{item.scanTime}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">QR được tạo lúc</span>
                                                        <span className="text-sm font-black text-slate-700">{item.qrCreated}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                                                        <MapPin className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Vị trí ghi nhận</span>
                                                        <span className="text-sm font-black text-slate-700 truncate max-w-[180px]">{item.location}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                                        <Monitor className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Thiết bị sử dụng</span>
                                                        <span className="text-sm font-black text-slate-700">{item.device}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                                                    <span className="text-[10px] font-bold uppercase text-slate-500">Thiết bị lạ</span>
                                                    <span className={`text-xs font-bold ${item.isStrangeDevice ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                        {item.isStrangeDevice ? 'Có' : 'Không'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                                                    <span className="text-[10px] font-bold uppercase text-slate-500">Vị trí khác</span>
                                                    <span className={`text-xs font-bold ${item.isDifferentLocation ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                        {item.isDifferentLocation ? 'Có' : 'Không'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultQRDetailUserPage;