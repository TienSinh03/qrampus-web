import React, { useState } from "react";
import {
    ArrowDown,
    ArrowUp,
    FileSpreadsheet,
    FilterX,
    Settings, X, FileSearchIcon
} from "lucide-react";

const QRCodeTab = () => {
    const qrList = [
        {
            id: 1,
            maHP: "42345677843",
            tenHP: "Lập trình web nâng cao",
            thoiGianTao: "2025-01-12 08:00",
            thoiGianKT: "2025-01-12 09:30",
            maGV: "GV001",
            loailich: "LT",
            nhomTH: "",
            tenGV: "Nguyễn Văn A",
            nguoitao: "Nguyễn Văn A",
        },
        {
            id: 2,
            maHP: "42345677843",
            tenHP: "Lập trình web nâng cao",
            thoiGianTao: "2025-01-14 10:00",
            thoiGianKT: "2025-01-14 11:30",
            maGV: "GV001",
            loailich: "LT",
            nhomTH: "",
            tenGV: "Nguyễn Văn A",
            nguoitao: "Nguyễn Văn A",
        },
        {
            id: 3,
            maHP: "42345677843",
            tenHP: "Lập trình web nâng cao",
            thoiGianTao: "2025-01-15 13:30",
            thoiGianKT: "2025-01-15 15:00",
            maGV: "GV003",
            loailich: "TH",
            nhomTH: "1",
            tenGV: "Phạm Văn C",
            nguoitao: "Admin",
        },
    ];

    const [expanded, setExpanded] = useState(false);

    const [visibleCols, setVisibleCols] = useState({
        mahocphan: true,
        tenhocphan: true,
        thoigiantao: true,
        ketthucqr: true,
        magv: false,
        loailich: true,
        nhomth: true,
        tengiangvien: true,
        nguoitao: true,
        siso: true,
        diemdanhthanhcong: true,
        diemdanhthatbai: true,
    });

    // drawer xuất excel
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const closeDrawer = () => setIsDrawerOpen(false);



    return (
        <div className="rounded-b-xl bg-white p-6 shadow-sm">
            {/* Bộ lọc */}
            <div className="bg-white p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
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
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="ml-auto flex items-center text-blue-600 hover:text-blue-800"
                    >
                        {expanded ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                        <span className="ml-1">
                            {expanded ? "Thu gọn" : "Mở rộng"}
                        </span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Mã giảng viên
                        </label>
                        <input className="w-full border rounded-lg px-3 py-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Tên giảng viên
                        </label>
                        <input className="w-full border rounded-lg px-3 py-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Ngày tạo QR
                        </label>
                        <input
                            type="date"
                            className="w-full border rounded-lg px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Hình thức học
                        </label>
                        <select className="w-full border rounded-lg px-3 py-2">
                            <option>Lý thuyết</option>
                            <option>Thực hành</option>
                        </select>
                    </div>

                    {expanded && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Nhóm thực hành
                                </label>
                                <input className="w-full border rounded-lg px-3 py-2" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Người tạo QR
                                </label>
                                <input className="w-full border rounded-lg px-3 py-2" />
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-start md:justify-end gap-4">
                    <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                        {/* Xóa bộ lọc */}
                        <button className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200" >
                            <FileSearchIcon className="w-5 h-5" />
                            Tìm kiếm
                        </button>
                        <button className="flex items-center gap-2 border border-teal-500 text-teal-600 px-5 py-2.5 rounded-lg hover:bg-teal-50" onClick={() => setIsDrawerOpen(true)}>
                            <FileSpreadsheet className="w-5 h-5" />
                            Tải Excel
                        </button>

                        <button className="flex items-center gap-2 border px-5 py-2.5 rounded-lg hover:bg-gray-50">
                            <FilterX className="w-5 h-5" />
                            Xóa bộ lọc
                        </button>

                        <details className="relative">
                            <summary className="list-none cursor-pointer flex items-center gap-2 border px-5 py-2.5 rounded-lg hover:bg-gray-50">
                                <Settings className="w-5 h-5" />
                                Hiển thị cột
                            </summary>

                            <div className="absolute right-0 mt-2 w-100% bg-white border rounded-lg shadow p-2 z-20">
                                {[
                                    ["mahocphan", "Mã học phần"],
                                    ["tenhocphan", "Tên học phần"],
                                    ["thoigiantao", "Thời gian tạo"],
                                    ["ketthucqr", "Kết thúc QR"],
                                    ["magv", "Mã GV"],
                                    ["loailich", "Loại lịch"],
                                    ["nhomth", "Nhóm TH"],
                                    ["tengiangvien", "Tên giảng viên"],
                                    ["nguoitao", "Người tạo"],
                                ].map(([key, label]) => (
                                    <div
                                        key={key}
                                        onClick={() =>
                                            setVisibleCols((p) => ({ ...p, [key]: !p[key] }))
                                        }
                                        className={`px-3 py-2 rounded cursor-pointer ${visibleCols[key]
                                            ? "bg-sky-50 text-sky-600 font-medium"
                                            : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </details>
                </div>
                </div>

            </div>

            {/* Action buttons */}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3">STT</th>
                            {visibleCols.mahocphan && <th>Mã HP</th>}
                            {visibleCols.tenhocphan && <th>Tên HP</th>}
                            {visibleCols.thoigiantao && <th>Tạo QR</th>}
                            {visibleCols.ketthucqr && <th>Kết thúc</th>}
                            {visibleCols.magv && <th>Mã GV</th>}
                            {visibleCols.loailich && <th>Loại</th>}
                            {visibleCols.nhomth && <th>Nhóm TH</th>}
                            {visibleCols.tengiangvien && <th>Giảng viên</th>}
                            {visibleCols.nguoitao && <th>Người tạo</th>}
                            {visibleCols.siso && <th>Sĩ số</th>}
                            {visibleCols.diemdanhthanhcong && <th>Điểm danh thành công</th>}
                            {visibleCols.diemdanhthatbai && <th>Điểm danh thất bại</th>}
                            {visibleCols.diemdanhthatbai && <th>Hành động</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {qrList.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">{index + 1}</td>
                                {visibleCols.mahocphan && <td>{item.maHP}</td>}
                                {visibleCols.tenhocphan && <td>{item.tenHP}</td>}
                                {visibleCols.thoigiantao && <td>{item.thoiGianTao}</td>}
                                {visibleCols.ketthucqr && <td>{item.thoiGianKT}</td>}
                                {visibleCols.magv && <td>{item.maGV}</td>}
                                {visibleCols.loailich && <td>{item.loailich}</td>}
                                {visibleCols.nhomth && <td>{item.nhomTH}</td>}
                                {visibleCols.tengiangvien && <td>{item.tenGV}</td>}
                                {visibleCols.nguoitao && <td>{item.nguoitao}</td>}
                                {visibleCols.siso && <td>{item.siso}</td>}
                                {visibleCols.diemdanhthanhcong && <td>{item.diemDanhThanhCong}</td>}
                                {visibleCols.diemdanhthatbai && <td>{item.diemDanhThatBai}</td>}
                                {visibleCols.diemdanhthatbai && (
                                    <td>
                                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700" >
                                            Xem chi tiết (Màn hình chi tiết hôm nay)
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* xuất excel */}
            {isDrawerOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 z-[999]"
                        onClick={closeDrawer}
                    />

                    {/* Drawer */}
                    <div className=" fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl  flex flex-col">
                        {/* ================= HEADER ================= */}
                        <div className="flex items-center justify-between px-6 py-5 border-b bg-blue-300">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Hỗ trợ xuất Excel
                            </h3>

                            <button
                                onClick={closeDrawer}
                                className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-lime-300 transition-all duration-300 hover:rotate-90"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* ================= BODY (SCROLL) ================= */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Đặt tên file Excel
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên Sheet
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Chọn cột xuất Excel
                                </label>
                                <div className="space-y-2 mt-2">
                                    {Object.entries(visibleCols).map(([key, isVisible]) => (
                                        <div key={key} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={isVisible}
                                                onChange={() =>
                                                    setVisibleCols((prev) => ({
                                                        ...prev,
                                                        [key]: !prev[key],

                                                    }))
                                                }
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 capitalize">
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                        {/* ================= FOOTER ================= */}
                        <div className=" sticky bottom-0 flex justify-end gap-4 px-6 py-4 border-t bg-white/90 backdrop-blur">
                            <button
                                onClick={closeDrawer}
                                className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                            >
                                Hủy
                            </button>

                            <button
                                className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                            >
                                Xuất Excel
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default QRCodeTab;
