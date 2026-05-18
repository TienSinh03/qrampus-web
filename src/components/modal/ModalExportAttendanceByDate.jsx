import React, { useState, useEffect, useMemo } from "react";
import { X, Download, LayoutList, Layers, ChevronDown, ChevronUp } from "lucide-react";

const ModalExportAttendanceByDate = ({
  isOpen,
  onClose,
  onExport,
  loading = false,
  teacher = null,
  courses = [],   // array of { id, code, name, semester }
}) => {
  const [filename, setFilename]         = useState("");
  const [fromDate, setFromDate]         = useState("");
  const [toDate, setToDate]             = useState("");
  const [mode, setMode]                 = useState("single");
  const [selectedCodes, setSelectedCodes] = useState(new Set());
  const [courseExpanded, setCourseExpanded] = useState(true);

  // Reset khi mở modal
  useEffect(() => {
    if (!isOpen) return;
    const today = new Date().toISOString().split("T")[0];
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString().split("T")[0];
    const code = teacher?.teacher_code || teacher?.code || "";
    setFilename(`cong_day_${code ? code + "_" : ""}${today}`);
    setFromDate(firstOfMonth);
    setToDate(today);
    setMode("single");
    setSelectedCodes(new Set(courses.map((c) => c.code)));
    setCourseExpanded(true);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const allSelected = courses.length > 0 && selectedCodes.size === courses.length;
  const someSelected = selectedCodes.size > 0 && selectedCodes.size < courses.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedCodes(new Set());
    } else {
      setSelectedCodes(new Set(courses.map((c) => c.code)));
    }
  };

  const toggleCourse = (code) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const parseSemester = (s) => {
    if (!s) return "";
    const [year, sem] = s.split("-");
    return `HK${sem || "?"}/${year || "?"}`;
  };

  const canExport = filename.trim() && fromDate && toDate && selectedCodes.size > 0;

  const handleExport = () => {
    if (!canExport) return;
    onExport({
      filename: filename.trim(),
      mode,
      from_date: fromDate,
      to_date: toDate,
      selectedCourseCodes: allSelected ? null : [...selectedCodes],
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-lg bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-indigo-50">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Xuất công dạy theo thời gian
            </h3>
            <p className="text-sm text-gray-600 mt-0.5">
              {teacher ? `GV: ${teacher.full_name}` : "Theo khoảng ngày dạy"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-indigo-200 transition-all duration-300 p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 pb-32 space-y-5">

          {/* Filename */}
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-gray-500 font-medium whitespace-nowrap">.xlsx</span>
            </div>
          </div>

          {/* Date range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Khoảng ngày dạy <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Course checkboxes */}
          <div>
            <button
              type="button"
              onClick={() => setCourseExpanded((v) => !v)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 mb-2"
            >
              <span>
                Môn học xuất{" "}
                <span className="text-indigo-600 font-semibold">
                  ({selectedCodes.size}/{courses.length})
                </span>
                <span className="text-red-500 ml-0.5">*</span>
              </span>
              {courseExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {courseExpanded && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Select all header */}
                <label className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleAll}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả môn học"}
                  </span>
                </label>

                {/* Course list */}
                <div className="max-h-52 overflow-y-auto divide-y divide-gray-100">
                  {courses.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-gray-400">Không có môn học nào</p>
                  ) : (
                    courses.map((course) => (
                      <label
                        key={course.id || course.code}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                          selectedCodes.has(course.code)
                            ? "bg-indigo-50"
                            : "bg-white hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCodes.has(course.code)}
                          onChange={() => toggleCourse(course.code)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            <span className="text-indigo-700 mr-1">{course.code}</span>
                            {course.name}
                          </div>
                          {course.semester && (
                            <div className="text-xs text-gray-500">
                              {parseSemester(course.semester)}
                            </div>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Export mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kiểu xuất <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2.5">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                  mode === "single" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="by-date-mode"
                  value="single"
                  checked={mode === "single"}
                  onChange={() => setMode("single")}
                  className="mt-0.5 text-indigo-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-800 text-sm">
                    <LayoutList className="w-4 h-4 text-indigo-600" />
                    1 Sheet duy nhất
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Tất cả buổi dạy trong 1 sheet, sắp theo mã môn học → lý thuyết trước → ngày dạy
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                  mode === "multi" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="by-date-mode"
                  value="multi"
                  checked={mode === "multi"}
                  onChange={() => setMode("multi")}
                  className="mt-0.5 text-indigo-600"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-gray-800 text-sm">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    Nhiều Sheet (theo môn học)
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Mỗi môn học là 1 sheet, tên sheet là tên môn học
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-white">
          {!canExport && (
            <p className="flex-1 text-xs text-amber-600 self-center">
              {!fromDate || !toDate
                ? "Vui lòng chọn khoảng ngày"
                : selectedCodes.size === 0
                ? "Vui lòng chọn ít nhất 1 môn học"
                : !filename.trim()
                ? "Vui lòng nhập tên file"
                : ""}
            </p>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            disabled={!canExport || loading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
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

export default ModalExportAttendanceByDate;
