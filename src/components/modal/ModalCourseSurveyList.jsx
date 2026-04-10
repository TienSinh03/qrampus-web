import React, { useEffect, useMemo, useState } from "react";
import { X, Search, FilterX, WandSparkles, FileSpreadsheet, ListChecks } from "lucide-react";
import surveyService from "../../services/survey.service";
import LoadingSpinner from "@components/layout/LoadingSpinner";
import EmptyState from "@components/layout/EmptyState";
import Pagination from "../common/Pagination";
import { toast } from "sonner";

const ModalCourseSurveyList = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
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

  const defaultFilters = {
    courseCode: "",
    courseName: "",
    semester: "",
    surveyActive: "null",
  };

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

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    fetchCourseSections(1, filters);
  };

  const handleClearFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    fetchCourseSections(1, defaultFilters);
  };

  const handleBulkCreateSurvey = async () => {
    try {
      const response = await surveyService.autoCreateSurveysFromTemplates();
      toast.success(response?.message || "Tạo khảo sát hàng loạt thành công");
      fetchCourseSections(1, appliedFilters);
    } catch (error) {
      toast.error(error.message || "Không thể tạo khảo sát hàng loạt");
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

  const handleViewTemplateQuestions = () => {
    window.location.href = "/dashboard/admin/surveys/detail-survey";
  };

  const handlePageChange = (page) => {
    const nextPage = Math.max(1, Math.min(Number(page) || 1, pagination.totalPages || 1));
    if (nextPage === pagination.page) return;
    fetchCourseSections(nextPage);
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
                onClick={handleBulkCreateSurvey}
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
                onClick={handleViewTemplateQuestions}
                className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50"
              >
                <ListChecks size={16} />
                DS câu hỏi mẫu
              </button>


            </div>
          </div>

          <div className="max-h-[55vh] overflow-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr className="border-b text-gray-600 uppercase text-xs">
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
                    <td colSpan={8} className="py-8 text-center">
                      <LoadingSpinner text="Đang tải danh sách..." color="blue" />
                    </td>
                  </tr>
                )}

                {!loading && tableRows.length === 0 && (
                  <EmptyState
                    title="Không có dữ liệu học phần"
                    description="Không tìm thấy học phần phù hợp với bộ lọc hiện tại."
                    colSpan={8}
                    onAction={() => fetchCourseSections(1, appliedFilters)}
                    actionLabel="Tải lại"
                  />
                )}

                {!loading &&
                  tableRows.map((item) => (
                    <tr key={`${item.course_section_id}-${item.practice_group_id || "LT"}`} className="border-b hover:bg-slate-50">
                      <td className="px-3 py-3">{item.course_code}</td>
                      <td className="px-3 py-3 max-w-[320px] truncate" title={item.course_name}>{item.course_name}</td>
                      <td className="px-3 py-3">{item.semester}</td>
                      <td className="px-3 py-3">{item.class_type}</td>
                      <td className="px-3 py-3">{item.practice_group_number ?? "-"}</td>
                      <td className="px-3 py-3">{item.personnel_name || "-"}</td>
                      <td className="px-3 py-3 text-right">{Number(item.total_students || 0)}</td>
                      <td className="px-3 py-3 text-center">{statusBadge(item)}</td>
                    </tr>
                  ))}
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
    </>
  );
};

export default ModalCourseSurveyList;
