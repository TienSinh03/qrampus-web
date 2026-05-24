import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Star,
  TrendingUp,
  Eye,
  FileSpreadsheet,
  FilterX,
  X,
  FileSearchIcon,
  AlertCircle,
} from "lucide-react";
import { useSurveyDashboard } from "@contexts/SurveyDashboardContext";
import ModalViewTeacherSurvey from "@components/modal/ModalViewTeacherSurvey";

const toLower = (value) => String(value || "").toLowerCase().trim();

export default function LecturerSurveyManagement() {
  const {
    items,
    summary,
    loading,
    error,
    lastFetched,
    fetchSurveyStatistics,
    refreshSurveyStatistics,
  } = useSurveyDashboard();

  const hasRequestedRef = useRef(false);

  const [selectedSemester, setSelectedSemester] = useState("all");

  const [filters, setFilters] = useState({
    courseCode: "",
    courseName: "",
    classType: "all",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    courseCode: "",
    courseName: "",
    classType: "all",
  });

  // drawer xuất excel
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);

  const [surveySelected, setSurveySelected] = useState(null);
  const [openedModal, setOpenedModal] = useState(false);

  const handleOpenDetailModal = (item) => {
    setOpenedModal(true);
    setSurveySelected(item);
  };

  const handleCloseDetailModal = () => {
    setOpenedModal(false);
    setSurveySelected(null);
  };

  useEffect(() => {
    if (hasRequestedRef.current || loading || lastFetched) {
      return;
    }

    hasRequestedRef.current = true;
    fetchSurveyStatistics();
  }, [fetchSurveyStatistics, lastFetched, loading]);

  const semesterOptions = useMemo(() => {
    const semesters = [...new Set((items || []).map((item) => item?.semester).filter(Boolean))];
    return [
      { value: "all", label: "Tất cả học kỳ" },
      ...semesters.map((semester) => ({ value: semester, label: semester })).sort((a, b) => {
        const [yearA, termA] = a.value.split("-");
        const [yearB, termB] = b.value.split("-");
        if (yearA !== yearB) {
          return Number(yearB) - Number(yearA);
        }
        return termB.localeCompare(termA);
      }),
    ];
  }, [items]);

  const filtered = useMemo(() => {
    let result = (items || []).filter((item) => {
      if (selectedSemester !== "all" && item.semester !== selectedSemester) {
        return false;
      }

      if (appliedFilters.classType !== "all" && item.class_type !== appliedFilters.classType) {
        return false;
      }

      if (
        appliedFilters.courseCode &&
        !toLower(item.course_section_code).includes(toLower(appliedFilters.courseCode))
      ) {
        return false;
      }

      if (
        appliedFilters.courseName &&
        !toLower(item.course_section_name).includes(toLower(appliedFilters.courseName))
      ) {
        return false;
      }

      return true;
    });

    return result.sort((a, b) => {
      const semesterCompare = b.semester.localeCompare(a.semester);
      
      if (semesterCompare !== 0) {
        return semesterCompare;
      }

      return a.course_section_name.localeCompare(b.course_section_name);
    });
  }, [appliedFilters.classType, appliedFilters.courseCode, appliedFilters.courseName, items, selectedSemester]);

  const displaySummary = useMemo(() => {
    if (!filtered.length) {
      return {
        totalStudentsTargeted: 0,
        totalStudentsParticipated: 0,
        participationRate: 0,
        averageRating: "0.0",
        surveyedCourseSections: 0,
      };
    }

    const totalStudentsTargeted = filtered.reduce(
      (sum, item) => sum + Number(item.students_enrolled || 0), 0
    );

    const totalStudentsParticipated = filtered.reduce(
      (sum, item) => sum + Number(item.students_participated || 0), 0
    );

    // tỷ lệ phần trăm
    const participationRate =
      totalStudentsTargeted > 0 ? Number((totalStudentsParticipated / totalStudentsTargeted) * 100).toFixed(1) : 0;

    // điểm đánh giá trung bình
    const ratingItems = filtered.filter(
      (item) => typeof item.average_rating === "number" && !Number.isNaN(item.average_rating)
    );

    const averageRating =
      ratingItems.length > 0 
        ? ( ratingItems.reduce((sum, item) => sum + Number(item.average_rating || 0), 0) /ratingItems.length).toFixed(1) : "0.0";

    const surveyedCourseSections = new Set(filtered.map((item) => item.course_section_id)).size;

    return {
      totalStudentsTargeted,
      totalStudentsParticipated,
      participationRate,
      averageRating,
      surveyedCourseSections,
    };
  }, [filtered]);

  const effectiveSummary = filtered.length > 0 || appliedFilters.courseCode || appliedFilters.courseName || appliedFilters.classType !== "all" || selectedSemester !== "all"
    ? displaySummary
    : {
        totalStudentsTargeted: Number(summary?.total_students_targeted || 0),
        totalStudentsParticipated: Number(summary?.total_students_participated || 0),
        participationRate: Math.round(Number(summary?.participation_rate_percent || 0)),
        averageRating: Number(summary?.average_rating || 0).toFixed(2),
        surveyedCourseSections: Number(summary?.surveyed_course_sections || 0),
      };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const initial = { courseCode: "", courseName: "", classType: "all" };
    setSelectedSemester("all");
    setFilters(initial);
    setAppliedFilters(initial);
  };

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
                  {effectiveSummary.totalStudentsParticipated}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  SV khảo sát
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-emerald-600">
                  {effectiveSummary.participationRate}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Tỷ lệ
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-amber-600 flex items-center justify-center gap-1">
                  {effectiveSummary.averageRating}
                  <Star size={18} />
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Trung bình điểm đánh giá
                </p>
              </div>

              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-3xl font-bold text-purple-600">
                  {effectiveSummary.surveyedCourseSections}
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
                value={filters.courseCode}
                onChange={(e) => handleFilterChange("courseCode", e.target.value)}
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
                value={filters.courseName}
                onChange={(e) => handleFilterChange("courseName", e.target.value)}
                placeholder="Ví dụ: Lập trình thiết bị di động"
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hình thức học
              </label>
              <select
                value={filters.classType}
                onChange={(e) => handleFilterChange("classType", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">Tất cả hình thức</option>
                  <option value="LÝ THUYẾT">LÝ THUYẾT</option>
                  <option value="THỰC HÀNH">THỰC HÀNH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Học kỳ / năm học
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {semesterOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>


          </div>

          {/* Actions - đã bỏ phần hiển thị cột */}
          <div className="mt-6 flex flex-wrap items-center justify-start md:justify-end gap-4">
            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
              <button
                onClick={handleSearch}
                className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200"
              >
                <FileSearchIcon className="w-5 h-5" />
                Tìm kiếm
              </button>
              <button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-50  focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200" onClick={() => setIsDrawerOpen(true)}>
                <FileSpreadsheet className="w-5 h-5" />
                Tải Excel
              </button>
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-2 border border-gray-400 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200"
              >
                <FilterX className="w-5 h-5" />
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => refreshSurveyStatistics()}
              className="text-sm text-red-700 font-medium hover:underline"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* ===== TABLE - cột cố định, không còn visibleCols ===== */}
        <div className="bg-white shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Mã học phần</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tên học phần</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">SV khảo sát</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Đánh giá</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Tỷ lệ</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Nhóm</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Học kỳ</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Chi tiết</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-500">
                      Đang tải dữ liệu thống kê khảo sát...
                    </td>
                  </tr>
                )}

                {filtered.map(item => (
                  <tr key={item.survey_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">
                      {item.course_section_code}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {item.course_section_name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.students_participated}/{item.students_enrolled}
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      {Number(item.average_rating || 0).toFixed(1)} <Star size={14} className="inline-block text-amber-500" />
                    </td>
                    <td className="px-6 py-4 text-center font-bold">
                      {Number(item.participation_rate_percent || 0).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 text-center text-amber-600 font-bold">
                      {item.practice_group_number != null ? item.practice_group_number : "—"}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {item.semester}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="p-2 rounded-full hover:bg-gray-100"
                        onClick={() => handleOpenDetailModal(item)}
                        title="Xem chi tiết khảo sát"
                        aria-label="Xem chi tiết khảo sát"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-500">
                      Không có dữ liệu phù hợp với bộ lọc
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* xuất excel - giữ nguyên */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[999]"
            onClick={closeDrawer}
          />

          <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col">
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
                  {[
                    { key: "mahocphan", label: "Mã học phần" },
                    { key: "tenhocphan", label: "Tên học phần" },
                    { key: "svkhaosat", label: "SV khảo sát" },
                    { key: "tyle", label: "Tỷ lệ" },
                    { key: "tbkhaosat", label: "TB khảo sát" },
                    { key: "detail", label: "Chi tiết" },
                  ].map((col) => (
                    <div key={col.key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        defaultChecked={true}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{col.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticsemester bottom-0 flex justify-end gap-4 px-6 py-4 border-t bg-white/90 backdrop-blur">
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

      
      <ModalViewTeacherSurvey
        isOpen={openedModal}
        onClose={handleCloseDetailModal}
        surveyData={surveySelected}
      />
    </div>
  );
}