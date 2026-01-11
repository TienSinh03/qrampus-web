import React, { useState } from "react";
import {
  Calendar,
  Users,
  Star,
  TrendingUp,
  Filter,
  ChevronDown,
  CheckCircle2,
  Eye, ArrowDownToLine, FileSpreadsheet, FilterX, File, Settings, X, Camera,
  Printer, FileSearchIcon
} from "lucide-react";

export default function LecturerSurveyManagement() {
  const [selectedSemester, setSelectedSemester] = useState("all");

  const semesters = [
    { value: "all", label: "Tất cả học kỳ" },
    { value: "hk1-2024-2025", label: "Học kỳ 1 - 2024/2025" },
    { value: "hk2-2023-2024", label: "Học kỳ 2 - 2023/2024" },
    { value: "hk1-2023-2024", label: "Học kỳ 1 - 2023/2024" },
  ];

  const surveyData = [
    {
      id: 1,
      maHP: "4203001549",
      tenHP: "Lập trình thiết bị di động",
      lop: "20TCLC_DT3",
      ky: "hk1-2024-2025",
      soSV: 68,
      daKhaoSat: 64,
      tyLe: 94,
      trungbinhdanhgia: 9.1,
    },
    {
      id: 2,
      maHP: "4203002009",
      tenHP: "Phát triển ứng dụng Web",
      lop: "21TCLC_DT1",
      ky: "hk1-2024-2025",
      soSV: 54,
      daKhaoSat: 48,
      tyLe: 89,
      trungbinhdanhgia: 8.7,
    },
    {
      id: 3,
      maHP: "4203003259",
      tenHP: "Nhập môn AI",
      lop: "22TCLC_DT2",
      ky: "hk1-2024-2025",
      soSV: 42,
      daKhaoSat: 28,
      tyLe: 67,
      trungbinhdanhgia: 8.2,
    },
  ];

  const filtered =
    selectedSemester === "all"
      ? surveyData
      : surveyData.filter((i) => i.ky === selectedSemester);

  const totalSV = filtered.reduce((s, i) => s + i.soSV, 0);
  const totalKS = filtered.reduce((s, i) => s + i.daKhaoSat, 0);
  const avgRate = totalSV ? Math.round((totalKS / totalSV) * 100) : 0;
  const avgScore = filtered.length
    ? (filtered.reduce((s, i) => s + i.trungbinhdanhgia, 0) / filtered.length).toFixed(1)
    : "0.0";


  // cột , bảng
  const [visibleCols, setVisibleCols] = useState({
    mahocphan: true,
    lop: true,
    nhomthuchanh: true,
    sobuoidiemdanh: false,
    svkhaosat: true,
    tyle: true,
    tbkhaosat: true,
    detail: true,
  });
  // drawer xuất excel
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        {/* INFO + STATS */}
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="bg-white border shadow-sm rounded-b-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">

            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
              <TrendingUp size={30} />
            </div>

            {/* Title */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl font-bold text-gray-800">
                Thống kê khảo sát
              </h2>
              <p className="text-gray-500 mt-1">
                Tổng hợp kết quả khảo sát theo học kỳ
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto text-center">

              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-blue-600">
                  {totalSV}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  SV khảo sát
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-emerald-600">
                  {avgRate}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tỷ lệ
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-1">
                  {avgScore}
                  <Star size={18} />
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Trung bình điểm đánh giá
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-600">
                  {filtered.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Học phần
                </p>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-white border  p-6">
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
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã học phần
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 4203001549"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên môn học / học phần
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Lập trình thiết bị di động"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên lớp
              </label>
              <input
                type="text"
                placeholder="Ví dụ: 20TCLC_DT3"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Học kỳ / năm học
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {semesters.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>


          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-start md:justify-end gap-4">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              {/* Xóa bộ lọc */}
              <button className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200" >
                <FileSearchIcon className="w-5 h-5" />
                Tìm kiếm
              </button>
              <button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-50  focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200" onClick={() => setIsDrawerOpen(true)}>
                <FileSpreadsheet className="w-5 h-5" />
                Tải Excel
              </button>
              {/* <button className="flex items-center gap-2 border border-amber-400 text-amber-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-amber-50 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200">
                <Printer className="w-5 h-5" />
                In báo cáo
              </button> */}
              <button className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200">
                <FilterX className="w-5 h-5" />
                Xóa bộ lọc
              </button>

              <details className="relative">
                <summary className="list-none flex items-center gap-2 border border-sky-300 text-sky-700 bg-white px-5 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-sky-50 hover:border-sky-400 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200">
                  <Settings className="w-5 h-5" />
                  Hiển thị cột
                </summary>

                <div className="absolute right-0 mt-2 w-100% bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 text-sm">
                  {[
                    ["mahocphan", "Học phần"],
                    ["lop", "Lớp"],
                    ["nhomthuchanh", "Nhóm thực hành"],
                    ["sobuoidiemdanh", "Số buổi điểm danh"],
                    ["svkhaosat", "SV khảo sát"],
                    ["tyle", "Tỷ lệ"],
                    ["tbkhaosat", "TB khảo sát"],
                    ["detail", "Chi tiết"],
                  ].map(([key, label]) => {
                    const active = visibleCols[key];

                    return (
                      <div
                        key={key}
                        onClick={() =>
                          setVisibleCols(prev => ({
                            ...prev,
                            [key]: !prev[key],
                          }))
                        }
                        className={`px-3 py-2 rounded cursor-pointer flex items-center justify-between transition
            ${active
                            ? "bg-sky-50 text-sky-600 font-medium"
                            : "hover:bg-gray-50 text-gray-700"
                          }`}
                      >
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </details>


            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  {visibleCols.mahocphan && (
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Học phần
                    </th>
                  )}

                  {visibleCols.lop && (
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Lớp
                    </th>
                  )}

                  {visibleCols.nhomthuchanh && (
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Nhóm thực hành
                    </th>
                  )}

                  {visibleCols.sobuoidiemdanh && (
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Số buổi điểm danh
                    </th>
                  )}

                  {visibleCols.svkhaosat && (
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      SV khảo sát
                    </th>
                  )}

                  {visibleCols.tyle && (
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Tỷ lệ
                    </th>
                  )}

                  {visibleCols.tbkhaosat && (
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      TB khảo sát
                    </th>
                  )}

                  {visibleCols.detail && (
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Chi tiết
                    </th>
                  )}
                </tr>
              </thead>


              <tbody className="divide-y">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {visibleCols.mahocphan && (
                      <td className="px-6 py-4 font-medium">
                        {item.tenHP}
                        <div className="text-sm text-gray-500">{item.maHP}</div>
                      </td>
                    )}

                    {visibleCols.lop && (
                      <td className="px-6 py-4">{item.lop}</td>
                    )}

                    {visibleCols.nhomthuchanh && (
                      <td className="px-6 py-4">ĐIỀN SỐ NHÓM</td>
                    )}

                    {visibleCols.sobuoidiemdanh && (
                      <td className="px-6 py-4">LẤY SỐ BUỔI TẠO QR</td>
                    )}

                    {visibleCols.svkhaosat && (
                      <td className="px-6 py-4 text-center">
                        {item.daKhaoSat}/{item.soSV}
                      </td>
                    )}

                    {visibleCols.tyle && (
                      <td className="px-6 py-4 text-center font-bold">
                        {item.tyLe}%
                      </td>
                    )}

                    {visibleCols.tbkhaosat && (
                      <td className="px-6 py-4 text-center text-amber-600 font-bold">
                        {item.trungbinhdanhgia}
                      </td>
                    )}

                    {visibleCols.detail && (
                      <td className="px-6 py-4 text-center">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                          <Eye size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
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
}
