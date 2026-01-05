import React, { useState, useMemo } from "react";
import {
    Edit, Eye, IdCard, Table2,
    ArrowDown, ArrowUp

} from "lucide-react";
import { useNavigate } from "react-router-dom";


const StudentStudySession = () => {
    const [view, setView] = useState("table");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const students = [
        {
            id: 1,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
            full_name: "Galen Slixby",
            email: "gslixby0@abc.net.au",
            role: "Editor",
            user_id: "123456",
            status: "Inactive",
        },
        {
            id: 2,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
            full_name: "Halsey Redmore",
            email: "hredmore1@imgur.com",
            role: "Author",
            user_id: "125678",
            status: "Pending",
        },
        {
            id: 3,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
            full_name: "Marjory Sicely",
            email: "msicely2@who.int",
            role: "Maintainer",
            user_id: "456321",
            status: "Active",
        },
        {
            id: 4,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
            full_name: "Cyrill Risby",
            email: "crisby3@wordpress.com",
            role: "Maintainer",
            user_id: "456789",
            status: "Inactive",
        },
        {
            id: 5,
            avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
            full_name: "Maggy Hurran",
            email: "mhurran4@yahoo.co.jp",
            role: "Subscriber",
            user_id: "23456",
            status: "Pending",
        },
    ];

    // FILTER SEARCH
    const filteredStudents = useMemo(() => {
        return students.filter((s) =>
            `${s.full_name} ${s.email} ${s.role}`
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search]);

    const StatusBadge = ({ status }) => {
        const COLORS = {
            Active: "text-green-600 bg-green-100",
            Inactive: "text-red-600 bg-red-100",
            Pending: "text-yellow-600 bg-yellow-100",
        };
        return (
            <span className={`px-2 py-1 rounded-md text-sm font-medium ${COLORS[status]}`}>
                {status}
            </span>
        );
    };
    const [expanded, setExpanded] = useState(false);

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
                                Mở rộng bộ lọc
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
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-b py-3 px-4 text-left">Avatar</th>
                            <th className="border-b py-3 px-4 text-left">MSSV</th>
                            <th className="border-b py-3 px-4 text-left">Full Name</th>
                            <th className="border-b py-3 px-4 text-left">Email</th>
                            <th className="border-b py-3 px-4 text-left">Role</th>
                            <th className="border-b py-3 px-4 text-left">Status</th>
                            <th className="border-b py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50"
                                onClick={() => navigate('/dashboard/results-qr-detail-user')}
                                style={{ cursor: "pointer" }}
                            >
                                <td className="py-3 px-4">
                                    <img
                                        src={student.avatar_url}
                                        alt={student.full_name}
                                        className="w-12 h-12 rounded-full"
                                    />
                                </td>
                                <td className="py-3 px-4">{student.user_id}</td>
                                <td className="py-3 px-4">{student.full_name}</td>
                                <td className="py-3 px-4">{student.email}</td>
                                <td className="py-3 px-4">{student.role}</td>
                                <td className="py-3 px-4">
                                    <StatusBadge status={student.status} />
                                </td>
                                <td className="py-3 px-4 text-blue-600 underline">
                                    <Eye className="w-5 h-5" titles="View Details" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* CARD VIEW */}
            {view === "card" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => (
                        <div key={student.id} className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition"
                            onClick={() => navigate('/dashboard/results-qr-detail-user')}
                            style={{ cursor: "pointer" }}

                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={student.avatar_url}
                                    alt={student.full_name}
                                    className="w-16 h-16 rounded-full mr-4"
                                />
                                <div>
                                    <h3 className="text-lg font-semibold">{student.full_name}</h3>
                                    <p className="text-sm text-gray-500">{student.email}</p>
                                </div>
                            </div>

                            <p className="mb-2">
                                <span className="font-semibold">#ID: </span>{student.user_id}
                            </p>

                            <p className="mb-2">
                                <span className="font-semibold">Role: </span>{student.role}
                            </p>

                            <div className="mt-3">
                                <StatusBadge status={student.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentStudySession;
