import React, { useState, useEffect } from "react";
import { X, Download, LayoutList, Layers } from "lucide-react";

const ModalExportAttendanceWorkload = ({
  isOpen,
  onClose,
  onExport,
  loading = false,
  teacher = null,
}) => {
  const [filename, setFilename] = useState("");
  const [mode, setMode] = useState("single");

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      const code = teacher?.teacher_code || teacher?.code || "";
      setFilename(`cong_day_${code ? code + "_" : ""}${today}`);
      setMode("single");
    }
  }, [isOpen, teacher]);

  if (!isOpen) return null;

  const handleExport = () => {
    if (!filename.trim()) return;
    onExport({ filename: filename.trim(), mode });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Xuất dữ liệu công dạy
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {teacher ? `Giảng viên: ${teacher.full_name}` : "Tất cả giảng viên"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-blue-200 transition-all duration-300 p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto pb-32 space-y-6">
          {/* Filename */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên file <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Nhập tên file"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-gray-500 font-medium whitespace-nowrap">.xlsx</span>
            </div>
          </div>

          {/* Mode selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Kiểu xuất <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {/* Single sheet */}
              <label
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  mode === "single"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="export-mode"
                  value="single"
                  checked={mode === "single"}
                  onChange={() => setMode("single")}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <LayoutList className="w-4 h-4 text-blue-600" />
                    1 Sheet duy nhất
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Tất cả môn học trong 1 sheet, sắp xếp theo mã môn học.
                    Mỗi nhóm môn có tiêu đề phân cách riêng.
                  </p>
                </div>
              </label>

              {/* Multi sheet */}
              <label
                className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  mode === "multi"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="export-mode"
                  value="multi"
                  checked={mode === "multi"}
                  onChange={() => setMode("multi")}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Nhiều Sheet (theo môn học)
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Mỗi môn học là 1 sheet riêng. Tên sheet là tên môn học.
                    Dữ liệu chi tiết từng buổi dạy trong mỗi sheet.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Info box */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800 font-medium mb-1">Dữ liệu xuất bao gồm:</p>
            <ul className="text-sm text-amber-700 space-y-0.5 list-disc list-inside">
              <li>Mã & tên môn học, học kỳ</li>
              <li>Ngày dạy, giờ bắt đầu / kết thúc</li>
              <li>Loại buổi, phòng học, số nhóm TH</li>
              <li>Trạng thái ghi nhận chấm công</li>
              <li>Trạng thái chấm công giảng viên</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            disabled={!filename.trim() || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Xuất Excel
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalExportAttendanceWorkload;
