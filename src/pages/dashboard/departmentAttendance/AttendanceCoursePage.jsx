import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import AttendanceLecturerSessionsPage from "./AttendanceLecturerSessionsPage";
import Pagination from "../../../components/common/Pagination";
import ModalBulkUploadCourseSection from "../../../components/modal/ModalBulkUploadCourseSection";
import ModalAddCourse from "../../../components/modal/ModalAddCourse";
import ModalEditCourse from "../../../components/modal/ModalEditCourse";
import ModalViewCourse from "../../../components/modal/ModalViewCourse";
import ModalConfirmAction from "../../../components/modal/ModalConfirmAction";
import ModalExportAttendanceWorkload from "../../../components/modal/ModalExportAttendanceWorkload";
import ModalExportAttendanceByDate from "../../../components/modal/ModalExportAttendanceByDate";
import ModalExportExcel from "../../../components/modal/ModalExportExcel";
import {
  CirclePlus,
  CloudUpload,
  Eye,
  PencilLine,
  Users,
  UserCheck,
  UserX,
  BookOpen,
  ArrowDown,
  ArrowUp,
  FileSpreadsheet,
  FilterX,
  FileSearchIcon,
  File,
  ArrowLeft,
  ChevronRight,
  BaggageClaimIcon,
  BadgeDollarSign,
  ArrowBigDown,
} from "lucide-react";
import courseService from "../../../services/course.service";
import teacherService from "../../../services/teacher.service";
import attendanceService from "../../../services/attendance.service";
import { exportCourseToExcel, exportAttendanceWorkload } from "../../../utils/excelExport";

