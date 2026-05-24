import React, { useState, useEffect } from "react";
import { X, Download, LayoutList, Layers, FolderOpen } from "lucide-react";

const ModalExportWorkloadDepartment = ({
  isOpen,
  onClose,
  onExport,
  loading = false,
  loadingText = "",
}) => {
  const [filterType, setFilterType] = useState("semester"); // "semester" | "date"
  const [year, setYear]             = useState("");
  const [semester, setSemester]     = useState("");
  const [fromDate, setFromDate]     = useState("");
  const [toDate, setToDate]         = useState("");
  const [mode, setMode]             = useState("single"); // "single" | "multi" | "folder"
  const [filename, setFilename]     = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const today = new Date();
    const cy    = today.getFullYear();
    const cm    = today.getMonth() + 1;
    const sem   = cm >= 9 || cm <= 1 ? "1" : "2";
    const displayYear = cm >= 9 ? cy : cy - 1;
    setYear(String(displayYear));
    setSemester(sem);
    setFromDate(new Date(cy, today.getMonth(), 1).toISOString().split("T")[0]);
    setToDate(today.toISOString().split("T")[0]);
    setFilterType("semester");
    setMode("single");
    setFilename(`cong_day_toan_truong_${today.toISOString().split("T")[0]}`);
  }, [isOpen]);

  const filterOk =
    filterType === "semester" ? (year && semester) : (fromDate && toDate);
  const canExport = filterOk && (mode === "folder" || filename.trim());

  const handleExport = () => {
    if (!canExport) return;
    onExport({
      filterType,
      year:      filterType === "semester" ? year      : undefined,
      semester:  filterType === "semester" ? semester  : undefined,
      from_date: filterType === "date"     ? fromDate  : undefined,
      to_date:   filterType === "date"     ? toDate    : undefined,
      mode,
      filename:  mode !== "folder" ? filename.trim() : undefined,
    });
  };

  if (!isOpen) return null;

  const yearOptions = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - i);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[999]" onClick={!loading ? onClose : undefined} />

      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-lg bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Tải dữ liệu chấm công</h3>
            <p className="text-sm text-gray-600 mt-0.5">Xuất công dạy toàn bộ giảng viên theo bộ lọc</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-blue-200 transition-all duration-300 p-2 hover:rotate-90 disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 pb-32 space-y-5">

          {/* Filter type toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lọc theo <span className="text-red-500">*</span>
            </label>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setFilterType("semester")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  filterType === "semester"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Học kỳ &amp; Năm học
              </button>
              <button
                type="button"
                onClick={() => setFilterType("date")}
                className={`flex-1 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${
                  filterType === "date"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Khoảng ngày
              </button>
            </div>
          </div>

          {/* Filter inputs */}
          {filterType === "semester" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Năm học</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn năm --</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}–{y + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Học kỳ</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn kỳ --</option>
                  <option value="1">Học kỳ 1</option>
                  <option value="2">Học kỳ 2</option>
                  <option value="3">Học kỳ hè</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Filename (hidden for folder mode) */}
          {mode !== "folder" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên file <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Nhập tên file"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <span className="text-gray-500 font-medium whitespace-nowrap">.xlsx</span>
              </div>
            </div>
          )}

          {/* Export mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kiểu xuất <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2.5">

              <label className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                mode === "single" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}>
                <input
                  type="radio"
                  name="dept-export-mode"
                  value="single"
                  checked={mode === "single"}
                  onChange={() => setMode("single")}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-800 text-sm">
                    <LayoutList className="w-4 h-4 text-blue-600" />
                    1 Sheet toàn trường
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tất cả buổi dạy trong 1 sheet, sắp theo giảng viên → môn học → ngày
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                mode === "multi" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}>
                <input
                  type="radio"
                  name="dept-export-mode"
                  value="multi"
                  checked={mode === "multi"}
                  onChange={() => setMode("multi")}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-800 text-sm">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Nhiều Sheet (theo giảng viên)
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Mỗi sheet là 1 giảng viên, tên sheet là mã + tên GV, chi tiết đầy đủ bên trong
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                mode === "folder" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
              }`}>
                <input
                  type="radio"
                  name="dept-export-mode"
                  value="folder"
                  checked={mode === "folder"}
                  onChange={() => setMode("folder")}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-800 text-sm">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    Xuất thư mục (theo giảng viên)
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Mỗi giảng viên là 1 thư mục{" "}
                    <code className="bg-gray-100 px-1 rounded">mã_họtên</code>.
                    Trong thư mục có 1 file tổng công và các file chia theo từng môn học.
                  </p>
                  {mode === "folder" && (
                    <p className="text-xs text-amber-600 mt-2 bg-amber-50 px-2 py-1.5 rounded border border-amber-200">
                      Yêu cầu trình duyệt Chrome/Edge. Hệ thống sẽ yêu cầu quyền truy cập
                      thư mục trước khi tải dữ liệu.
                    </p>
                  )}
                </div>
              </label>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          {loading && loadingText ? (
            <p className="flex-1 text-xs text-blue-600 self-center animate-pulse">{loadingText}</p>
          ) : (!canExport && (
            <p className="flex-1 text-xs text-amber-600 self-center">
              {!filterOk
                ? filterType === "semester"
                  ? "Vui lòng chọn năm học và học kỳ"
                  : "Vui lòng chọn khoảng ngày"
                : !filename.trim() && mode !== "folder"
                ? "Vui lòng nhập tên file"
                : ""}
            </p>
          ))}
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            disabled={!canExport || loading}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {mode === "folder" ? "Chọn thư mục & Xuất" : "Xuất Excel"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalExportWorkloadDepartment;
