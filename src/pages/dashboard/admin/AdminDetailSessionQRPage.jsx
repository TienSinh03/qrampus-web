import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Send,
    Eye,
    Clock,
    Book,
    User,
    Layers,
    X,
    Download,
    DownloadCloudIcon,
    DownloadIcon,
    MoveDownLeftIcon,
    Camera, // Thêm icon X để đóng drawer
} from "lucide-react";
import TeacherPhotosModal from "./components/TeacherPhotosModal";

const ViewIcon = Eye;

const AdminDetailSessionQRPage = () => {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    // XEM Ảnh
    const [isOpen, setOpen] = useState(false);
    // Giả lập dữ liệu ảnh (thực tế sẽ lấy từ API/backend)
    const teacherPhotos = [
        {
            id: 1,
            url: "/public/assets/images/_34A8269.jpg",
            caption: "Ghi số lượng sv..............",
        },
        {
            id: 2,
            url: "/public/assets/images/_34A8289.jpg",
            caption: "Ghi số lượng sv..............",
        },
        {
            id: 3,
            url: "/public/assets/images/_34A8277.jpg",
            caption: "Ghi số lượng sv..............",
        },
        {
            id: 4,
            url: "/public/assets/images/_34A8304.jpg",
            caption: "Ghi số lượng sv..............",
        },
    ];

    const sessionStatusRows = [
        {
            id: 1,
            courseCode: "42000735839",
            sessionTime: "09:00 - 09:05",
            courseName: "Nhập môn lập trình web",
            createdDate: "01/01/2024",
            classSize: 90,
            group: "Nhóm 1",
            learningType: "Lý thuyết",
            successCount: 25,
            absentCount: 3,
        },
        {
            id: 2,
            courseCode: "42000735840",
            sessionTime: "13:00 - 13:05",
            courseName: "Cơ sở dữ liệu",
            createdDate: "02/01/2024",
            classSize: 80,
            group: "Nhóm 2",
            learningType: "Thực hành",
            successCount: 72,
            absentCount: 8,
        },
        {
            id: 3,
            courseCode: "42000735841",
            sessionTime: "07:30 - 07:35",
            courseName: "Lập trình hướng đối tượng",
            createdDate: "03/01/2024",
            classSize: 95,
            group: "Nhóm 1",
            learningType: "Lý thuyết",
            successCount: 90,
            absentCount: 5,
        },
        {
            id: 4,
            courseCode: "42000735842",
            sessionTime: "15:00 - 15:05",
            courseName: "Mạng máy tính",
            createdDate: "04/01/2024",
            classSize: 70,
            group: "Nhóm 3",
            learningType: "Thực hành",
            successCount: 66,
            absentCount: 4,
        },
        {
            id: 5,
            courseCode: "42000735843",
            sessionTime: "10:00 - 10:05",
            courseName: "Cấu trúc dữ liệu và giải thuật",
            createdDate: "05/01/2024",
            classSize: 100,
            group: "Nhóm 4",
            learningType: "Lý thuyết",
            successCount: 92,
            absentCount: 8,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6">
            {/* ===== MAIN CONTENT ===== */}
            <div className="rounded-b-xl shadow p-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* LEFT - COURSE INFO */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Book className="w-6 h-6 text-green-600" />
                            Nhập môn lập trình Web
                        </h2>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span><span className="font-medium">GV:</span> Nguyễn Văn A (100000001)</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Layers className="w-4 h-4" />
                                <span><span className="font-medium">Hình thức:</span> Lý thuyết</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span><span className="font-medium">Tiết:</span> 4-6</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span><span className="font-medium">Nhóm TH:</span> 0</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - META + FILTER */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                        {/* Course code */}
                        <div className="text-sm text-gray-600">
                            <span className="block text-gray-400 text-xs">Mã học phần</span>
                            <span className="font-semibold text-gray-800">42000735839</span>
                        </div>

                        {/* Filter by date */}
                        <div className="flex flex-col text-sm">
                            <label className="text-gray-400 text-xs mb-1">Lọc theo ngày</label>
                            <input
                                type="date"
                                className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Status */}
                        <div className="flex flex-col text-sm">
                            <span className="text-gray-400 text-xs mb-1">Trạng thái</span>
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                Đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>


                <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-3">Lịch sử tạo phiên</h3>
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Mã học phần</th>
                                <th className="p-3 text-left">Thời gian tạo phiên</th>
                                <th className="p-3 text-left">Tên học phần</th>
                                <th className="p-3 text-left">Ngày tạo</th>
                                <th className="p-3 text-left">Sĩ số học phần</th>
                                <th className="p-3 text-left">Nhóm</th>
                                <th className="p-3 text-left">Hình thức học</th>
                                <th className="p-3 text-left">Số SV thành công</th>
                                <th className="p-3 text-left">Số SV vắng</th>
                                <th className="p-3 text-left">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessionStatusRows.map((row) => (
                                <tr key={row.id} className="border-t">
                                    <td className="p-3">{row.courseCode}</td>
                                    <td className="p-3">{row.sessionTime}</td>
                                    <td className="p-3">{row.courseName}</td>
                                    <td className="p-3">{row.createdDate}</td>
                                    <td className="p-3">{row.classSize}</td>
                                    <td className="p-3">{row.group}</td>
                                    <td className="p-3">{row.learningType}</td>
                                    <td className="p-3 font-medium text-green-600">{row.successCount}</td>
                                    <td className="p-3 font-medium text-red-500">{row.absentCount}</td>
                                    <td className="p-5 flex space-x-2">
                                    <button
                                        aria-label="View Details"
                                        title="Xem chi tiết"
                                        className="p-2 rounded-full text-purple-600 hover:bg-purple-100 transition"
                                        onClick={() => navigate("/dashboard/admin/results-qr")}
                                    >
                                        <ViewIcon size={16} />
                                    </button>
                                    {/* XEM ẢNH LỚO HỌC */}
                                    <button
                                        aria-label="View Photos"
                                        title="Xem ảnh đã chụp trong buổi học này"
                                        className="p-2 rounded-full text-purple-600 hover:bg-purple-100 transition"
                                        onClick={() => setOpen(true)}
                                    >
                                        <Camera size={16} />
                                    </button>

                                    <button
                                        aria-label="Download Report"
                                        title="Tải báo cáo dạng excel, tải danh sách sinh viên điểm danh, ngày hôm đó"
                                        className="p-2 rounded-full text-purple-600 hover:bg-purple-100 transition"
                                    >
                                        <Download size={16} />
                                    </button> 

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <TeacherPhotosModal
                    isOpen={isOpen}
                    onClose={() => setOpen(false)}
                    photos={teacherPhotos}
                />


                {/* Footer */}
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                    {/* LEFT */}
                    <div className="bg-white rounded-xl p-5 shadow space-y-5">
                        <p className="text-sm font-medium text-gray-600">
                            Giảng viên quản lý Học phần
                        </p>

                        {/* Giảng viên Lý thuyết */}
                        <div className="border border-blue-100 rounded-lg p-4 bg-blue-50/40">
                            <p className="text-sm font-semibold text-blue-600 mb-3">
                                Giảng viên Lý thuyết
                            </p>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Nguyễn Văn A
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Mã GV: 100000001
                                    </p>
                                </div>

                                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                    Lý thuyết
                                </span>
                            </div>
                        </div>

                        {/* Giảng viên Thực hành */}
                        <div className="border border-green-100 rounded-lg p-4 bg-green-50/40">
                            <p className="text-sm font-semibold text-green-600 mb-3">
                                Giảng viên Thực hành
                            </p>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            Nguyễn Văn A
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Mã GV: 100000001
                                        </p>
                                    </div>

                                    <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                                        Nhóm 1
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT – INFO CARD */}
                    <div className="bg-white rounded-xl p-5 shadow space-y-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <p className="font-semibold text-gray-800">
                                Mô tả phiên điểm danh
                            </p>
                            <span className="text-xs text-gray-500">
                                #423456789123
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Tổng Sinh viên
                            </span>
                            <span className="font-semibold text-gray-800">
                                90
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Số buổi học
                            </span>
                            <span className="font-semibold text-gray-800">
                                15 buổi
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Số lượt tạo QR
                            </span>
                            <span className="font-semibold text-gray-800">
                                12 buổi
                            </span>
                        </div>

                    </div>
                </div>

            </div>


            {isDrawerOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-60"
                        onClick={closeDrawer}
                    />

                    {/* Drawer từ bên phải trượt ra */}
                    <div className="fixed inset-y-0 right-0 z-60 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
                        {/* Header Drawer */}
                        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-lime-100">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800">Mở phiên điểm danh</h3>
                            </div>
                            <button
                                onClick={closeDrawer}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none  rounded-full hover:bg-lime-400 transition-all  duration-300 ease-in-out p-2 hover:rotate-90"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body Form */}
                        <div className="p-6 space-y-6 overflow-y-auto h-full pb-32">
                            <div className="grid grid-cols-1 gap-6">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Giảng viên
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="Nguyễn Văn A"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã giảng viên
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="100000001"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mã học phần
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="42000735839"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Người tạo
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="QTV, ADMIN"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tiết học
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                                        defaultValue="1-3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thời gian tạo QR
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                                        <option>2 phút</option>
                                        <option>4 phút</option>
                                        <option selected>5 phút</option>
                                        <option>10 phút</option>
                                    </select>
                                </div>

                            </div>
                        </div>


                        {/* Footer Buttons - Fixed bottom */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
                            <button
                                onClick={closeDrawer}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                Tạo QR ngay
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDetailSessionQRPage;