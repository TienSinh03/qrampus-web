import React, { useState, useMemo } from "react";
import { 
    Calendar,
    ArrowDown,
    ArrowUp,
    Download,
    UserCheck,
    Clock,
    MapPin,
    FileSearch as FileSearchIcon,
    FileSpreadsheet,
    FilterX
} from "lucide-react";
import Pagination from "../../../components/common/Pagination";
import StatsCard from "../../../components/common/StatsCard";

const AttendanceSchedulePage = () => {
    const [expanded, setExpanded] = useState(false);
    const [tempFilters, setTempFilters] = useState({
        maHP: "",
        tenHP: "",
        maGV: "",
        tenGV: "",
        phong: "",
        thu: "",
        loaiLich: "",
        status: "",
        fromDate: "",
        toDate: "",
    });
    const [appliedFilters, setAppliedFilters] = useState({
        maHP: "",
        tenHP: "",
        maGV: "",
        tenGV: "",
        phong: "",
        thu: "",
        loaiLich: "",
        status: "",
        fromDate: "",
        toDate: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    // --- HÀM TẠO 150 DÒNG DATA THEO FORMAT IUH ---
    const fullMockData = useMemo(() => {
        const departments = ["CNTT", "Cơ khí", "Điện tử", "Kinh tế", "Luật"];
        const subjects = [
            "Lập trình ứng dụng di động", "Cơ sở dữ liệu", "Trí tuệ nhân tạo", 
            "An toàn thông tin", "Phân tích thiết kế hệ thống", "Toán rời rạc"
        ];
        const lecturers = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Minh D", "Hoàng Thị E"];
        const rooms = ["H5.1.1", "V7.2", "X11.3", "A1.2", "B4.1", "H5.1.2"];

        return Array.from({ length: 150 }, (_, i) => ({
            stt: i + 1,
            maHP: `84145${100 + i}`,
            tenHP: subjects[i % subjects.length],
            soTC: (i % 3) + 2,
            thu: "Hai", // Giả định đang xem thứ 2
            tiet: i % 2 === 0 ? "1 - 3" : "7 - 9",
            loaiLich: i % 5 === 0 ? "Thực hành" : "Lý thuyết",
            phong: rooms[i % rooms.length],
            nhom: `0${(i % 3) + 1}DH`,
            gio: i % 2 === 0 ? "06:30 - 09:00" : "12:30 - 15:00",
            batDau: "12/01/2026",
            ketThuc: "20/05/2026",
            maGV: `GV00${500 + i}`,
            tenGV: lecturers[i % lecturers.length],
            status: i % 10 === 0 ? "ongoing" : "upcoming" // Giả lập vài ca đang dạy
        }));
    }, []);

    const parseVnDate = (value) => {
        if (!value) return null;
        const [day, month, year] = value.split("/");
        return new Date(`${year}-${month}-${day}T00:00:00`);
    };

    const handleTempFilterChange = (key, value) => {
        setTempFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleApplyFilters = () => {
        setCurrentPage(1);
        setAppliedFilters(tempFilters);
    };

    const handleClearFilters = () => {
        const emptyFilters = {
            maHP: "",
            tenHP: "",
            maGV: "",
            tenGV: "",
            phong: "",
            thu: "",
            loaiLich: "",
            status: "",
            fromDate: "",
            toDate: "",
        };
        setTempFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        setCurrentPage(1);
    };

    // --- LOGIC TÌM KIẾM & PHÂN TRANG ---
    const filteredData = fullMockData.filter((item) => {
        const fromDate = appliedFilters.fromDate ? new Date(`${appliedFilters.fromDate}T00:00:00`) : null;
        const toDate = appliedFilters.toDate ? new Date(`${appliedFilters.toDate}T23:59:59`) : null;
        const rowStartDate = parseVnDate(item.batDau);

        const matchesMaHP = !appliedFilters.maHP || item.maHP.toLowerCase().includes(appliedFilters.maHP.toLowerCase());
        const matchesTenHP = !appliedFilters.tenHP || item.tenHP.toLowerCase().includes(appliedFilters.tenHP.toLowerCase());
        const matchesMaGV = !appliedFilters.maGV || item.maGV.toLowerCase().includes(appliedFilters.maGV.toLowerCase());
        const matchesTenGV = !appliedFilters.tenGV || item.tenGV.toLowerCase().includes(appliedFilters.tenGV.toLowerCase());
        const matchesPhong = !appliedFilters.phong || item.phong.toLowerCase().includes(appliedFilters.phong.toLowerCase());
        const matchesThu = !appliedFilters.thu || item.thu === appliedFilters.thu;
        const matchesLoaiLich = !appliedFilters.loaiLich || item.loaiLich === appliedFilters.loaiLich;
        const matchesStatus = !appliedFilters.status || item.status === appliedFilters.status;
        const matchesFromDate = !fromDate || (rowStartDate && rowStartDate >= fromDate);
        const matchesToDate = !toDate || (rowStartDate && rowStartDate <= toDate);

        return (
            matchesMaHP &&
            matchesTenHP &&
            matchesMaGV &&
            matchesTenGV &&
            matchesPhong &&
            matchesThu &&
            matchesLoaiLich &&
            matchesStatus &&
            matchesFromDate &&
            matchesToDate
        );
    });

    const currentTableData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="p-4 space-y-5 bg-slate-50 min-h-screen">
            
            {/* 1. TOP STATS - Nhìn nhanh tình hình 150 GV */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard title="Tổng GV dạy hôm nay" value={fullMockData.length} icon={<Calendar size={20}/>} color="blue" />
                <StatsCard title="Đang lên lớp" value="12" icon={<UserCheck size={20}/>} color="green" />
                <StatsCard title="Phòng đang sử dụng" value="12/50" icon={<MapPin size={20}/>} color="orange" />
                <StatsCard title="Chưa bắt đầu" value="138" icon={<Clock size={20}/>} color="gray" />
            </div>

            {/* 2. BỘ LỌC - đồng bộ thiết kế với AttendanceTeacherPage */}
            <div className="bg-white border p-6">
                <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
                    <FileSearchIcon className="w-4 h-4" />
                    <span>Bộ lọc lịch dạy</span>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center text-blue-600 hover:text-blue-800 ml-auto"
                    >
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

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã học phần</label>
                        <input
                            type="text"
                            value={tempFilters.maHP}
                            onChange={(e) => handleTempFilterChange("maHP", e.target.value)}
                            placeholder="Ví dụ: 84145101"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên học phần</label>
                        <input
                            type="text"
                            value={tempFilters.tenHP}
                            onChange={(e) => handleTempFilterChange("tenHP", e.target.value)}
                            placeholder="Nhập tên học phần"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã giảng viên</label>
                        <input
                            type="text"
                            value={tempFilters.maGV}
                            onChange={(e) => handleTempFilterChange("maGV", e.target.value)}
                            placeholder="Ví dụ: GV00501"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
                        <input
                            type="text"
                            value={tempFilters.tenGV}
                            onChange={(e) => handleTempFilterChange("tenGV", e.target.value)}
                            placeholder="Nhập tên giảng viên"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
                        <input
                            type="text"
                            value={tempFilters.phong}
                            onChange={(e) => handleTempFilterChange("phong", e.target.value)}
                            placeholder="Ví dụ: H5.1.1"
                            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {expanded && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thứ</label>
                                <select
                                    value={tempFilters.thu}
                                    onChange={(e) => handleTempFilterChange("thu", e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="Hai">Thứ Hai</option>
                                    <option value="Ba">Thứ Ba</option>
                                    <option value="Tư">Thứ Tư</option>
                                    <option value="Năm">Thứ Năm</option>
                                    <option value="Sáu">Thứ Sáu</option>
                                    <option value="Bảy">Thứ Bảy</option>
                                    <option value="Chủ nhật">Chủ nhật</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Loại lịch</label>
                                <select
                                    value={tempFilters.loaiLich}
                                    onChange={(e) => handleTempFilterChange("loaiLich", e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="Lý thuyết">Lý thuyết</option>
                                    <option value="Thực hành">Thực hành</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                <select
                                    value={tempFilters.status}
                                    onChange={(e) => handleTempFilterChange("status", e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="ongoing">Đang lên lớp</option>
                                    <option value="upcoming">Chưa bắt đầu</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày bắt đầu</label>
                                <input
                                    type="date"
                                    value={tempFilters.fromDate}
                                    onChange={(e) => handleTempFilterChange("fromDate", e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày bắt đầu</label>
                                <input
                                    type="date"
                                    value={tempFilters.toDate}
                                    onChange={(e) => handleTempFilterChange("toDate", e.target.value)}
                                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between justify-start md:justify-end">
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleApplyFilters}
                            className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
                            title="Tìm kiếm"
                        >
                            <FileSearchIcon className="w-5 h-5" />
                        </button>

                        <button
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ${
                                filteredData.length > 0
                                    ? "border border-emerald-400 text-emerald-400 hover:bg-emerald-100 hover:shadow-md focus:ring-emerald-500"
                                    : "border border-gray-300 text-gray-400 cursor-not-allowed"
                            }`}
                            disabled={filteredData.length === 0}
                            title="Xuất file"
                        >
                            <FileSpreadsheet className="w-5 h-5" />
                            {filteredData.length > 0 && (
                                <span className="ml-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                                    {filteredData.length}
                                </span>
                            )}
                        </button>

                        <button
                            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
                            title="Tải file mẫu"
                        >
                            <Download className="w-5 h-5" />
                        </button>

                        <button
                            onClick={handleClearFilters}
                            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
                            title="Xóa bộ lọc"
                        >
                            <FilterX className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. BẢNG DỮ LIỆU CHUẨN HEADER IUH */}
            <div className="bg-white shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-[12px] text-left border-collapse min-w-[1400px]">
                        <thead>
                            {/* Header tầng 1 */}
                            <tr className="bg-[#48a3d6] text-white text-center font-bold uppercase tracking-tight">
                                <th rowSpan="2" className="border border-white/20 p-3 w-12">STT</th>
                                <th rowSpan="2" className="border border-white/20 p-3 w-32">Mã học phần</th>
                                <th rowSpan="2" className="border border-white/20 p-3 w-72 text-left">Tên môn học/học phần</th>
                                <th rowSpan="2" className="border border-white/20 p-3 w-20">Số tín chỉ</th>
                                <th colSpan="6" className="border border-white/20 p-2 text-[13px]">Thông tin lịch dạy chi tiết</th>
                                <th colSpan="2" className="border border-white/20 p-2 text-[13px]">Thời gian học</th>
                                <th rowSpan="2" className="border border-white/20 p-3 w-32">Mã giảng viên</th>
                                <th rowSpan="2" className="border border-white/20 p-3 w-48 text-left">Giảng viên</th>
                            </tr>
                            {/* Header tầng 2 */}
                            <tr className="bg-[#48a3d6] text-white text-[11px] text-center font-bold uppercase">
                                <th className="border border-white/20 p-2 w-16">Thứ</th>
                                <th className="border border-white/20 p-2 w-20">Tiết</th>
                                <th className="border border-white/20 p-2 w-28">Loại lịch</th>
                                <th className="border border-white/20 p-2 w-24 text-yellow-200">Phòng</th>
                                <th className="border border-white/20 p-2 w-20">Nhóm</th>
                                <th className="border border-white/20 p-2 w-32">Giờ dạy</th>
                                <th className="border border-white/20 p-2 w-28">Bắt đầu</th>
                                <th className="border border-white/20 p-2 w-28">Kết thúc</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentTableData.map((row) => (
                                <tr key={row.stt} className={`transition-colors cursor-pointer group ${row.status === 'ongoing' ? 'bg-green-50/50' : 'hover:bg-blue-50/40'}`}>
                                    <td className="p-3 text-center border-x text-slate-400 font-medium">{row.stt}</td>
                                    <td className="p-3 font-bold text-blue-600 border-x">{row.maHP}</td>
                                    <td className="p-3 font-bold text-slate-700 border-x group-hover:text-blue-700">{row.tenHP}</td>
                                    <td className="p-3 text-center border-x font-semibold text-slate-600">{row.soTC}</td>
                                    <td className="p-3 text-center border-x font-medium">{row.thu}</td>
                                    <td className="p-3 text-center border-x font-medium">{row.tiet}</td>
                                    <td className="p-3 border-x italic text-slate-500">{row.loaiLich}</td>
                                    <td className="p-3 text-center border-x font-black text-red-600 text-[14px]">{row.phong}</td>
                                    <td className="p-3 text-center border-x font-medium text-slate-600">{row.nhom}</td>
                                    <td className="p-3 text-center border-x font-bold text-slate-700">{row.gio}</td>
                                    <td className="p-3 text-center border-x text-green-700 font-bold">{row.batDau}</td>
                                    <td className="p-3 text-center border-x text-orange-600 font-bold">{row.ketThuc}</td>
                                    <td className="p-3 text-center border-x font-mono text-slate-500 font-bold tracking-tighter">{row.maGV}</td>
                                    <td className="p-3 font-black text-slate-800 border-x">
                                        <div className="flex items-center gap-2">
                                            {row.status === 'ongoing' && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
                                            {row.tenGV}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. FOOTER PHÂN TRANG - Giúp load 150 dòng mượt mà */}
                <div className="p-4 bg-slate-50 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm font-medium text-slate-500">
                        Đang hiển thị <span className="text-blue-700 font-bold">{currentTableData.length}</span> ca dạy trong tổng số <span className="text-slate-800 font-bold">{filteredData.length}</span> kết quả
                    </div>
                    <Pagination 
                        totalPages={Math.ceil(filteredData.length / itemsPerPage)} 
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    );
};

export default AttendanceSchedulePage;