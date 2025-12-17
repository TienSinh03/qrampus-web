import React, { useState } from "react";
import { Calendar, Users, Star, TrendingUp, Filter, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

export default function LecturerSurveyManagement() {
    const [selectedSemester, setSelectedSemester] = useState("all");

    // Danh sách tất cả các kỳ mà giảng viên đã dạy (thực tế lấy từ API)
    const semesters = [
        { value: "all", label: "Tất cả học kỳ" },
        { value: "hk1-2024-2025", label: "Học kỳ 1 - 2024/2025", active: true },
        { value: "hk2-2023-2024", label: "Học kỳ 2 - 2023/2024" },
        { value: "hk1-2023-2024", label: "Học kỳ 1 - 2023/2024" },
        { value: "hk2-2022-2023", label: "Học kỳ 2 - 2022/2023" },
        { value: "hk1-2022-2023", label: "Học kỳ 1 - 2022/2023" },
    ];

    // Dữ liệu khảo sát theo từng học kỳ
    const surveyData = [
        { id: 1, maHP: "4203001549", tenHP: "Lập trình thiết bị di động", lop: "20TCLC_DT3", ky: "hk1-2024-2025", soSV: 68, daKhaoSat: 64, tyLe: 94, diemTB: 9.1 },
        { id: 2, maHP: "4203002009", tenHP: "Phát triển ứng dụng Web", lop: "21TCLC_DT1", ky: "hk1-2024-2025", soSV: 54, daKhaoSat: 48, tyLe: 89, diemTB: 8.7 },
        { id: 3, maHP: "4203003259", tenHP: "Nhập môn Trí tuệ nhân tạo", lop: "22TCLC_DT2", ky: "hk1-2024-2025", soSV: 42, daKhaoSat: 28, tyLe: 67, diemTB: 8.2 },
        { id: 4, maHP: "4203003242", tenHP: "Phát triển ứng dụng di động", lop: "20TCLC_DT4", ky: "hk2-2023-2024", soSV: 65, daKhaoSat: 65, tyLe: 100, diemTB: 9.4 },
        { id: 5, maHP: "4203015216", tenHP: "Java Web Application", lop: "21TCLC_DT5", ky: "hk1-2023-2024", soSV: 70, daKhaoSat: 66, tyLe: 94, diemTB: 8.9 },
    ];

    const filteredData = selectedSemester === "all"
        ? surveyData
        : surveyData.filter(item => item.ky === selectedSemester);

    const totalSV = filteredData.reduce((sum, item) => sum + item.soSV, 0);
    const totalDaKS = filteredData.reduce((sum, item) => sum + item.daKhaoSat, 0);
    const avgResponseRate = totalSV > 0 ? Math.round((totalDaKS / totalSV) * 100) : 0;
    const avgScore = filteredData.length > 0
        ? (filteredData.reduce((sum, item) => sum + item.diemTB, 0) / filteredData.length).toFixed(1)
        : "0.0";

    return (
        <div className="min-h-screen from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="mx-auto px-6 py-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                        {/* Tiêu đề + mô tả */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                Quản lý khảo sát đánh giá giảng dạy
                            </h1>
                            <p className="mt-2 text-sm text-gray-600 italic">
                                Xem toàn bộ kết quả khảo sát từ sinh viên qua các học kỳ bạn đã giảng dạy
                            </p>
                        </div>

                        {/* Bộ lọc học kỳ */}
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

                    </div>
                </div>
            </div>



            {/* Tổng quan theo học kỳ đã chọn */}
            <div className="mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Sinh viên khảo sát</p>
                                <p className="text-2xl font-bold text-gray-900 mt-2">{totalSV}</p>
                            </div>
                            <Users className="w-9 h-9 text-blue-500 opacity-80" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Tỷ lệ khảo sát</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-2">{avgResponseRate}%</p>
                            </div>
                            <TrendingUp className="w-9 h-9 text-emerald-500 opacity-80" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Chất lượng dạy</p>
                                <p className="text-2xl font-bold text-amber-600 mt-2 flex items-center gap-2">
                                    {avgScore}
                                    <Star className="w-9 h-9 text-amber-500 fill-current" />
                                </p>
                            </div>
                        </div>
                    </div>



                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600">Học phần đã khảo sát</p>
                                <p className="text-2xl font-bold text-purple-600 mt-2">{filteredData.length}</p>
                            </div>
                            <CheckCircle2 className="w-9 h-9 text-purple-500 opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Bảng danh sách học phần */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 sm:px-8 py-5 sm:py-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                            Danh sách học phần • {semesters.find(s => s.value === selectedSemester)?.label}
                        </h2>
                    </div>

                    {/* Danh sách */}
                    <div className="divide-y divide-gray-100">
                        {filteredData.map((item) => (
                            <div
                                key={item.id}
                                className="px-6 sm:px-8 py-6 hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-purple-50/60 transition-all duration-300 group"
                            >
                                {/* Layout: Desktop = ngang, Mobile = dọc */}
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                                    {/* Phần trái: Avatar + Tên học phần */}
                                    <div className="flex items-center gap-5 flex-1 min-w-0">
                                        {/* Avatar */}
                                        <div className="shrink-0 bg-gradient-to-br from-indigo-600 to-purple-700 text-white w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center font-bold text-xl sm:text-2xl shadow-lg">
                                            <span>LC</span>
                                        </div>

                                        {/* Thông tin học phần */}
                                        <div className="min-w-0">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                                                {item.tenHP}
                                                <span className="text-sm sm:text-lg font-normal text-blue-600 ml-2 sm:ml-3">
                                                    <a href="#" className="hover:underline">
                                                        ({item.maHP})
                                                    </a>
                                                </span>
                                            </h3>
                                            <p className="text-gray-600 mt-1 flex items-center gap-2 text-sm sm:text-base">
                                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                                {semesters.find(s => s.value === item.ky)?.label}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Phần phải: Thống kê + Nút (trên mobile sẽ xếp dọc) */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-10">
                                        {/* Tỷ lệ khảo sát */}
                                        <div className="text-center sm:text-left">
                                            <p className="text-xs sm:text-sm text-gray-600">Sinh viên khảo sát</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-1">{item.tyLe}%</p>
                                            <div className="w-28 sm:w-32 mt-2 mx-auto sm:mx-0 bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${item.tyLe >= 90
                                                            ? "bg-emerald-500"
                                                            : item.tyLe >= 70
                                                                ? "bg-amber-500"
                                                                : "bg-red-500"
                                                        }`}
                                                    style={{ width: `${item.tyLe}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{item.daKhaoSat}/{item.soSV} SV</p>
                                        </div>

                                        {/* Điểm trung bình */}
                                        <div className="text-center sm:text-left">
                                            <p className="text-xs sm:text-sm text-gray-600">Chất lượng dạy</p>
                                            <p className="text-2xl font-bold text-indigo-600 flex items-center justify-center sm:justify-start gap-2 mt-1">
                                                {item.diemTB}
                                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                            </p>
                                        </div>

                                        {/* Nút Chi tiết - full width trên mobile */}
                                        <button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                            Chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty state */}
                    {filteredData.length === 0 && (
                        <div className="text-center py-20 px-6">
                            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg sm:text-xl text-gray-500">Chưa có dữ liệu khảo sát trong học kỳ này</p>
                            <p className="text-sm text-gray-400 mt-2">Hãy chọn học kỳ khác hoặc chờ sinh viên đánh giá</p>
                        </div>
                    )}
                </div>

                {/* Ghi chú */}
                <div className="mt-10 text-center text-gray-600 bg-white/70 backdrop-blur rounded-2xl py-6 border">
                    <p className="text-lg font-medium">
                        Dữ liệu khảo sát được cập nhật tự động sau khi sinh viên hoàn thành phiếu đánh giá •
                        <span className="text-indigo-600 font-bold"> Bảo mật tuyệt đối</span>
                    </p>
                </div>
            </div>
        </div>
    );
}