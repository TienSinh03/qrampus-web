import React, { useState } from "react";
import {
  Calendar,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  TrendingUp,
  Star, ArrowDown, ArrowUp, FileSpreadsheet, File, FilterX, FileSearchIcon
} from "lucide-react";

export default function LeavePage() {
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const semesters = [
    { value: "all", label: "Tất cả học kỳ" },
    { value: "hk1-2024-2025", label: "HK1 2024-2025" },
    { value: "hk2-2023-2024", label: "HK2 2023-2024" },
    { value: "hk1-2023-2024", label: "HK1 2023-2024" },
  ];

  // Mock data
  const leaves = [
    {
      id: 1,
      mssv: "21010611",
      hoTen: "Nguyễn Văn An",
      lop: "20TCLC_DT3",
      hocPhan: "Lập trình thiết bị di động",
      ngayNghi: "2025-04-05",
      lyDo: "Khám bệnh (có giấy bệnh viện)",
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
      trangThai: "approved",
      ghiChu: "",
      ky: "hk2-2023-2024",
    },
  ];

  const filtered = leaves.filter((item) => {
    if (selectedSemester !== "all" && item.ky !== selectedSemester)
      return false;
    if (statusFilter !== "all" && item.trangThai !== statusFilter) return false;
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "pending":
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return null;
    }
  };
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
      <div className="bg-white border shadow-sm rounded-b-xl p-6 mb-6">
        <div className="flex flex-col lg:flex-row items-center gap-6">

          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
            <AlertCircle size={30} />
          </div>

          {/* Title */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-xl font-bold text-gray-800">
              Thống kê minh chứng
            </h2>
            <p className="text-gray-500 mt-1">
              Tổng hợp tình trạng xử lý đơn nghỉ học
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto text-center">

            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-blue-600">
                {leaves.length}                </p>
              <p className="text-sm text-gray-600 mt-1">
                Tổng đơn xin
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-emerald-600">
                {leaves.filter((l) => l.trangThai === "pending").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Chờ duyệt đơn
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-1">
                {leaves.filter((l) => l.trangThai === "approved").length}
                <Star size={18} />
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Đã duyệt
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-3xl font-bold text-purple-600">
                {leaves.filter((l) => l.trangThai === "rejected").length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Từ chối
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
          <span>Bộ lọc đơn xin phép</span>
          <button onClick={() => setExpanded(!expanded)} className="flex items-center text-blue-600 hover:text-blue-800 ml-auto">
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

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái đơn
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày nghỉ
            </label>
            <input
              type="date"
              placeholder="Ví dụ: 05/04/2025"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


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

          {expanded && (
            <>
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
                  Mã số sinh viên
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 20TCLC_DT3"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên sinh viên
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 20TCLC_DT3"
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-start md:justify-end gap-4">
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            {/* Xóa bộ lọc */}
            <button
              className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
            >
              <FileSearchIcon className="w-5 h-5" />
              Tìm kiếm
            </button>
            <button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200">
              <FileSpreadsheet className="w-5 h-5" />
              Tải Excel
            </button>
            <button className="flex items-center gap-2 border border-amber-400 text-amber-400 px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none hover:bg-amber-50 focus:ring-1 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200">
              <File className="w-5 h-5" />
              Tải PDF
            </button>
            <button className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200">
              <FilterX className="w-5 h-5" />
              Xóa bộ lọc
            </button>






          </div>

        </div>
      </div>

      <div className="mx-auto">
        <div className="bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Sinh viên
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Ngày nghỉ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Học phần
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Lý do
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Hành động
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    {/* Sinh viên */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{item.hoTen}</p>
                        <p className="text-sm text-gray-500">{item.mssv}</p>
                      </div>
                    </td>

                    {/* Ngày nghỉ */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar size={14} />
                        {new Date(item.ngayNghi).toLocaleDateString("vi-VN")}
                      </div>
                    </td>

                    {/* Học phần */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{item.hocPhan}</p>
                      <p className="text-xs text-gray-500">{item.lop}</p>
                    </td>

                    {/* Lý do */}
                    <td className="px-6 py-4">
                      <p className="text-sm italic text-gray-700 line-clamp-2">
                        {item.lyDo}
                      </p>
                      {item.ghiChu && (
                        <p className="text-xs italic text-gray-500 mt-1">
                          Ghi chú: {item.ghiChu}
                        </p>
                      )}
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 text-center">
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${getStatusBadge(
                          item.trangThai
                        )}`}
                      >
                        {getStatusIcon(item.trangThai)}
                        {item.trangThai === "approved"
                          ? "Đã duyệt"
                          : item.trangThai === "rejected"
                            ? "Từ chối"
                            : "Chờ duyệt"}
                      </div>
                    </td>

                    {/* Hành động */}
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 rounded-full hover:bg-gray-100 transition">
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
