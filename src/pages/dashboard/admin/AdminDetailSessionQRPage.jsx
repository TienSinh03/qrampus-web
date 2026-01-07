import React, { useState } from "react";
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
    DownloadIcon, // Thêm icon X để đóng drawer
} from "lucide-react";

const ViewIcon = Eye;

const AdminDetailSessionQRPage = () => {
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

    const [selectedImage, setSelectedImage] = useState(teacherPhotos[0]);
    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* ===== MAIN CONTENT ===== */}
            <div className="xl:col-span-3 bg-white rounded-b-xl shadow p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 p-5 rounded-lg">
                    <div className="p-4 bg-white rounded-lg shadow-md flex-1">
                        <h2 className="text-xl font-semibold text-green-600 flex items-center gap-2 mb-4">
                            <Book className="w-6 h-6 text-green-600" />
                            NHẬP MÔN LẬP TRÌNH WEB
                        </h2>

                        <div className="text-sm text-gray-500 mb-2">
                            <User className="inline-block w-4 h-4 text-gray-500 mr-2" />
                            <span className="font-semibold">Giảng viên:</span> Nguyễn Văn A - 100000001
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                            <Layers className="inline-block w-4 h-4 text-gray-500 mr-2" />
                            <span className="font-semibold">Hình thức:</span> Lý thuyết
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                            <Clock className="inline-block w-4 h-4 text-gray-500 mr-2" />
                            <span className="font-semibold">Nhóm thực hành:</span> 0
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                            <Clock className="inline-block w-4 h-4 text-gray-500 mr-2" />
                            <span className="font-semibold">Tiết học:</span> 4-6
                        </div>
                    </div>

                    <div className="space-y-2 flex-1 mt-4 md:mt-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 w-24">Mã học phần</span>
                            <input
                                className="border rounded px-3 py-1 text-sm w-full md:w-auto"
                                readOnly
                                placeholder="42000735839"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 w-24">Ngày tạo phiên</span>
                            <input
                                type="date"
                                className="border rounded px-3 py-1 text-sm w-full md:w-auto"
                                placeholder="01/01/2024"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 w-24">Trạng thái</span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                Đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>

                <h3>Trạng thái tạo phiên</h3>

                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Mã học phần</th>
                                <th className="p-3 text-left">Tạo QR trong</th>
                                <th className="p-3 text-left">Số QR sinh ra</th>
                                <th className="p-3 text-left">ĐD thành công</th>
                                <th className="p-3 text-left">ĐD cho phép</th>
                                <th className="p-3 text-left">ĐD vượt quá</th>
                                <th className="p-3 text-left">ĐD (vắng)</th>
                                <th className="p-3 text-left">Hành động</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t">
                                <td className="p-3">42000735839</td>
                                <td className="p-3">5 phút</td>
                                <td className="p-3">30</td>
                                <td className="p-3 font-medium">25</td>
                                <td className="p-3 font-medium">5</td>
                                <td className="p-3 text-red-500">2</td>
                                <td className="p-3 text-gray-500">3</td>
                                <td className="p-5 flex space-x-2">
                                    <button
                                        aria-label="View Details"
                                        title="Xem chi tiết"
                                        className="p-2 rounded-full text-purple-600 hover:bg-purple-100 transition"
                                    >
                                        <ViewIcon size={16} />
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
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center gap-4 mt-2">
                    <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm" onClick={() => setOpen(true)}>
                        <ViewIcon size={16} /> Xem ảnh đã chụp
                    </button>
                    <button
                        aria-label="Download Report"
                        title="Tải ảnh đã chụp xuống"
                        className="p-2 rounded-full text-purple-600 hover:bg-purple-100 transition"
                    >
                        <DownloadCloudIcon className="w-5 h-5 text-purple-600 hover:text-purple-800 cursor-pointer" />
                    </button>
                    <button
                        aria-label="Download Report"
                        title="Tải ảnh chụp theo model, phân tích xuống"
                        className="p-2 rounded-full text-purple-600 hover:bg-purple-100 transition"
                    >
                        <DownloadIcon className="w-5 h-5 text-purple-600 hover:text-purple-800 cursor-pointer" />
                    </button>
                </div>
                <div className="mt-2">
                    <p className="text-sm text-gray-900">
                        Số lượng sinh viên từ Model phân tích: <span className="font-semibold text-red-500">40 sinh viên</span>
                    </p>
                </div>

                {/* MODAL XEM ẢNH */}
                {/* ===== MODAL XEM ẢNH GIẢNG VIÊN CHỤP ===== */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
                        <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 rounded-t-xl">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Ảnh lớp học giảng viên đã chụp ({teacherPhotos.length} ảnh)
                                </h3>
                                <button
                                    onClick={() => {
                                        setOpen(false);
                                        setSelectedImage(teacherPhotos[0]);
                                    }}
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none  rounded-full hover:bg-lime-400 transition-all  duration-300 ease-in-out p-2 hover:rotate-90"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Body: Thumbnail trái + Ảnh lớn phải */}
                            <div className="flex flex-1 overflow-hidden">
                                {/* Danh sách thumbnail */}
                                <div className="w-full lg:w-80 bg-gray-50 p-4 overflow-y-auto border-r">
                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                                        {teacherPhotos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                onClick={() => setSelectedImage(photo)}
                                                className={`cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${selectedImage?.id === photo.id ? "border-green-500 shadow-lg" : "border-transparent"
                                                    }`}
                                            >
                                                <img
                                                    src={photo.url}
                                                    alt={photo.caption}
                                                    className="w-full h-40 object-cover hover:opacity-90 transition"
                                                />
                                                <p className="text-center text-sm mt-2 text-gray-700 font-medium">{photo.caption}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Ảnh chi tiết lớn */}
                                <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
                                    {selectedImage ? (
                                        <div className="text-center">
                                            <img
                                                src={selectedImage.url}
                                                alt={selectedImage.caption}
                                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                            />
                                            <p className="mt-6 text-lg font-medium text-gray-800">{selectedImage.caption}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-xl">Chọn ảnh từ danh sách để xem chi tiết</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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

            {/* ===== RIGHT ACTION PANEL ===== */}
            <div className="bg-white rounded-b-xl shadow p-5 space-y-4 h-fit">
                <button
                    className="flex items-center gap-2 border border-emerald-500 text-emerald-500 px-5 
                    py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md 
                    focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200 w-full"
                    onClick={openDrawer}
                >
                    <Send size={16} /> Hỗ trợ tạo QR
                </button>

                <button className="flex items-center gap-2 border border-red-500 text-red-500 px-5 
                    py-2.5 rounded-lg font-medium shadow-sm hover:bg-red-100 hover:shadow-md 
                    focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200 w-full">
                    <Eye size={16} /> Khóa phiên QR
                </button>

                <button className="flex items-center gap-2 border border-gray-500 text-gray-500 px-5 
                    py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:shadow-md 
                    focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 transition-all duration-200 w-full">
                    <Clock size={16} /> Lịch sử tạo QR đã qua
                </button>

                <div className="pt-4 border-t space-y-3 text-sm">
                    <h2 className="w-full rounded px-3 py-2 text-lg font-semibold bg-gray-100">
                        Phiên hôm nay đã tạo
                    </h2>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                            <span className="font-medium text-gray-700">Nguyễn Văn A</span>
                            <span className="text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full border border-red-300">
                                Thất bại 1
                            </span>
                        </div>

                        {/* Các item khác */}
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