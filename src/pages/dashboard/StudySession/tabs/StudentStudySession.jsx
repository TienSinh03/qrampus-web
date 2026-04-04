import React, { useState, useMemo, useEffect } from "react";
import {
    Edit, Eye, IdCard, Table2,
    ArrowDown, ArrowUp, FileSpreadsheet, FilterX,
    FileSearchIcon, Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useClassSessionStudents } from "@contexts/ClassSessionStudentsContext";

const StudentStudySession = ({ schedule }) => {
    const [view, setView] = useState("table");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const { students, loading, error, fetchStudents } = useClassSessionStudents();

    useEffect(() => {
        if (schedule?.id) {
            fetchStudents(schedule.id);
        }
    }, [schedule?.id, fetchStudents]);

    // FILTER SEARCH
    const filteredStudents = useMemo(() => {
        return students.filter((s) =>
            `${s.fullName} ${s.studentCode} ${s.email} ${s.className}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search, students]);

    const StatusBadge = ({ status }) => {
        const COLORS = {
            active: "text-green-600 bg-green-100",
            inactive: "text-red-600 bg-red-100",
            pending: "text-yellow-600 bg-yellow-100",
        };
        const LABELS = {
            active: "Đang hoạt động",
            inactive: "Tạm ngưng",
            pending: "Chờ xử lý",
        };
        return (
            <span className={`px-2 py-1 rounded-md text-sm font-medium ${COLORS[status] || 'text-gray-600 bg-gray-100'}`}>
                {LABELS[status] || status}
            </span>
        );
    };
    
    if (loading) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                    <p className="text-gray-600">Đang tải danh sách sinh viên...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm">
            {/* Switch View + Search */}


            <div className="bg-white">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
                    </svg>
                    <span>Bộ lọc thống kê</span>
                    <button onClick={() => setExpanded(!expanded)} className="flex items-center text-blue-600 hover:text-blue-800 ml-auto">
                        {expanded ? (
                            <>
                                <ArrowUp size={16} className="mr-1" />
                                Thu gọn
                            </>
                        ) : (
                            <>
                                <ArrowDown size={16} className="mr-1" />
                                    Mở rộng
                            </>
                        )}
                    </button>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã số sinh viên
                        </label>
                        <input
                            type="text"
                            placeholder="Ví dụ: 4203001549"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            className="w-full rounded-lg border px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Khoa/Viện
                        </label>
                        <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Khoa Công nghệ thông tin</option>
                            <option>Khoa Điện tử - Viễn thông</option>
                            <option>Khoa Cơ khí</option>
                            <option>Khoa Kinh tế</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Trạng thái
                        </label>
                        <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Đang hoạt động</option>
                            <option>Tạm ngưng</option>
                            <option>Đã xóa</option>
                        </select>
                    </div>
                    {expanded && (
                        <>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mail
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: ...."
                                    className="w-full rounded-lg border px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: ...."
                                    className="w-full rounded-lg border px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    placeholder="Ví dụ: ...."
                                    className="w-full rounded-lg border px-3 py-2"
                                />
                            </div>
                        </>
                    )}

                </div>
                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-start md:justify-end gap-4">
                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                        {/* Xóa bộ lọc */}
                        <button
                            className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
                        >
                            <FileSearchIcon className="w-5 h-5" />
                            Tìm kiếm
                        </button>

                        {/* Export Excel */}
                        <button
                            className="flex items-center gap-2 border border-emerald-400 text-emerald-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                        >
                            <FileSpreadsheet className="w-5 h-5" />
                            Export Excel
                        </button>

                        {/* Xóa bộ lọc */}
                        <button
                            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
                        >
                            <FilterX className="w-5 h-5" />
                            Xóa bộ lọc
                        </button>

                    </div>
                </div>
            </div>

            <div className="mt-6 mb-6 flex items-center gap-4">
                <div className="inline-flex rounded-lg bg-gray-200 p-1 shadow-sm">
                    {[
                        { type: "table", icon: Table2, label: "Table" },
                        { type: "card", icon: IdCard, label: "Card" },
                    ].map(({ type, icon: Icon, label }) => {
                        const active = view === type;

                        return (
                            <button
                                key={type}
                                onClick={() => setView(type)}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all
                                     ${active
                                        ? "bg-blue-400 text-white shadow"
                                        : "text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                <Icon className="w-4 h-4 mr-2" />
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>


            {/* TABLE VIEW */}
            {view === "table" && (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border-b py-3 px-4 text-left">Avatar</th>
                                <th className="border-b py-3 px-4 text-left">MSSV</th>
                                <th className="border-b py-3 px-4 text-left">Họ và tên</th>
                                <th className="border-b py-3 px-4 text-left">Lớp</th>
                                <th className="border-b py-3 px-4 text-left">Email</th>
                                <th className="border-b py-3 px-4 text-left">Nhóm TH</th>
                                <th className="border-b py-3 px-4 text-left">Trạng thái</th>
                                <th className="border-b py-3 px-4 text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center text-gray-500">
                                        {search ? "Không tìm thấy sinh viên nào" : "Chưa có sinh viên"}
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr 
                                        key={student.studentId} 
                                        className="hover:bg-gray-50"
                                        onClick={() => navigate('/dashboard/results-qr-detail-user')}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td className="py-3 px-4">
                                            <img
                                                src={student.avatarUrl || '/default-avatar.png'}
                                                alt={student.fullName}
                                                className="w-12 h-12 rounded-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.fullName);
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 px-4 font-medium">{student.studentCode}</td>
                                        <td className="py-3 px-4">{student.fullName}</td>
                                        <td className="py-3 px-4">{student.className}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600">{student.email}</td>
                                        <td className="py-3 px-4">
                                            {student.practiceGroup ? (
                                                <span className="text-sm text-gray-700">
                                                    {student.practiceGroup.groupName || student.practiceGroup.group_name}
                                                </span>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <StatusBadge status={student.enrollmentStatus} />
                                        </td>
                                        <td className="py-3 px-4">
                                            <Eye className="w-5 h-5 text-blue-600 hover:text-blue-800" title="Xem chi tiết" />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* CARD VIEW */}
            {view === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.length === 0 ? (
                        <div className="col-span-full py-8 text-center text-gray-500">
                            {search ? "Không tìm thấy sinh viên nào" : "Chưa có sinh viên"}
                        </div>
                    ) : (
                        filteredStudents.map((student) => (
                            <div 
                                key={student.studentId} 
                                className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
                                onClick={() => navigate('/dashboard/results-qr-detail-user')}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="flex items-center mb-4">
                                    <img
                                        src={student.avatarUrl || '/default-avatar.png'}
                                        alt={student.fullName}
                                        className="w-16 h-16 rounded-full mr-4 object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(student.fullName);
                                        }}
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">{student.fullName}</h3>
                                        <p className="text-sm text-gray-500">{student.studentCode}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm">
                                        <span className="font-semibold">Lớp: </span>
                                        {student.className}
                                    </p>

                                    <p className="text-sm">
                                        <span className="font-semibold">Email: </span>
                                        <span className="text-gray-600">{student.email}</span>
                                    </p>

                                    {student.practiceGroup && (
                                        <p className="text-sm">
                                            <span className="font-semibold">Nhóm TH: </span>
                                            {student.practiceGroup.groupName || student.practiceGroup.group_name}
                                        </p>
                                    )}

                                    <div className="mt-3">
                                        <StatusBadge status={student.enrollmentStatus} />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentStudySession;
