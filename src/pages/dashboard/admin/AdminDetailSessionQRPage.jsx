import React from "react";
import {
    Send,
    Eye,
    Save,
    Plus,
    X, User, Book, Layers, Clock,
    ViewIcon
} from "lucide-react";
import { Views } from "react-big-calendar";

const AdminDetailSessionQRPage = () => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* ===== MAIN CONTENT ===== */}
            <div className="xl:col-span-3 bg-white rounded-xl shadow p-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50 p-5 rounded-lg">
                    <div className="p-4 bg-white rounded-lg shadow-md flex-1">
                        <h2 className="text-xl font-semibold text-purple-600 flex items-center gap-2 mb-4">
                            <Book className="w-6 h-6 text-purple-600" />
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
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                Đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>




                <h3>Trạng thái tạo phiên </h3>

                {/* Items Table with Horizontal Scrolling */}
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm table-auto">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-left">Mã học phần</th>
                                <th className="p-3 text-left">Tạo QR trong</th>
                                <th className="p-3 text-left">Số QR sinh ra</th>
                                <th className="p-3 text-left">Điểm danh thành công</th>
                                <th className="p-3 text-left">Điểm danh cho phép</th>
                                <th className="p-3 text-left">Điểm danh vượt quá</th>
                                <th className="p-3 text-left">Điểm danh (vắng)</th>
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
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm">
                        <ViewIcon size={16} /> Xem ảnh lớp học Giảng viên đã chụp
                    </button>
                    <p className="text-sm text-gray-900">Số lượng sinh viên từ Model phân tích: <span className="font-semibold text-red-500">40 sinh viên</span></p>
                </div>

                {/* Footer */}
                <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                    <div>
                        <label className="text-sm text-gray-500">Salesperson</label>
                        <input
                            className="mt-2 border rounded px-3 py-2 w-full text-sm"
                            defaultValue="Tommy Shelby"
                        />
                        <textarea
                            className="mt-2 border rounded px-3 py-2 w-full text-sm"
                            placeholder="Thanks for your business"
                        ></textarea>

                    </div>

                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>$1800</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>$28</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>21%</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>$1690</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== RIGHT ACTION PANEL ===== */}
            <div className="bg-white rounded-xl shadow p-5 space-y-4 h-fit">
                <button className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
                    <Send size={16} /> Hỗ trợ tạo QR
                </button>

                <button className="w-full flex items-center justify-center gap-2 bg-red-500 border text-white py-2 rounded hover:bg-red-400 ">
                    <Eye size={16} /> Khóa phiên QR
                </button>

                <button className="w-full flex items-center justify-center gap-2 border py-2 rounded hover:bg-gray-50">
                    <Clock size={16} /> Lịch sử tạo QR đã qua
                </button>

                <div className="pt-4 border-t space-y-3 text-sm">
                    <h2 className="w-full rounded px-3 py-2 text-lg font-semibold bg-gray-100">
                        Phiên hôm nay đã tạo
                    </h2>

                    <div className="space-y-1">
                        <div className="flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                            <span className="font-medium text-gray-700">Nguyễn Văn A</span>
                            <span className="text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full border border-red-300">Thất bại 1</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                            <span className="font-medium text-gray-700">Nguyễn Văn A</span>
                            <span className="text-red-500 font-semibold bg-red-100 px-2 py-1 rounded-full border border-red-300">Thất bại 2</span>
                        </div>
                        <div className="flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white shadow-sm">
                            <span className="font-medium text-gray-700">Admin, QTV</span>
                            <span className="text-green-500 font-semibold bg-green-100 px-2 py-1 rounded-full border border-green-300">Duyệt qua Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailSessionQRPage;
