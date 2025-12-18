import React, { useState } from "react";
import {
    Calendar,
    Clock,
    User,
    CheckCircle2,
    AlertTriangle,
    QrCode,
    Filter,
    ChevronDown,
} from "lucide-react";

export default function TeacherAttendancePage() {
    const [selectedSemester, setSelectedSemester] = useState("Học kỳ I - 2025-2026");
    const [selectedMonth, setSelectedMonth] = useState("Tất cả");

    // Giả sử đây là dữ liệu của 1 giảng viên đang đăng nhập
    const teacherInfo = {
        name: "TS. Nguyễn Văn An",
        employeeCode: "GV00124",
        totalSessions: 58,
        onTimeSessions: 54,
        lateOrManual: 4,
    };

    const sessions = [
        {
            date: "10/12/2025",
            time: "07:30 - 09:10",
            courseCode: "INT3306 3",
            courseName: "Phát triển ứng dụng Web",
            room: "301-B3",
            createdAt: "07:25", // giờ tạo QR
            status: "onTime", // onTime | late | manual | missing
        },
        {
            date: "09/12/2025",
            time: "09:20 - 11:00",
            courseCode: "INT3306 3",
            courseName: "Phát triển ứng dụng Web",
            room: "301-B3",
            createdAt: "09:30",
            status: "late",
        },
        {
            date: "08/12/2025",
            time: "13:30 - 15:10",
            courseCode: "INT3401",
            courseName: "Lập trình di động",
            room: "204-B4",
            createdAt: null,
            status: "manual",
            note: "Đã chấm tay do quên tạo QR",
        },
        // ... thêm nhiều buổi khác
    ];

    const filteredSessions = sessions.filter((s) => {
        if (selectedMonth === "Tất cả") return true;
        const month = new Date(s.date.split("/").reverse().join("-")).toLocaleString(
            "vi-VN",
            { month: "long" }
        );
        return month === selectedMonth;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "onTime":
                return (
                    <span className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                        <CheckCircle2 size={16} className="mr-1" /> Đúng giờ
                    </span>
                );
            case "late":
                return (
                    <span className="flex items-center text-orange-700 bg-orange-100 px-3 py-1 rounded-full text-sm font-medium">
                        <AlertTriangle size={16} className="mr-1" /> Tạo QR muộn
                    </span>
                );
            case "manual":
                return (
                    <span className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm font-medium">
                        <AlertTriangle size={16} className="mr-1" /> Chấm tay
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <QrCode size={36} />
                        Chấm Công Điểm Danh QR - Cá Nhân
                    </h1>
                    <p className="mt-2 text-blue-100">
                        Theo dõi lịch sử tạo mã QR điểm danh của bạn
                    </p>
                </div>
            </div>

            <div className="mx-auto">
                {/* Lecturer Info Card */}
                <div className="bg-white shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {teacherInfo.name.charAt(4)}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {teacherInfo.name}
                            </h2>
                            <p className="text-gray-600">Mã giảng viên: {teacherInfo.employeeCode}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <p className="text-3xl font-bold text-blue-600">{teacherInfo.totalSessions}</p>
                                <p className="text-sm text-gray-600">Tổng tiết</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl">
                                <p className="text-3xl font-bold text-green-600">{teacherInfo.onTimeSessions}</p>
                                <p className="text-sm text-gray-600">Tạo QR đúng giờ</p>
                            </div>
                            <div className="bg-red-50 p-4 rounded-xl">
                                <p className="text-3xl font-bold text-red-600">{teacherInfo.lateOrManual}</p>
                                <p className="text-sm text-gray-600">Muộn / Chấm tay</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter nổi bật theo kỳ và tháng */}
                <div className="p-6 rounded-2xl shadow-lg mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <Filter size={24} /> Lọc theo kỳ học & tháng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">





                        <div className="grid items-center">
                            <select
                                value={selectedSemester}
                                onChange={(e) => setSelectedSemester(e.target.value)}
                                className="
                                    col-start-1 row-start-1
                                    appearance-none 
                                    text-gray font-semibold 
                                    px-8 py-3 pr-12
                                    border border-gray-300
                                    transition-all duration-200
                                    cursor-pointer text-sm
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                                "
                            >
                                <option>Học kỳ I - 2025-2026</option>
                                <option>Học kỳ II - 2024-2025</option>
                                <option>Học kỳ I - 2024-2025</option>
                            </select>

                            <ChevronDown
                                className="col-start-1 row-start-1 justify-self-end mr-4 w-6 h-6 text-gray-500 pointer-events-none"
                            />
                        </div>
                        <div className="grid items-center">
                            <select
                                value={selectedMonth}
                                onChange={(e) => selectedMonth(e.target.value)}
                                className="
                                    col-start-1 row-start-1
                                    appearance-none 
                                    text-gray font-semibold 
                                    px-8 py-3 pr-12
                                    border border-gray-300
                                    transition-all duration-200
                                    cursor-pointer text-sm
                                    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                                "
                            >
                            <option>Tất cả</option>
                            <option>Tháng Mười Hai</option>
                            <option>Tháng Mười Một</option>
                            <option>Tháng Mười</option>
                            </select>

                            <ChevronDown
                                className="col-start-1 row-start-1 justify-self-end mr-4 w-6 h-6 text-gray-500 pointer-events-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Sessions Table */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b">
                        <h3 className="text-xl font-bold">Lịch sử các tiết dạy</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ngày</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Môn học</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phòng</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Giờ tạo QR</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSessions.map((session, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-medium">{session.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <Clock size={16} />
                                                {session.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium">{session.courseCode}</p>
                                                <p className="text-sm text-gray-600">{session.courseName}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{session.room}</td>
                                        <td className="px-6 py-4">
                                            {session.createdAt ? (
                                                <span className="text-sm">{session.createdAt}</span>
                                            ) : (
                                                <span className="text-red-600 text-sm">— Chưa tạo —</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {getStatusBadge(session.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}