const AttendanceCoursePage = ({ teacher = null, onBack = null }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  // const [openMenu, setOpenMenu] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [excludedIds, setExcludedIds] = useState([]);

  // Data states
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    code: '',
    name: '',
    semester: '',
    year: ''
  });

  const [tempFilters, setTempFilters] = useState({
    code: '',
    name: '',
    semester: '',
    year: ''
  });

  // Modal states
  const [modalAddCourse, setModalAddCourse] = useState({ isOpen: false });
  const [modalEditCourse, setModalEditCourse] = useState({ isOpen: false, courseData: null });
  const [modalViewCourse, setModalViewCourse] = useState({ isOpen: false, courseId: null });
  const [modalExportExcel, setModalExportExcel] = useState({ isOpen: false, data: [] });
  const [modalExportWorkload, setModalExportWorkload] = useState({ isOpen: false });
  const [exportWorkloadLoading, setExportWorkloadLoading] = useState(false);
  const [workloadFilter, setWorkloadFilter] = useState(null); // null = tất cả, array = mã môn được chọn
  const [modalExportByDate, setModalExportByDate] = useState({ isOpen: false, courses: null });
  const [exportByDateLoading, setExportByDateLoading] = useState(false);
  const [modalConfirmAction, setModalConfirmAction] = useState({
    isOpen: false,
    actionType: null,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
    userData: null,
  });

  // Modal handlers
  const openAddCourseModal = () => setModalAddCourse({ isOpen: true });
  const closeAddCourseModal = () => setModalAddCourse({ isOpen: false });

  const openEditCourseModal = (course) => setModalEditCourse({ isOpen: true, courseData: course });
  const closeEditCourseModal = () => setModalEditCourse({ isOpen: false, courseData: null });

  const openViewCourseModal = (course) => setModalViewCourse({ isOpen: true, courseId: course.id });
  const closeViewCourseModal = () => setModalViewCourse({ isOpen: false, courseId: null });

  const openExportExcelModal = async () => {
    try {
      let dataToExport = [];
      
      if (selectAllPages) {
        // Fetch all courses with current filters
        const response = await courseService.getCourseSections({
          page: 1,
          limit: pagination.total,
          code: filters.code || undefined,
          name: filters.name || undefined,
          semester: filters.semester || undefined,
          year: filters.year || undefined
        });
        
        if (response.success) {
          // Filter out excluded IDs
          dataToExport = response.data.filter(c => !excludedIds.includes(c.id));
        }
      } else {
        // Use only selected courses from current page
        dataToExport = courses.filter(c => selectedIds.includes(c.id));
      }
      
      setModalExportExcel({ isOpen: true, data: dataToExport });
    } catch (error) {
      console.error("Error fetching courses for export:", error);
      toast.error("Không thể tải dữ liệu để xuất Excel");
    }
  };
  
  const closeExportExcelModal = () => setModalExportExcel({ isOpen: false, data: [] });

  const handleExportWorkload = async ({ filename, mode }) => {
    try {
      setExportWorkloadLoading(true);
      const res = await attendanceService.getLecturerAttendanceSessions({
        lecturer_id: teacher?.id,
        limit: 1000,
        page: 1,
      });
      let sessions = Array.isArray(res?.data) ? res.data : [];

      // Lọc theo môn học được chọn (nếu workloadFilter không null)
      if (workloadFilter !== null && workloadFilter.length > 0) {
        sessions = sessions.filter((s) =>
          workloadFilter.includes(s?.course_section?.code)
        );
      }

      if (sessions.length === 0) {
        toast.warning("Không có dữ liệu buổi dạy để xuất");
        return;
      }
      exportAttendanceWorkload(sessions, filename, mode);
      toast.success(`Đã xuất ${sessions.length} buổi dạy thành công`);
      setModalExportWorkload({ isOpen: false });
    } catch (err) {
      console.error("Export workload error:", err);
      toast.error(err?.message || "Không thể xuất dữ liệu");
    } finally {
      setExportWorkloadLoading(false);
    }
  };

  const handleExportByDate = async ({ filename, mode, from_date, to_date, selectedCourseCodes }) => {
    try {
      setExportByDateLoading(true);
      const res = await attendanceService.getLecturerAttendanceSessions({
        lecturer_id: teacher?.id,
        from_date,
        to_date,
        limit: 1000,
        page: 1,
      });
      let sessions = Array.isArray(res?.data) ? res.data : [];

      // Lọc theo môn học được chọn (nếu không chọn tất cả)
      if (selectedCourseCodes && selectedCourseCodes.length > 0) {
        sessions = sessions.filter((s) =>
          selectedCourseCodes.includes(s?.course_section?.code)
        );
      }

      if (sessions.length === 0) {
        toast.warning("Không có dữ liệu buổi dạy trong khoảng thời gian này");
        return;
      }
      exportAttendanceWorkload(sessions, filename, mode);
      toast.success(`Đã xuất ${sessions.length} buổi dạy thành công`);
      setModalExportByDate({ isOpen: false });
    } catch (err) {
      console.error("Export by date error:", err);
      toast.error(err?.message || "Không thể xuất dữ liệu");
    } finally {
      setExportByDateLoading(false);
    }
  };

  const handleExportExcel = ({ selectedColumns, filename }) => {
    try {
      exportCourseToExcel(modalExportExcel.data, filename, selectedColumns);
      toast.success(`Đã xuất ${modalExportExcel.data.length} học phần ra file Excel thành công`);
      closeExportExcelModal();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Không thể xuất file Excel. Vui lòng thử lại!");
    }
  };

  // const openConfirmActionModal = (actionType, title, message, confirmText, onConfirm, userData = null) => {
  //   setModalConfirmAction({
  //     isOpen: true,
  //     actionType,
  //     title,
  //     message,
  //     confirmText,
  //     onConfirm,
  //     userData,
  //   });
  // };
  const closeConfirmActionModal = () => setModalConfirmAction({ ...modalConfirmAction, isOpen: false });

  const selectedCourseCode = searchParams.get("courseCode") || "";

  const openCourseDrilldown = (course) => {
    const next = new URLSearchParams(searchParams);
    if (teacher?.id) {
      next.set("teacherId", teacher.id);
    }
    next.set("courseCode", course.code);
    setSearchParams(next);
    setSelectedCourse(course);
  };

  const closeCourseDrilldown = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("courseCode");
    setSearchParams(next, { replace: true });
    setSelectedCourse(null);
  };

  // Fetch course sections — khi có teacher thì lấy theo GV, không thì lấy tổng quát
  const fetchCourseSections = useCallback(async () => {
    try {
      setLoading(true);
      if (teacher) {
        const response = await teacherService.getTeacherCourseSections(teacher.id, {
          code:     filters.code     || undefined,
          name:     filters.name     || undefined,
          semester: filters.semester || undefined,
          year:     filters.year     || undefined,
          page:     currentPage,
          limit:    10,
        });
        const list = Array.isArray(response.data) ? response.data : [];
        setCourses(list);
        setPagination(response.pagination || {
          total:      list.length,
          page:       currentPage,
          limit:      10,
          totalPages: Math.ceil(list.length / 10) || 1,
        });
      } else {
        const response = await courseService.getCourseSections({
          page: currentPage,
          limit: 10,
          code: filters.code || undefined,
          name: filters.name || undefined,
          semester: filters.semester || undefined,
          year: filters.year || undefined,
        });
        if (response.success) {
          setCourses(Array.isArray(response.data) ? response.data : []);
          setPagination(response.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 });
        } else {
          setCourses([]);
          toast.error(response.message || "Không thể tải danh sách học phần");
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
      toast.error("Không thể tải danh sách học phần");
    } finally {
      setLoading(false);
    }
  }, [teacher, currentPage, filters]);

  // Handle bulk upload course sections
  const handleBulkUpload = async (courseSectionsList) => {
    try {
      console.log("Bulk upload course sections:", courseSectionsList);
      
      // Call API to bulk create course sections
      const response = await courseService.bulkCreateCourseSections(courseSectionsList);
      
      console.log("Bulk upload response:", response);
      
      // Check if response has data (could be success or validation errors)
      if (response.data) {
        const { successCount, failCount } = response.data;
        
        if (failCount > 0) {
          // Show warning with details
          toast.warning(
            `Đã thêm ${successCount} học phần thành công. ${failCount} bản ghi lỗi.`,
            {
              duration: 5000,
              description: 'Vui lòng xem chi tiết lỗi trong modal và tải xuống file lỗi.'
            }
          );
        } else if (successCount > 0) {
          // All success
          toast.success(`Đã thêm ${successCount} học phần thành công!`);
          // Close modal after 2 seconds if all success
          setTimeout(() => {
            setOpenUpload(false);
          }, 2000);
        }
        
        // Refresh list if any success
        if (successCount > 0) {
          fetchCourseSections();
        }
        
        // Return response with data to modal
        return response;
      } else if (response.success === false) {
        // API returned success: false without detailed data
        toast.error(response.message || "Không thể tải lên danh sách học phần");
        return response;
      }
      
      return response;
    } catch (error) {
      console.error("Error bulk creating course sections:", error);
      
      // Extract error message
      const errorMessage = error.message || "Không thể tải lên danh sách học phần. Vui lòng thử lại!";
      toast.error(errorMessage);
      
      // Return error object (already transformed by handleError with data property)
      return error;
    }
  };

  useEffect(() => {
    fetchCourseSections();
    if (!selectAllPages) setSelectedIds([]);
  }, [fetchCourseSections]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedCourseCode) {
      if (selectedCourse) setSelectedCourse(null);
      return;
    }
    if (selectedCourse) return;
    const matchedCourse = courses.find((course) => course.code === selectedCourseCode);
    if (matchedCourse) {
      setSelectedCourse(matchedCourse);
    }
  }, [selectedCourseCode, courses, selectedCourse]);

  // Khi selectAllPages = true và dữ liệu trang mới load xong, tự động chọn tất cả trên trang đó (trừ excluded)
  useEffect(() => {
    if (selectAllPages && courses.length > 0) {
      setSelectedIds(courses.filter(c => !excludedIds.includes(c.id)).map(c => c.id));
    }
  }, [courses]); // eslint-disable-line react-hooks/exhaustive-deps


  // Helper function to parse semester
  const parseSemester = (semesterString) => {
    if (!semesterString) return { year: '', semester: '' };
    const [year, semester] = semesterString.split('-');
    return { year, semester };
  };

  // Filter handlers
  const handleTempFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1); // Reset to first page when applying filters
  };

  const handleClearFilters = () => {
    const emptyFilters = { code: '', name: '', semester: '', year: '' };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setCurrentPage(1);
    setSelectedIds([]);
    setSelectAllPages(false);
    setExcludedIds([]);
  };

  // Generate year options for dropdown
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);



  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Bỏ các id trên trang này khỏi excluded khi chọn lại header
      const pageIds = courses.map(item => item.id);
      setSelectedIds(pageIds);
      if (selectAllPages) {
        setExcludedIds(excludedIds.filter(id => !pageIds.includes(id)));
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
        // Re-select: xóa khỏi excluded, thêm vào selected
        setExcludedIds(excludedIds.filter(eid => eid !== id));
        setSelectedIds([...selectedIds, id]);
      } else {
        // Deselect: thêm vào excluded, xóa khỏi selected
        setExcludedIds([...excludedIds, id]);
        setSelectedIds(selectedIds.filter(sid => sid !== id));
      }
    } else {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  // Số lượng thực sự đang được chọn
  const selectedCount = selectAllPages ? pagination.total - excludedIds.length : selectedIds.length;

  const isAllSelected = courses.length > 0 && selectedIds.length === courses.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < courses.length;

  const clearSelection = () => {
    setSelectedIds([]);
    setSelectAllPages(false);
    setExcludedIds([]);
  };

  // null = tất cả môn (khi selectAllPages không có excluded), array = danh sách môn đang chọn
  const selectedCoursesForExport =
    selectAllPages && excludedIds.length === 0
      ? null
      : courses.filter((c) => selectedIds.includes(c.id));

  // CỘT, BẢNG

  if (selectedCourse) {
    return (
      <AttendanceLecturerSessionsPage
        lecturerId={teacher?.id}
        courseCode={selectedCourse.code}
        teacher={teacher}
        onBack={closeCourseDrilldown}
        backLabel="Danh sách môn học"
      />
    );
  }

  return (

    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-[#153898] mb-4" />

          {/* Breadcrumb khi xem theo GV */}
          {teacher && onBack && (
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <button
                onClick={onBack}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Danh sách giảng viên
              </button>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-800 font-semibold">
                Danh sách môn học: {teacher.full_name}
                {teacher.teacher_code ? ` (${teacher.teacher_code})` : ""}
              </span>
            </div>
          )}

          <div className="">
            {/* FILTERS */}
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
                <button onClick={() => setExpanded(!expanded)} className="flex items-center text-blue-600 hover:text-blue-800 ml-auto">
                  {expanded ? (
                    <>
                      <ArrowUp size={16} className="mr-1" />
                      Thu gọn
                    </>
                  ) : (
                    <>
                      <ArrowDown size={16} className="mr-1" />
                    </>
                  )}
                </button>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã học phần
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={tempFilters.code}
                    onChange={handleTempFilterChange}
                    placeholder="Ví dụ: INT3104"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên học phần
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={tempFilters.name}
                    onChange={handleTempFilterChange}
                    placeholder="Ví dụ: Lập trình tích hợp"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Năm học
                  </label>
                  <select 
                    name="year"
                    value={tempFilters.year}
                    onChange={handleTempFilterChange}
                    className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Tất cả năm học --</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Học kỳ
                  </label>
                  <select 
                    name="semester"
                    value={tempFilters.semester}
                    onChange={handleTempFilterChange}
                    className="w-full rounded-lg border px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Tất cả học kỳ --</option>
                    <option value="1">Học kỳ 1</option>
                    <option value="2">Học kỳ 2</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between justify-start md:justify-end">
                <div className="flex flex-wrap items-center gap-3">
                  {!teacher && (
                    <button
                      onClick={openAddCourseModal}
                      className="flex items-center gap-2  border border-emerald-500 text-emerald-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                      title="Thêm môn học, khóa học mới"
                    >
                      <CirclePlus className="w-5 h-5" />
                    </button>
                  )}

                  {!teacher && (
                    <button
                      onClick={() => setOpenUpload(true)}
                      className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                      title="Upload danh sách môn học, vui lòng tải mẫu excel bên dưới"
                    >
                      <CloudUpload className="w-5 h-5" />
                    </button>
                  )}

                  {/* TẢI  dữ liệu chấm công */}
                  {
                    teacher && (
                      
                      <button
                        onClick={() => { setWorkloadFilter(null); setModalExportWorkload({ isOpen: true }); }}
                        className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                        title="Tải dữ liệu chấm công theo môn học"
                      >
                        <ArrowBigDown className="w-5 h-5" />
                        Tải dữ liệu chấm công theo môn học
                      </button>
                    )
                  }
                  {
                    teacher && (
                      <button
                        onClick={() => setModalExportByDate({ isOpen: true })}
                        className="flex items-center gap-2 border border-indigo-400 text-indigo-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-indigo-50 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 transition-all duration-200"
                        title="Xuất dữ liệu chấm công theo thời gian"
                      > 
                        <ArrowBigDown className="w-5 h-5" />
                        Tải dữ liệu chấm công theo thời gian
                      </button>
                    )
                  }

                  <button
                    onClick={handleApplyFilters}
                    className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200" 
                    title="Tìm kiếm"
                  >
                    <FileSearchIcon className="w-5 h-5" />
                  </button>



                  <button
                    onClick={openExportExcelModal}
                    disabled={selectedCount === 0}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ${
                      selectedCount > 0
                        ? 'border border-emerald-400 text-emerald-400 hover:bg-emerald-100 hover:shadow-md focus:ring-emerald-500'
                        : 'border border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                    title={selectedCount > 0 ? `Xuất ${selectedCount} mục đã chọn` : "Xuất danh sách excel"}
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    {selectedCount > 0 && (
                      <span className="ml-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {selectedCount}
                      </span>
                    )}
                  </button>
                  
                  
                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200" title="Tải file mẫu excel">
                    <File className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
                    title="Xóa bộ lọc, truy vấn bộ lọc khác"
                  >
                    <FilterX className="w-5 h-5" />
                  </button>

                </div>
              </div>
            </div>

            {/* Select all pages banner */}
            {isAllSelected && !selectAllPages && pagination.total > courses.length && (
              <div className="bg-blue-50 border-x border-b border-blue-200 px-4 py-2.5 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedIds.length}</strong> học phần trên trang này.{" "}
                <button
                  onClick={() => setSelectAllPages(true)}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                >
                  Chọn tất cả {pagination.total} học phần trong tất cả trang
                </button>
              </div>
            )}
            {selectAllPages && (
              <div className="bg-blue-100 border-x border-b border-blue-300 px-4 py-2.5 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedCount}</strong> học phần trong tất cả trang.{" "}
                <button
                  onClick={() => { setSelectAllPages(false); setSelectedIds([]); setExcludedIds([]); }}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            )}

            {/* TABLE */}
            <div className="w-full overflow-x-auto rounded-b-xl border border-slate-200 bg-white shadow mb-6">
              <table className="w-full table-auto border-collapse text-left text-sm whitespace-nowrap">

                {/* ================== HEADER ================== */}
                <thead className="sticky top-0 z-10 bg-slate-100">
                  <tr className="border-b">

                    {/* Checkbox */}
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      <input 
                        type="checkbox"
                        checked={isAllSelected}
                        ref={(input) => {
                          if (input) {
                            input.indeterminate = isSomeSelected;
                          }
                        }}
                        onChange={handleSelectAll}
                        className="cursor-pointer"
                      />
                    </th>

                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Mã học phần
                    </th>

                    <th className="h-12 px-4 min-w-[220px] text-xs font-semibold text-slate-600 uppercase">
                      Môn học
                    </th>

                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Kỳ
                    </th>

                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Năm học
                    </th>

                    <th className="h-12 px-4 min-w-[160px] text-xs font-semibold text-slate-600 uppercase hidden lg:table-cell">
                      Tín chỉ
                    </th>

                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">
                      Sỉ số
                    </th>

                    <th className="h-12 px-4 min-w-[140px] text-xs font-semibold text-slate-600 uppercase hidden md:table-cell">
                      Hình thức học
                    </th>

                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">
                      Trạng thái
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                {/* ================== BODY ================== */}
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                          Đang tải dữ liệu...
                        </div>
                      </td>
                    </tr>
                  ) : !Array.isArray(courses) || courses.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                        Không có dữ liệu học phần
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => {
                      const { year, semester } = parseSemester(course.semester);
                      return (
                        <tr
                          key={course.id}
                          className={`border-b hover:bg-slate-50 transition-colors h-12 ${
                            selectedIds.includes(course.id) ? 'bg-blue-50' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="px-4 py-2">
                            <input 
                              type="checkbox"
                              checked={selectedIds.includes(course.id)}
                              onChange={() => handleSelectOne(course.id)}
                              className="cursor-pointer"
                            />
                          </td>

                          <td className="px-4 py-2">
                            {course.code}
                          </td>

                          <td
                            className="px-4 py-2 max-w-[260px] truncate"
                            title={course.name}
                          >
                            {course.name}
                          </td>

                          <td className="px-4 py-2">
                            {semester}
                          </td>

                          <td className="px-4 py-2">
                            {year}
                          </td>

                          <td
                            className="px-4 py-2 hidden lg:table-cell truncate max-w-[180px]"
                            title={course.credits ? `${course.credits} tín chỉ` : ''}
                          >
                            {course.credits} tín chỉ
                          </td>

                          <td className="px-4 py-2 text-center">
                            {course.max_students}
                          </td>

                          <td className="px-4 py-2 hidden md:table-cell">
                            {course.practice_sessions > 0 ? `${course.practice_sessions} nhóm TH` : 'Lý thuyết'}
                          </td>

                          {/* Trạng thái */}
                          <td className="px-4 py-2 text-center">
                            <span
                              className="inline-flex items-center justify-center min-w-[80px] px-3 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600"
                            >
                              Hoạt động
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => openViewCourseModal(course)}
                                title="Xem chi tiết"
                              >
                                <Eye className="text-blue-500 cursor-pointer w-5 h-5" />
                              </button>
                              <button
                                onClick={() => openCourseDrilldown(course)}
                                title="Chi tiết công dạy"
                              >
                                <BadgeDollarSign className="text-blue-500 cursor-pointer w-5 h-5" />
                              </button>
                               
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ACTION BAR: xuất theo môn học đã chọn */}
            {teacher && selectedCount > 0 && (
              <div className="flex flex-wrap items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4">
                <span className="text-sm text-blue-800 flex-1">
                  Đã chọn <strong>{selectedCount}</strong> học phần{selectAllPages ? " trong tất cả trang" : ""}.{" "}
                  <button
                    onClick={clearSelection}
                    className="text-blue-600 underline hover:text-blue-800 font-medium"
                  >
                    Bỏ chọn tất cả
                  </button>
                </span>
                <button
                  onClick={() => {
                    const codes = selectedCoursesForExport ? selectedCoursesForExport.map((c) => c.code) : null;
                    setWorkloadFilter(codes);
                    setModalExportWorkload({ isOpen: true });
                  }}
                  className="flex items-center gap-2 border border-blue-400 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <ArrowBigDown className="w-4 h-4" />
                  Tải dữ liệu chấm công theo môn học
                </button>
                <button
                  onClick={() => {
                    const selectedCourseList = selectedCoursesForExport ?? courses;
                    setModalExportByDate({ isOpen: true, courses: selectedCourseList });
                  }}
                  className="flex items-center gap-2 border border-indigo-400 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
                >
                  <ArrowBigDown className="w-4 h-4" />
                  Tải dữ liệu chấm công theo thời gian
                </button>
              </div>
            )}

            {/* PAGINATION AND TOTAL COUNT */}
            <div className="flex items-center justify-between mt-4 px-4">
              <div className="text-sm text-gray-600">
                Tổng: <span className="font-semibold text-gray-800">{pagination.total}</span> học phần
              </div>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>

            {/* MODAL BULK UPLOAD */}
            <ModalBulkUploadCourseSection 
              open={openUpload} 
              onClose={() => setOpenUpload(false)}
              onUpload={handleBulkUpload}
            />

            {/* MODALS */}
            <ModalAddCourse 
              isOpen={modalAddCourse.isOpen}
              onClose={closeAddCourseModal}
              onSubmit={async (formData) => {
                try {
                  const response = await courseService.createCourseSection(formData);
                  
                  if (response.success) {
                    toast.success(response.message || "Đã thêm học phần thành công");
                    fetchCourseSections(); // Refresh course list
                  } else {
                    toast.error(response.message || "Có lỗi xảy ra khi thêm học phần");
                  }
                } catch (error) {
                  console.error("Error adding course:", error);
                  toast.error(error.message || "Không thể kết nối với server. Vui lòng thử lại!");
                }
              }}
            />

            <ModalEditCourse 
              isOpen={modalEditCourse.isOpen}
              onClose={closeEditCourseModal}
              courseData={modalEditCourse.courseData}
              onSubmit={(formData) => {
                console.log("Edit course", formData);
                toast.success("Đã cập nhật môn học thành công");
              }}
            />

            <ModalViewCourse 
              isOpen={modalViewCourse.isOpen}
              onClose={closeViewCourseModal}
              courseId={modalViewCourse.courseId}
            />

            <ModalConfirmAction 
              isOpen={modalConfirmAction.isOpen}
              onClose={closeConfirmActionModal}
              actionType={modalConfirmAction.actionType}
              title={modalConfirmAction.title}
              message={modalConfirmAction.message}
              confirmText={modalConfirmAction.confirmText}
              onConfirm={modalConfirmAction.onConfirm}
              userData={modalConfirmAction.userData}
            />

            <ModalExportExcel
              isOpen={modalExportExcel.isOpen}
              onClose={closeExportExcelModal}
              data={modalExportExcel.data}
              entityType="course"
              onExport={handleExportExcel}
            />

            <ModalExportAttendanceWorkload
              isOpen={modalExportWorkload.isOpen}
              onClose={() => setModalExportWorkload({ isOpen: false })}
              onExport={handleExportWorkload}
              loading={exportWorkloadLoading}
              teacher={teacher}
            />

            <ModalExportAttendanceByDate
              isOpen={modalExportByDate.isOpen}
              onClose={() => setModalExportByDate({ isOpen: false, courses: null })}
              onExport={handleExportByDate}
              loading={exportByDateLoading}
              teacher={teacher}
              courses={modalExportByDate.courses ?? courses}
            />
          </div>
        </div>
      </div>
    </div >

  );
};

export default AttendanceCoursePage;
