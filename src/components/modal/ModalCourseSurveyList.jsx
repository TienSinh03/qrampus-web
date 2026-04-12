import React, { useEffect, useMemo, useState } from "react";
import { X, Search, FilterX, WandSparkles, FileSpreadsheet, ListChecks } from "lucide-react";
import surveyService from "../../services/survey.service";
import LoadingSpinner from "@components/layout/LoadingSpinner";
import EmptyState from "@components/layout/EmptyState";
import Pagination from "../common/Pagination";
import { toast } from "sonner";

const ModalCourseSurveyList = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [excludedIds, setExcludedIds] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [filters, setFilters] = useState({
    courseCode: "",
    courseName: "",
    semester: "",
    surveyActive: "null",
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [bulkForm, setBulkForm] = useState({
    title: "",
    closesAt: "",
    file: null,
    fileName: "",
    fileType: "",
    fileBuffer: null,
  });

  const defaultFilters = {
    courseCode: "",
    courseName: "",
    semester: "",
    surveyActive: "null",
  };

  const getRowKey = (item) => `${item.course_section_id}-${item.practice_group_id || "LT"}`;

  const fetchCourseSections = async (page = pagination.page, nextFilters = appliedFilters) => {
    try {
      setLoading(true);
      const response = await surveyService.getCourseSectionsWithSurveys({
        page,
        limit: pagination.limit,
        ...nextFilters,
      });

      setRows(Array.isArray(response?.data) ? response.data : []);

      const nextPagination = response?.pagination || {};
      const total = Number(nextPagination.total) || 0;
      const limit = Number(nextPagination.limit) || pagination.limit;
      const totalPages = Number(nextPagination.totalPages) || (total > 0 ? Math.ceil(total / limit) : 1);

      setPagination({
        page: Number(nextPagination.page) || page,
        limit,
        total,
        totalPages,
      });

      if (!selectAllPages) {
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error fetching course sections with surveys:", error);
      toast.error(error.message || "Không thể tải danh sách học phần");
      setRows([]);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchCourseSections(1, appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (selectAllPages && rows.length > 0) {
      const pageSelectedIds = rows
        .filter((item) => !excludedIds.includes(getRowKey(item)))
        .map((item) => getRowKey(item));
      setSelectedIds(pageSelectedIds);
    }
  }, [rows, selectAllPages, excludedIds]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setSelectedIds([]);
    setSelectAllPages(false);
    setExcludedIds([]);
    fetchCourseSections(1, filters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSelectedIds([]);
    setSelectAllPages(false);
    setExcludedIds([]);
    fetchCourseSections(1, defaultFilters);
  };

  const handleOpenBulkModal = () => {
    if (selectedCount === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 dòng để tạo khảo sát hàng loạt");
      return;
    }
    setIsBulkModalOpen(true);
  };

  const handleCloseBulkModal = () => {
    if (bulkSubmitting) return;
    setIsBulkModalOpen(false);
    setBulkForm({
      title: "",
      closesAt: "",
      file: null,
      fileName: "",
      fileType: "",
      fileBuffer: null,
    });
  };

  const handleChangeBulkFile = async (event) => {
    const file = event.target.files?.[0] || null;
    if (!file) {
      setBulkForm((prev) => ({
        ...prev,
        file: null,
        fileName: "",
        fileType: "",
        fileBuffer: null,
      }));
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      setBulkForm((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        fileType: file.type,
        fileBuffer: buffer,
      }));
    } catch (_error) {
      toast.error("Không thể đọc file đã chọn, vui lòng chọn lại");
      setBulkForm((prev) => ({
        ...prev,
        file: null,
        fileName: "",
        fileType: "",
        fileBuffer: null,
      }));
    }
  };

  const handleSubmitBulkUi = async () => {
    if (!bulkForm.title.trim()) {
      toast.warning("Vui lòng nhập tiêu đề khảo sát");
      return;
    }

    if (!bulkForm.closesAt) {
      toast.warning("Vui lòng chọn ngày kết thúc");
      return;
    }

    if (!bulkForm.file) {
      toast.warning("Vui lòng tải file câu hỏi khảo sát");
      return;
    }

    if (!bulkForm.fileBuffer) {
      toast.warning("File chưa sẵn sàng để upload, vui lòng chọn lại file");
      return;
    }

    let sourceRows = [];

    if (selectAllPages) {
      try {
        const response = await surveyService.getCourseSectionsWithSurveys({
          page: 1,
          limit: pagination.total,
          ...appliedFilters,
        });
        const allRows = Array.isArray(response?.data) ? response.data : [];
        sourceRows = allRows.filter((item) => !excludedIds.includes(getRowKey(item)));
      } catch (error) {
        toast.error(error.message || "Không thể tải danh sách đã chọn để tạo khảo sát");
        return;
      }
    } else {
      sourceRows = rows.filter((item) => selectedIds.includes(getRowKey(item)));
    }

    const targets = sourceRows
      .filter((item) => !item.survey_id)
      .map((item) => ({
        course_section_id: item.course_section_id,
        practice_group_id: item.practice_group_id || null,
      }));

    if (targets.length === 0) {
      toast.warning("Các dòng đã chọn đều đã có khảo sát");
      return;
    }

    try {
      setBulkSubmitting(true);

      const uploadFile = new File(
        [bulkForm.fileBuffer],
        bulkForm.fileName || bulkForm.file.name || 'questions.xlsx',
        { type: bulkForm.fileType || bulkForm.file.type || 'application/octet-stream' }
      );

      const response = await surveyService.bulkCreateSurveysWithQuestionsExcel({
        title: bulkForm.title.trim(),
        closes_at: bulkForm.closesAt,
        targets,
        file: uploadFile,
      });

      const created = Number(response?.data?.created || 0);
      toast.success(response?.message || `Tạo thành công ${created} khảo sát`);

      await fetchCourseSections(1, appliedFilters);
      setSelectedIds([]);
      setSelectAllPages(false);
      setExcludedIds([]);
      handleCloseBulkModal();
    } catch (error) {
      toast.error(error.message || "Không thể tạo khảo sát hàng loạt");
    } finally {
      setBulkSubmitting(false);
    }
  };

  const handleExportCurrentRows = () => {
    if (!tableRows.length) {
      toast.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      "course_section_id",
      "course_code",
      "course_name",
      "semester",
      "class_type",
      "practice_group_id",
      "practice_group_number",
      "personnel_id",
      "personnel_name",
      "survey_id",
      "survey_title",
      "survey_active",
      "total_students",
    ];

    const escapeCsv = (value) => {
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const lines = [
      headers.join(","),
      ...tableRows.map((item) => headers.map((key) => escapeCsv(item[key])).join(",")),
    ];

    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `course-survey-list-page-${pagination.page}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Xuất file thành công");
  };

  const handleDownloadTemplateQuestions = () => {
    const headers = [
      "Nội dung câu hỏi question_text",
      "Loại câu hỏi question_type (rating, text, multiple_choice)",
      "Lựa chọn (nếu multiple_choice); ngăn cách bởi dấu phẩy hoặc chấm phẩy",
      "Thứ tự câu hỏi is_required",
    ];

    const sampleRows = [
      ["Nội dung học phần bám sát mục tiêu đào tạo", "rating", "", "FALSE"],
      ["Tài liệu học tập và bài giảng đầy đủ, dễ tiếp cận", "multiple_choice", "Rất đầy đủ; Đầy đủ; Bình thường; Thiếu", "FALSE"],
      ["Bạn có đề xuất gì để cải thiện chất lượng học phần?", "text", "", "FALSE"],
    ];

    const escapeCsv = (value) => {
      const stringValue = String(value ?? "");
      if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const lines = [
      headers.map(escapeCsv).join(","),
      ...sampleRows.map((row) => row.map(escapeCsv).join(",")),
    ];

    const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "survey_questions_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Đã tải file câu hỏi mẫu");
  };

  const handlePageChange = (page) => {
    const nextPage = Math.max(1, Math.min(Number(page) || 1, pagination.totalPages || 1));
    if (nextPage === pagination.page) return;
    fetchCourseSections(nextPage);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = rows.map((item) => getRowKey(item));
      setSelectedIds(pageIds);
      if (selectAllPages) {
        setExcludedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
      }
    } else {
      setSelectedIds([]);
      setSelectAllPages(false);
      setExcludedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectAllPages) {
      if (excludedIds.includes(id)) {
        setExcludedIds((prev) => prev.filter((eid) => eid !== id));
        setSelectedIds((prev) => [...prev, id]);
      } else {
        setExcludedIds((prev) => [...prev, id]);
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
      }
    } else if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const statusBadge = (item) => {
    if (!item.survey_id) {
      return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">Chưa tạo</span>;
    }
    if (item.survey_active) {
      return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">Đã tạo - Đang mở</span>;
    }
    return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Đã tạo - Đã khóa</span>;
  };

  const tableRows = useMemo(() => rows, [rows]);
  const pendingRows = useMemo(() => rows.filter((item) => !item.survey_id), [rows]);
  const selectedCount = selectAllPages ? pagination.total - excludedIds.length : selectedIds.length;
  const isAllSelected = tableRows.length > 0 && selectedIds.length === tableRows.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < tableRows.length;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />

      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div className="w-full max-w-7xl bg-white shadow-2xl rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b bg-emerald-50">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Danh sách khóa học và trạng thái khảo sát</h3>
              <p className="text-sm text-gray-500">Hiển thị học phần đã có hoặc chưa có khảo sát</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-emerald-100 p-2 transition"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={filters.courseCode}
                onChange={(e) => setFilters((prev) => ({ ...prev, courseCode: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Mã học phần"
              />
              <input
                type="text"
                value={filters.courseName}
                onChange={(e) => setFilters((prev) => ({ ...prev, courseName: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Tên học phần"
              />
              <input
                type="text"
                value={filters.semester}
                onChange={(e) => setFilters((prev) => ({ ...prev, semester: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Học kỳ (VD: 2026-2)"
              />
              <select
                value={filters.surveyActive}
                onChange={(e) => setFilters((prev) => ({ ...prev, surveyActive: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="null">Tất cả trạng thái</option>
                <option value="true">Đã tạo - Đang mở</option>
                <option value="false">Đã tạo - Đã khóa</option>
              </select>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={handleApplyFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Search size={16} />
                Tìm kiếm
              </button>

              <button
                onClick={handleClearFilters}
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
              >
                <FilterX size={16} />
                Xóa lọc
              </button>

              <button
                onClick={handleOpenBulkModal}
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-50"
              >
                <WandSparkles size={16} />
                Tạo khảo sát hàng loạt
              </button>

              <button
                onClick={handleExportCurrentRows}
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-teal-500 text-teal-600 hover:bg-teal-50"
              >
                <FileSpreadsheet size={16} />
                Xuất file
              </button>

              <button
                onClick={handleDownloadTemplateQuestions}
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50"
              >
                <ListChecks size={16} />
                Tải file câu hỏi mẫu
              </button>


            </div>
          </div>

          <div className="max-h-[55vh] overflow-auto">
            {isAllSelected && !selectAllPages && pagination.total > tableRows.length && (
              <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedIds.length}</strong> dòng trên trang này.{" "}
                <button
                  onClick={() => setSelectAllPages(true)}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                >
                  Chọn tất cả {pagination.total} dòng trong tất cả trang
                </button>
              </div>
            )}
            {selectAllPages && (
              <div className="bg-blue-100 border-b border-blue-300 px-4 py-2.5 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedCount}</strong> dòng trong tất cả trang.{" "}
                <button
                  onClick={() => {
                    setSelectAllPages(false);
                    setSelectedIds([]);
                    setExcludedIds([]);
                  }}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            )}
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr className="border-b text-gray-600 uppercase text-xs">
                  <th className="px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = isSomeSelected;
                        }
                      }}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-3 py-3 text-left">Mã học phần</th>
                  <th className="px-3 py-3 text-left">Tên học phần</th>
                  <th className="px-3 py-3 text-left">Học kỳ</th>
                  <th className="px-3 py-3 text-left">Loại lớp</th>
                  <th className="px-3 py-3 text-left">Nhóm TH</th>
                  <th className="px-3 py-3 text-left">Giảng viên</th>
                  <th className="px-3 py-3 text-right">Số SV</th>
                  <th className="px-3 py-3 text-center">Khảo sát</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center">
                      <LoadingSpinner text="Đang tải danh sách..." color="blue" />
                    </td>
                  </tr>
                )}

                {!loading && tableRows.length === 0 && (
                  <EmptyState
                    title="Không có dữ liệu học phần"
                    description="Không tìm thấy học phần phù hợp với bộ lọc hiện tại."
                    colSpan={9}
                    onAction={() => fetchCourseSections(1, appliedFilters)}
                    actionLabel="Tải lại"
                  />
                )}

                {!loading &&
                  tableRows.map((item) => {
                    const rowKey = getRowKey(item);
                    return (
                    <tr
                      key={rowKey}
                      className={`border-b hover:bg-slate-50 ${selectedIds.includes(rowKey) ? "bg-blue-50" : ""}`}
                    >
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          className="cursor-pointer"
                          checked={selectedIds.includes(rowKey)}
                          onChange={() => handleSelectOne(rowKey)}
                        />
                      </td>
                      <td className="px-3 py-3">{item.course_code}</td>
                      <td className="px-3 py-3 max-w-[320px] truncate" title={item.course_name}>{item.course_name}</td>
                      <td className="px-3 py-3">{item.semester}</td>
                      <td className="px-3 py-3">{item.class_type}</td>
                      <td className="px-3 py-3">{item.practice_group_number ?? "-"}</td>
                      <td className="px-3 py-3">{item.personnel_name || "-"}</td>
                      <td className="px-3 py-3 text-right">{Number(item.total_students || 0)}</td>
                      <td className="px-3 py-3 text-center">{statusBadge(item)}</td>
                    </tr>
                  )})}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t bg-white flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Tổng: <span className="font-semibold">{pagination.total}</span> học phần
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {isBulkModalOpen && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseBulkModal} />

          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b bg-emerald-50">
              <div>
                <h4 className="text-base font-semibold text-gray-800">Tạo khảo sát hàng loạt</h4>
                <p className="text-sm text-gray-500">Nhập thông tin chung và tải file câu hỏi khảo sát</p>
              </div>
              <button
                onClick={handleCloseBulkModal}
                disabled={bulkSubmitting}
                className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-emerald-100 p-2 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2">
                Đã chọn: <span className="font-semibold">{selectedCount}</span> dòng.
                Lớp chưa có khảo sát trong trang hiện tại: <span className="font-semibold">{pendingRows.length}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề khảo sát</label>
                <input
                  type="text"
                  value={bulkForm.title}
                  onChange={(e) => setBulkForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Ví dụ: Khảo sát cuối kỳ học kỳ 2026-2"
                  disabled={bulkSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc khảo sát</label>
                <input
                  type="datetime-local"
                  value={bulkForm.closesAt}
                  onChange={(e) => setBulkForm((prev) => ({ ...prev, closesAt: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={bulkSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">File câu hỏi khảo sát</label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleChangeBulkFile}
                  className="w-full border rounded-lg px-3 py-2"
                  disabled={bulkSubmitting}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Cấu trúc gợi ý: question_text, question_type, options, is_required
                </p>
                {bulkForm.fileName && (
                  <p className="mt-1 text-xs text-emerald-700">Đã chọn file: {bulkForm.fileName}</p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-white flex justify-end gap-2">
              <button
                onClick={handleCloseBulkModal}
                disabled={bulkSubmitting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitBulkUi}
                disabled={bulkSubmitting}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {bulkSubmitting ? "Đang tạo..." : "Xác nhận tạo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCourseSurveyList;
