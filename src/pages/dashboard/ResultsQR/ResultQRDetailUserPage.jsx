import React from 'react';
import { 
  SquareStar, MapPin, Monitor, Clock, Calendar,
  CheckCircle2, XCircle, Info, ShieldAlert, User, Phone, Mail, BookOpen, GraduationCap
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const ResultQRDetailUserPage = () => {
    const schedules = [
        {
            id: 1,
            class_date: '2026-04-06',
            schedule_type: 'practice',
            courseSection: {
                code: '42345677843',
                name: 'LẬP TRÌNH THIẾT BỊ DI ĐỘNG',
                semester: 'HK1 2025-2026'
            },
            practiceGroup: {
                group_name: 'Nhóm 02'
            }
        }
    ];

    const schedule = schedules[0];
    const courseCode = schedule?.courseSection?.code || 'N/A';
    const courseName = schedule?.courseSection?.name || 'Chưa có tên môn học';
    const semester = schedule?.courseSection?.semester || 'N/A';
    const scheduleType = schedule?.schedule_type === 'theory' ? 'Lý thuyết' : 'Thực hành';
    const practiceGroupName = schedule?.practiceGroup?.group_name || null;

    // Dữ liệu Sinh viên chuẩn theo Database Schema 
    const studentInfo = {
        full_name: 'Trần Minh Tiến',
        student_code: '21010611',
        email: 'tien.tm21010611@st.hcmuaf.edu.vn',
        class_name: 'DH21DT',
        major: 'Kỹ thuật phần mềm',
        dob: '15/05/2003',
        phone: '0987 654 321',
        avatar_url: 'https://i.pravatar.cc/150?img=7', // avatar_url từ database 
        practice_group: 'Nhóm 02'
    };

    // Dữ liệu Lịch sử điểm danh chi tiết
    const attendanceHistory = [
        { 
            session: 'Buổi 1: Tổng quan Android', 
            status: 'Thành công', 
            location: 'Phòng C102 - Khu C', 
            scanTime: '08:05:22', 
            qrCreated: '08:00:00',
            date: '06/04/2026',
            device: 'iPhone 15 Pro',
            isStrangeDevice: false,
            isDifferentLocation: false
        },
        { 
            session: 'Buổi 2: React Native Basics', 
            status: 'Vắng', 
            location: 'Chưa xác định', 
            scanTime: 'N/A', 
            qrCreated: '08:00:00',
            date: '13/04/2026',
            device: 'N/A',
            isStrangeDevice: false,
            isDifferentLocation: false
        },
        { 
            session: 'Buổi 3: Component & Props', 
            status: 'Có phép', 
            location: 'Hệ thống xác nhận đơn', 
            scanTime: 'N/A', 
            qrCreated: '08:00:00',
            date: '20/04/2026',
            device: 'N/A',
            isStrangeDevice: false,
            isDifferentLocation: false
        },
        { 
            session: 'Buổi 4: State Management', 
            status: 'Thành công', 
            location: 'Phòng B201', 
            scanTime: '08:12:45', 
            qrCreated: '08:00:00',
            date: '27/04/2026',
            device: 'Windows PC (Chrome)',
            isStrangeDevice: true,
            isDifferentLocation: true
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Thành công': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Vắng': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'Có phép': return 'bg-sky-100 text-sky-700 border-sky-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Thành công': return <CheckCircle2 className="w-4 h-4" />;
            case 'Vắng': return <XCircle className="w-4 h-4" />;
            case 'Có phép': return <Info className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="mx-auto space-y-6 pb-12">
            {/* Header Section */}
            <div className="overflow-hidden bg-white shadow-sm">
                <div className="h-10 w-full bg-[linear-gradient(120deg,#7dd3fc_0%,#67e8f9_25%,#a5f3fc_25%,#a5f3fc_50%,#fed7aa_50%,#fed7aa_75%,#fecaca_75%,#fecaca_100%)]" />

                <div className="flex flex-col items-start gap-4 px-6 pb-4 pt-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
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

                    <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {attendanceHistory.map((item, index) => (
                            <div key={index} className="relative pl-12 group">
                                {/* Timeline Node */}
                                <div className="absolute left-0 top-1 w-10 h-10 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center shadow-sm group-hover:border-indigo-400 transition-colors z-10">
                                    <Calendar className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                                </div>
                                
                                {/* Item Card */}
                                <div className="p-6 rounded-3xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg">{item.session}</h4>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Ngày thực hiện:</span>
                                                <span className="text-xs font-bold text-slate-500">{item.date}</span>
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl text-[11px] font-black border uppercase tracking-widest ${getStatusStyle(item.status)}`}>
                                            {getStatusIcon(item.status)}
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
                </div>
            </div>
        </div>
    );
};

export default ResultQRDetailUserPage;