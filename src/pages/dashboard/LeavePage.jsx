import React, { useState } from "react";
import { Calendar, Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, AlertCircle, ChevronDown } from "lucide-react";

export default function LeavePage() {
    const [selectedSemester, setSelectedSemester] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const semesters = [
        { value: "all", label: "Tất cả học kỳ" },
        { value: "hk1-2024-2025", label: "HK1 2024-2025" },
        { value: "hk2-2023-2024", label: "HK2 2023-2024" },
        { value: "hk1-2023-2024", label: "HK1 2023-2024" },
    ];

    // Dữ liệu minh chứng nghỉ học (thực tế lấy từ API)
    const leaves = [
        {
            id: 1,
            mssv: "21010611",
            hoTen: "Nguyễn Văn An",
            lop: "20TCLC_DT3",
            hocPhan: "Lập trình thiết bị di động",
            ngayNghi: "2025-04-05",
            lyDo: "Khám bệnh (có giấy bệnh viện)",
            file: "/images/giay-kham-benh-1.jpg",
            trangThai: "pending",
            ghiChu: "",
            ky: "hk1-2024-2025",
        },
        {
            id: 2,
            mssv: "21010612",
            hoTen: "Trần Thị Bình",
            lop: "20TCLC_DT3",
            hocPhan: "Lập trình thiết bị di động",
            ngayNghi: "2025-04-03",
            lyDo: "Tang lễ ông nội",
            file: "/images/giay-bao-tu.jpg",
            trangThai: "approved",
            ghiChu: "Đã duyệt",
            ky: "hk1-2024-2025",
        },
        {
            id: 3,
            mssv: "21010613",
            hoTen: "Lê Văn Cường",
            lop: "21TCLC_DT1",
            hocPhan: "Phát triển ứng dụng Web",
            ngayNghi: "2025-03-28",
            lyDo: "Xe hỏng trên đường đi học",
            file: "/images/xe-hong.jpg",
            trangThai: "rejected",
            ghiChu: "Không hợp lệ (không có ảnh rõ ràng)",
            ky: "hk1-2024-2025",
        },
        {
            id: 4,
            mssv: "21010614",
            hoTen: "Phạm Thị Dung",
            lop: "20TCLC_DT4",
            hocPhan: "Cơ sở dữ liệu",
            ngayNghi: "2024-12-15",
            lyDo: "Ốm nặng – Nghỉ 3 buổi",
            file: "/images/giay-nghi-om.jpg",
            trangThai: "approved",
            ghiChu: "",
            ky: "hk2-2023-2024",
        },
    ];

    const filtered = leaves.filter(item => {
        if (selectedSemester !== "all" && item.ky !== selectedSemester) return false;
        if (statusFilter !== "all" && item.trangThai !== statusFilter) return false;
        return true;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "rejected": return "bg-red-100 text-red-700 border-red-200";
            case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "approved": return <CheckCircle className="w-4 h-4 text-emerald-600" />;
            case "rejected": return <XCircle className="w-4 h-4 text-red-600" />;
            case "pending": return <Clock className="w-4 h-4 text-amber-600" />;
        }
    };

    return (
        <div className="min-h-screen from-gray-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white shadow-md border-b border-gray-200">
                <div className="mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-4">
                                Quản lý minh chứng nghỉ học
                            </h1>
                            <p className="mt-3 text-sm text-gray-600">
                                <i>Xem và xử lý minh chứng nghỉ học của sinh viên trong các học phần bạn phụ trách</i>
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            {/* Lọc học kỳ */}
                            <div className="relative">
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    className="
                                                                appearance-none 
                                                                bg-gradient-to-r from-indigo-400 to-purple-600 
                                                                text-white font-semibold 
                                                                px-8 py-3 pr-12 rounded-2xl
                                                                shadow-lg hover:shadow-xl 
                                                                transition-all duration-200
                                                                cursor-pointer text-sm
                                                            "
                                >
                                    {semesters.map((sem) => (
                                        <option key={sem.value} value={sem.value} className="text-gray-900">
                                            {sem.label}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white pointer-events-none"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="
                                                                appearance-none 
                                                                bg-gradient-to-r from-indigo-400 to-purple-600 
                                                                text-white font-semibold 
                                                                px-8 py-3 pr-12 rounded-2xl
                                                                shadow-lg hover:shadow-xl 
                                                                transition-all duration-200
                                                                cursor-pointer text-sm
                                                            "
                                >
                                    <option value="all" className="text-gray-900">Tất cả trạng thái</option>
                                    <option value="pending" className="text-gray-900">Chờ duyệt</option>
                                    <option value="approved" className="text-gray-900">Đã duyệt</option>
                                    <option value="rejected" className="text-gray-900">Từ chối</option>
                                </select>

                                <ChevronDown
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white pointer-events-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thống kê nhanh */}
            <div className="mx-auto  py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Tổng đơn</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{leaves.length}</p>
                            </div>
                            <AlertCircle className="w-9 h-9 text-indigo-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Chờ duyệt</p>
                                <p className="text-2xl font-bold text-amber-600 mt-2">
                                    {leaves.filter(l => l.trangThai === "pending").length}
                                </p>
                            </div>
                            <Clock className="w-9 h-9 text-amber-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Đã duyệt</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-2">
                                    {leaves.filter(l => l.trangThai === "approved").length}
                                </p>
                            </div>
                            <CheckCircle className="w-9 h-9 text-emerald-500" />
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Từ chối</p>
                                <p className="text-2xl font-bold text-red-600 mt-2">
                                    {leaves.filter(l => l.trangThai === "rejected").length}
                                </p>
                            </div>
                            <XCircle className="w-9 h-9 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Danh sách minh chứng */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                        <h2 className="text-xl font-bold text-gray-900">Danh sách minh chứng nghỉ học</h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {filtered.map((item) => (
                            <div key={item.id} className="px-8 py-6 hover:bg-gradient-to-r hover:from-indigo-50/30 hover:to-purple-50/30 transition-all group">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        {/* Avatar + Info */}
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            {item.hoTen.split(" ").pop()[0]}
                                        </div>

                                        <div>
                                            <h3 className="text-ms font-bold text-gray-900">
                                                {item.hoTen} • {item.mssv}
                                            </h3>
                                            <div className="flex items-center gap-6 mt-2 text-gray-600">
                                                <span className="flex items-center gap-2 text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(item.ngayNghi).toLocaleDateString("vi-VN")}
                                                </span>
                                                <span className="font-medium text-indigo-600 text-sm">
                                                    Mã học phần:
                                                    <a href="#" className="underline hover:text-indigo-800">
                                                        {item.lop}
                                                    </a>

                                                </span>
                                                <span className="font-medium text-indigo-600 text-sm">
                                                    {item.hocPhan}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-gray-700 font-medium italic text-ms">{item.lyDo}</p>
                                        </div>
                                    </div>

                                    {/* Minh chứng + hành động */}
                                    <div className="flex items-center gap-6">
                                        {/* Xem ảnh minh chứng */}
                                        <button className="group relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
                                            <Eye className="w-4 h-4 text-gray-600" />
                                            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                                Xem ảnh
                                            </span>
                                        </button>

                                        {/* Trạng thái */}
                                        <div className={`px-5 py-3 rounded-xl border font-bold flex items-center gap-3   ${getStatusBadge(item.trangThai)}`}>
                                            {getStatusIcon(item.trangThai)}
                                            {item.trangThai === "approved" ? "Đã duyệt" : item.trangThai === "rejected" ? "Từ chối" : "Chờ duyệt"}
                                        </div>

                                        {/* Nút duyệt / từ chối (chỉ hiện khi đang chờ) */}
                                        {item.trangThai === "pending" && (
                                            <div className="flex gap-3">
                                                <button className=" text-ms bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition">
                                                    Duyệt
                                                </button>
                                                <button className="text-ms bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition">
                                                    Từ chối
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Ghi chú nếu có */}
                                {item.ghiChu && (
                                    <div className="mt-4 ml-24 text-sm text-gray-600 italic">
                                        Ghi chú: {item.ghiChu}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ghi chú cuối trang */}
                <div className="mt-10 text-center text-gray-600 bg-white/80 backdrop-blur rounded-2xl py-6 border">
                    <p className="text-lg font-medium">
                        Tất cả minh chứng được lưu trữ an toàn • Chỉ giảng viên phụ trách mới xem được
                    </p>
                </div>
            </div>
        </div>
    );
}