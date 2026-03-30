import React, { useState } from "react";
import {
  Users,
  UserCheck,
  AlertTriangle,
  QrCode,
  Eye,
  LockKeyhole,
  CirclePlus,
  CloudUpload,
  FileSearch as FileSearchIcon,
  FileSpreadsheet,
  FileDown,
  FilterX,
  ArrowUp,
  ArrowDown,
  Clock3,
  ShieldCheck,
} from "lucide-react";

import StatsCard from "../../../components/common/StatsCard";
import Pagination from "../../../components/common/Pagination";

const AttendanceTimesheetManagementPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    code: "",
    name: "",
    month: "",
    fromDate: "",
    toDate: "",
    teacher: "",
  });

  const data = [
    {
      id: 1,
      teacher: "Nguyễn Văn A",
      subject: "Lập trình Web",
      subjectCode: "INT3104",
      class: "CNTT1",
      date: "12/03/2026",
      startTime: "07:30",
      endTime: "09:00",
      students: 45,
      scanned: 40,
      status: "valid",
    },
    {
      id: 2,
      teacher: "Trần Thị B",
      subject: "Cơ sở dữ liệu",
      subjectCode: "INT2202",
      class: "CNTT2",
      date: "14/03/2026",
      startTime: "--",
      endTime: "--",
      students: 50,
      scanned: 0,
      status: "missing",
    },
  ];

  const monthOptions = [
    { value: "", label: "Tất cả" },
    { value: "1", label: "Tháng 1" },
    { value: "2", label: "Tháng 2" },
    { value: "3", label: "Tháng 3" },
    { value: "4", label: "Tháng 4" },
    { value: "5", label: "Tháng 5" },
    { value: "6", label: "Tháng 6" },
    { value: "7", label: "Tháng 7" },
    { value: "8", label: "Tháng 8" },
    { value: "9", label: "Tháng 9" },
    { value: "10", label: "Tháng 10" },
    { value: "11", label: "Tháng 11" },
    { value: "12", label: "Tháng 12" },
  ];
  const totalRecords = 120;

  const handleTempFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", tempFilters);
  };

  const handleClearFilters = () => {
    setTempFilters({
      code: "",
      name: "",
      month: "",
      fromDate: "",
      toDate: "",
      teacher: "",
    });
    setSelectedRows([]);
    setSelectAllPages(false);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
      setSelectAllPages(false);
      return;
    }
    setSelectedRows(data.map((item) => item.id));
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((item) => item !== id));
      return;
    }
    setSelectedRows([...selectedRows, id]);
  };

  const renderStatus = (status) => {
    const styles = {
      valid: "bg-green-100 text-green-600",
      warning: "bg-yellow-100 text-yellow-600",
      missing: "bg-red-100 text-red-600",
    };
    const labels = {
      valid: "Hợp lệ",
      warning: "Thiếu SV",
      missing: "Chưa lên lớp/QR",
    };

    return (
      <span className={`${styles[status]} px-3 py-1 rounded-full text-xs font-medium`}>
        {labels[status]}
      </span>
    );
  };

  const totalSessions = data.length;
  const validSessions = data.filter((item) => item.status === "valid").length;
  const warningSessions = data.filter((item) => item.status !== "valid").length;
  const qrUsageRate =
    totalSessions > 0
      ? `${Math.round(
          (data.filter((item) => item.startTime !== "--" && item.endTime !== "--").length / totalSessions) * 100
        )}%`
      : "0%";

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < data.length;
  const selectedCount = selectAllPages ? totalRecords : selectedRows.length;

  return (
    <div className="min-h-screen bg-gray-50 p-1">
      <div className="mx-auto">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Tổng tiết dạy"
            value={totalSessions}
            percent="(+4.2%)"
            positive
            subtitle="Trong kỳ hiện tại"
            icon={<Users className="w-6 h-6 text-indigo-600" />}
            iconBg="bg-indigo-100"
          />
          <StatsCard
            title="Công hợp lệ"
            value={validSessions}
            percent="(+2.1%)"
            positive
            subtitle="Đã xác minh"
            icon={<UserCheck className="w-6 h-6 text-emerald-600" />}
            iconBg="bg-emerald-100"
          />
          <StatsCard
            title="Cảnh báo/Bất thường"
            value={warningSessions}
            percent="(-1.3%)"
            positive={false}
            subtitle="Cần rà soát"
            icon={<AlertTriangle className="w-6 h-6 text-amber-600" />}
            iconBg="bg-amber-100"
          />
          <StatsCard
            title="Tỷ lệ dùng QR"
            value={qrUsageRate}
            percent="(+0.8%)"
            positive
            subtitle="Theo Start/End"
            icon={<QrCode className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-100"
          />
        </div>

        <div className="bg-white border p-6">
          <div className="flex items-center gap-2 mb-4 text-gray-800 font-semibold">
            <FileSearchIcon className="w-4 h-4" />
            <span>Bộ lọc quản lý công</span>
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
                name="code"
                value={tempFilters.code}
                onChange={handleTempFilterChange}
                placeholder="Ví dụ: INT3104"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
              <input
                type="text"
                name="teacher"
                value={tempFilters.teacher}
                onChange={handleTempFilterChange}
                placeholder="Nhập tên giảng viên"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tháng</label>
              <select
                name="month"
                value={tempFilters.month}
                onChange={handleTempFilterChange}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {monthOptions.map((month) => (
                  <option key={month.value || "all"} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
              <input
                type="date"
                name="fromDate"
                value={tempFilters.fromDate}
                onChange={handleTempFilterChange}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
              <input
                type="date"
                name="toDate"
                value={tempFilters.toDate}
                onChange={handleTempFilterChange}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {expanded && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên học phần</label>
                  <input
                    type="text"
                    name="name"
                    value={tempFilters.name}
                    onChange={handleTempFilterChange}
                    placeholder="Ví dụ: Lập trình Web"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mốc thời gian</label>
                  <div className="w-full rounded-lg border px-3 py-2 text-gray-500 flex items-center gap-2">
                    <Clock3 className="w-4 h-4" />
                    Toàn bộ buổi học
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái kiểm duyệt</label>
                  <div className="w-full rounded-lg border px-3 py-2 text-gray-500 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Tất cả trạng thái
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between justify-start md:justify-end">
            <div className="flex flex-wrap items-center gap-3">
              <button
                title="Thêm công thủ công"
                className="flex items-center gap-2 border border-emerald-500 text-emerald-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
              >
                <CirclePlus className="w-5 h-5" />
              </button>

              <button
                onClick={handleApplyFilters}
                className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
              >
                <FileSearchIcon className="w-5 h-5" />
              </button>

              <button
                title="Upload bảng công"
                className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
              >
                <CloudUpload className="w-5 h-5" />
              </button>

              <button
                disabled={selectedCount === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ${
                  selectedCount > 0
                    ? "border border-emerald-400 text-emerald-400 hover:bg-emerald-100 hover:shadow-md focus:ring-emerald-500"
                    : "border border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
                {selectedCount > 0 && (
                  <span className="ml-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {selectedCount}
                  </span>
                )}
              </button>

              <button
                title="Tải file mẫu"
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
              >
                <FileDown className="w-5 h-5" />
              </button>

              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
              >
                <FilterX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-full overflow-x-auto bg-white shadow mb-6 mt-6">
          {isAllSelected && !selectAllPages && totalRecords > data.length && (
            <div className="bg-blue-50 border-x border-b border-blue-200 px-4 py-2.5 text-sm text-center text-blue-800">
              Đã chọn <strong>{selectedRows.length}</strong> bản ghi trên trang này.{" "}
              <button
                onClick={() => {
                  setSelectAllPages(true);
                  setSelectedRows(data.map((item) => item.id));
                }}
                className="text-blue-600 underline font-medium hover:text-blue-800"
              >
                Chọn tất cả {totalRecords} bản ghi trong tất cả trang
              </button>
            </div>
          )}

          {selectAllPages && (
            <div className="bg-blue-100 border-x border-b border-blue-300 px-4 py-2.5 text-sm text-center text-blue-800">
              Đã chọn <strong>{selectedCount}</strong> bản ghi trong tất cả trang.{" "}
              <button
                onClick={() => {
                  setSelectAllPages(false);
                  setSelectedRows([]);
                }}
                className="text-blue-600 underline font-medium hover:text-blue-800"
              >
                Bỏ chọn tất cả
              </button>
            </div>
          )}

          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100">
                <th className="w-12">
                  <input
                    type="checkbox"
                    className="ml-4 cursor-pointer"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="h-12 px-4">Giảng viên</th>
                <th className="h-12 px-4">Mã học phần</th>
                <th className="h-12 px-4">Học phần</th>
                <th className="h-12 px-4 text-center">Ngày dạy</th>
                <th className="h-12 px-4 text-center">QR Start</th>
                <th className="h-12 px-4 text-center">QR End</th>
                <th className="h-12 px-4 text-center">Sinh viên</th>
                <th className="h-12 px-4 text-center">Trạng thái</th>
                <th className="h-12 px-4 text-center">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className={`h-12 border-t hover:bg-slate-50 ${selectedRows.includes(item.id) ? "bg-blue-50" : ""}`}
                >
                  <td>
                    <input
                      type="checkbox"
                      className="ml-4 cursor-pointer"
                      checked={selectedRows.includes(item.id)}
                      onChange={() => toggleSelectRow(item.id)}
                    />
                  </td>
                  <td className="px-4 min-w-max font-medium text-gray-900">{item.teacher}</td>
                  <td className="px-4 min-w-max font-medium text-gray-900">{item.subjectCode}</td>
                  <td className="px-4">
                    <div className="font-medium text-gray-900">{item.subject}</div>
                  </td>
                  <td className="px-4 text-center text-gray-600">{item.date}</td>
                  <td className="px-4 text-center font-mono text-xs">{item.startTime}</td>
                  <td className="px-4 text-center font-mono text-xs">{item.endTime}</td>
                  <td className="px-4 text-center">
                    <div className="text-xs font-semibold">
                      {item.scanned}/{item.students}
                    </div>
                    <div className="w-16 bg-gray-200 h-1.5 rounded-full mt-1 mx-auto">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${(item.scanned / item.students) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 text-center">{renderStatus(item.status)}</td>
                  <td className="px-4">
                    <div className="flex justify-center gap-3">
                      <button title="Xem chi tiết" className="text-blue-500">
                        <Eye className="cursor-pointer w-5 h-5" />
                      </button>
                      <button title="Chốt/Khóa công" className="text-amber-500">
                        <LockKeyhole className="cursor-pointer w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-2 mb-4">
          <span className="text-sm text-gray-500">
            Tổng: <strong>120</strong> bản ghi công
          </span>
          <Pagination currentPage={1} totalPages={10} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceTimesheetManagementPage;
