import React, { useState } from "react";
import {
  Calendar,
  Users,
  Star,
  TrendingUp,
  Filter,
  ChevronDown,
  CheckCircle2,
  Eye,
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
                  Điểm TB
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
          <div className="flex flex-wrap gap-3 mt-6">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              Lọc
            </button>

            <button className="flex items-center gap-2 border border-green-600 text-green-600 px-5 py-2 rounded-lg hover:bg-green-50">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-8 14H8v-4h3v4zm0-6H8V7h3v4zm5 6h-3v-7h3v7zm0-9h-3V7h3v1z" />
              </svg>
              Export Excel
            </button>

            <button className="flex items-center gap-2 border px-5 py-2 rounded-lg hover:bg-gray-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Học phần
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Lớp
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    SV khảo sát
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Tỷ lệ
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Điểm TB
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Chi tiết
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      {item.tenHP}
                      <div className="text-sm text-gray-500">{item.maHP}</div>
                    </td>
                    <td className="px-6 py-4">{item.lop}</td>
                    <td className="px-6 py-4 text-center">
                      {item.daKhaoSat}/{item.soSV}
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      {item.tyLe}%
                    </td>
                    <td className="px-6 py-4 text-center text-amber-600 font-bold">
                      {item.trungbinhdanhgia}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 rounded-full hover:bg-gray-100">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
