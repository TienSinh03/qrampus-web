import React, { useEffect, useRef, useState } from "react";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import ModalAddSurvey from "../../../components/modal/ModalAddSurvey";
import ModalEditSurvey from "../../../components/modal/ModalEditSurvey";
import ModalViewSurvey from "../../../components/modal/ModalViewSurvey";
import ModalConfirmAction from "../../../components/modal/ModalConfirmAction";
import ModalCourseSurveyList from "../../../components/modal/ModalCourseSurveyList";
import reportService from "../../../services/report.service";
import surveyService from "../../../services/survey.service";
import LoadingSpinner from "@components/layout/LoadingSpinner";
import EmptyState from "@components/layout/EmptyState";
import { toast } from "sonner";

import {
  CirclePlus,
  Trash2,
  LockKeyhole,
  CloudUpload,
  Eye,
  MoreVertical,
  PencilLine,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  X, ArrowDown, ArrowUp, FileSpreadsheet, FilterX,
  CheckLine,
  Lock,
  File, Camera, FileSearchIcon,
  GitPullRequest,
  ArrowUpWideNarrow, Settings
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
const AdminSurveyPage = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [survey, setSurvey] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [excludedIds, setExcludedIds] = useState([]);
  const [cardLoading, setCardLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const hasFetchedCardRef = useRef(false);
  const [cardStats, setCardStats] = useState({
    surveys: {
      total: 0,
      this_month: 0,
      growth: 0,
      active: 0,
      active_rate: 0,
      answered: 0,
      response_rate: 0,
    },
  });

  // Modal states
  const [modalAddSurvey, setModalAddSurvey] = useState({ isOpen: false });
  const [modalEditSurvey, setModalEditSurvey] = useState({ isOpen: false, surveyData: null });
  const [modalViewSurvey, setModalViewSurvey] = useState({ isOpen: false, surveyData: null });
  const [modalCourseSurveyList, setModalCourseSurveyList] = useState({ isOpen: false });
  const [modalConfirmAction, setModalConfirmAction] = useState({
    isOpen: false,
    actionType: "",
    surveyData: null,
  });

  // Modal handlers
  const openAddSurveyModal = () => {
    setModalAddSurvey({ isOpen: true });
  };

  const openEditSurveyModal = (survey) => {
    setModalEditSurvey({ isOpen: true, surveyData: survey });
  };

  const openViewSurveyModal = (survey) => {
    setModalViewSurvey({ isOpen: true, surveyData: survey });
  };

  const openConfirmActionModal = (actionType, survey) => {
    setModalConfirmAction({ isOpen: true, actionType, surveyData: survey });
  };

  const openCourseSurveyListModal = () => {
    setModalCourseSurveyList({ isOpen: true });
  };

  const closeAddSurveyModal = () => {
    setModalAddSurvey({ isOpen: false });
  };

  const closeEditSurveyModal = () => {
    setModalEditSurvey({ isOpen: false, surveyData: null });
  };

  const closeViewSurveyModal = () => {
    setModalViewSurvey({ isOpen: false, surveyData: null });
  };

  const closeCourseSurveyListModal = () => {
    setModalCourseSurveyList({ isOpen: false });
  };

  const closeConfirmActionModal = () => {
    setModalConfirmAction({ isOpen: false, actionType: "", surveyData: null });
  };

  const fetchCardSurvey = async () => {
    try {
      setCardLoading(true);
      const response = await reportService.getCardSurvey();
      if (response?.data?.surveys) {
        setCardStats({
          surveys: {
            total: Number(response.data.surveys.total) || 0,
            this_month: Number(response.data.surveys.this_month) || 0,
            growth: Number(response.data.surveys.growth) || 0,
            active: Number(response.data.surveys.active) || 0,
            active_rate: Number(response.data.surveys.active_rate) || 0,
            answered: Number(response.data.surveys.answered) || 0,
            response_rate: Number(response.data.surveys.response_rate) || 0,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching card survey stats:", error);
      toast.error(error.message || "Không thể tải thống kê khảo sát");
    } finally {
      setCardLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedCardRef.current) return;
    hasFetchedCardRef.current = true;
    fetchCardSurvey();
  }, []);

  const fetchSurveyList = async () => {
    try {
      setTableLoading(true);
      const response = await surveyService.getAllSurvey({
        page: currentPage,
        limit: pagination.limit,
      });

      setSurvey(Array.isArray(response?.data) ? response.data : []);

      const responsePagination = response?.pagination || {};
      const total = Number(
        responsePagination.total ?? responsePagination.totalItems ?? responsePagination.count
      ) || 0;
      const page = Number(responsePagination.page) || currentPage;
      const limit = Number(responsePagination.limit) || pagination.limit;
      const totalPagesFromApi = Number(
        responsePagination.totalPages ?? responsePagination.total_pages ?? responsePagination.pageCount
      ) || 0;
      const totalPages = totalPagesFromApi > 0 ? totalPagesFromApi : (total > 0 ? Math.ceil(total / limit) : 1);

      setPagination({ total, page, limit, totalPages });

      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }

      if (!selectAllPages) {
        setSelectedIds([]);
      }
    } catch (error) {
      console.error("Error fetching survey list:", error);
      toast.error(error.message || "Không thể tải danh sách khảo sát");
      setSurvey([]);
      setPagination((prev) => ({
        ...prev,
        total: 0,
        page: 1,
        totalPages: 0,
      }));
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyList();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectAllPages && survey.length > 0) {
      setSelectedIds(survey.filter((item) => !excludedIds.includes(item.id)).map((item) => item.id));
    }
  }, [survey, selectAllPages, excludedIds]);

  const handlePageChange = (page) => {
    if (tableLoading) return;
    const maxPage = Math.max(1, Number(pagination.totalPages) || 1);
    const nextPage = Math.max(1, Math.min(Number(page) || 1, maxPage));
    if (nextPage === currentPage) return;
    setCurrentPage(nextPage);
  };

  const resolvedTotalPages = Number(pagination.totalPages) > 0
    ? Number(pagination.totalPages)
    : (Number(pagination.total) > 0
      ? Math.ceil(Number(pagination.total) / (Number(pagination.limit) || 10))
      : 1);

  // Handle actions
  const handleAddSurvey = (surveyData) => {
    console.log("Creating survey:", surveyData);
    toast.success("Tạo khảo sát thành công!");
    closeAddSurveyModal();
  };

  const handleEditSurvey = (surveyData) => {
    console.log("Updating survey:", surveyData);
    toast.success("Cập nhật khảo sát thành công!");
    closeEditSurveyModal();
  };

  const handleConfirmAction = () => {
    const { actionType, surveyData } = modalConfirmAction;
    console.log(`${actionType} survey:`, surveyData);
    
    if (actionType === "delete") {
      toast.success("Xóa khảo sát thành công!");
    } else if (actionType === "lock") {
      toast.success("Khóa khảo sát thành công!");
    }
    
    closeConfirmActionModal();
  };

  //gọi userfetch open
  // useEffect(() => {
  //   const handleClick = (e) => {
  //     if (!e.target.closest(".dropdown-menu")) {
  //       setOpenMenu(null);
  //     }
  //   };

  //   document.addEventListener("click", handleClick);
  //   return () => document.removeEventListener("click", handleClick);
  // }, []);

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = survey.map((item) => item.id);
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
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedCount = selectAllPages ? pagination.total - excludedIds.length : selectedIds.length;
  const isAllSelected = survey.length > 0 && selectedIds.length === survey.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < survey.length;

  const [expanded, setExpanded] = useState(false);
  const formatNumber = (value) => new Intl.NumberFormat("vi-VN").format(value || 0);
  const formatPercent = (value) => `${value >= 0 ? '+' : ''}${Number(value || 0).toFixed(1)}%`;
  // cột , bảng
  const [visibleCols, setVisibleCols] = useState({
    courseCode: true,
    courseName: true,
    semester: true,
    academicYear: true,
    status: true,
    learningForm: false,
    practicalGroup: false,
    createdAt: false,
    endAt: false,
    instructorCode: false,
    instructor: true,
    department: false,
    averageRating: false,
  });
  return (

    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Tổng"
                value={cardLoading ? "..." : formatNumber(cardStats.surveys.total)}
                percent={cardLoading ? "..." : `(${formatPercent(cardStats.surveys.growth)})`}
                positive={cardStats.surveys.growth >= 0}
                subtitle="Khảo sát đã tạo"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Học phần đã tạo"
                value={cardLoading ? "..." : formatNumber(cardStats.surveys.this_month)}
                percent={cardLoading ? "..." : `(${formatPercent(cardStats.surveys.growth)})`}
                positive={cardStats.surveys.growth >= 0}
                subtitle="kỳ này"
                icon={<UserPlus className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title="Đang mở"
                value={cardLoading ? "..." : formatNumber(cardStats.surveys.active)}
                percent={cardLoading ? "..." : `(${formatPercent(cardStats.surveys.active_rate)})`}
                positive={cardStats.surveys.active_rate >= 50}
                subtitle="số học phần"
                icon={<UserCheck className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Đã phản hồi"
                value={cardLoading ? "..." : formatNumber(cardStats.surveys.answered)}
                percent={cardLoading ? "..." : `(${formatPercent(cardStats.surveys.response_rate)})`}
                positive={cardStats.surveys.response_rate >= 50}
                subtitle="tỷ lệ phản hồi"
                icon={<UserX className="w-6 h-6 text-yellow-600" />}
                iconBg="bg-yellow-100"
              />
            </div>
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
                      Mở rộng
                    </>
                  )}
                </button>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Học kỳ
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>HK1_2024-2025</option>
                    <option>HK2_2023-2024</option>
                    <option>HK3_2022-2023</option>


                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã số học phần
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Đến hạn khảo sát</option>
                    <option>Đang mở</option>
                    <option>Đã khóa</option>
                    <option>Đang lên lịch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khoa/Viện
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Khoa Công nghệ thông tin</option>
                    <option>Khoa Điện tử - Viễn thông</option>
                    <option>Khoa Cơ khí</option>
                    <option>Khoa Kinh tế</option>
                  </select>
                </div>


                {expanded && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên môn học
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ....."
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã giảng viên
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên giảng viên
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày tạo
                      </label>
                      <input
                        type="date"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                  </>
                )}


              </div>
              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center gap-4 w-full justify-start md:justify-end md:w-auto">
                <div className="flex flex-wrap items-center gap-2 ">
                  <button 
                    onClick={openAddSurveyModal}
                    className="flex items-center gap-2 border border-emerald-500 text-emerald-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200" 
                    title="Tạo khảo sát, thủ công"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-rose-400 text-rose-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-rose-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:ring-offset-1 transition-all duration-200" title="Khóa khảo sát">
                    <Lock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={openCourseSurveyListModal}
                    className="flex items-center gap-2 border border-emerald-400 text-emerald-300 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                    title="Danh sách học phần và trạng thái khảo sát"
                  >
                    <ArrowUpWideNarrow className="w-5 h-5" />
                  </button>

                  {/* soạn bộ câu hỏi */}

                  <button
                    onClick={() => setOpenUpload(true)}
                    className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                    title="Upload danh sách học phần cần khảo sát"
                  >
                    <CloudUpload className="w-5 h-5" />
                  </button>
                  <button
                    className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200" title="Tìm kiếm"
                  >
                    <FileSearchIcon className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-teal-500 text-teal-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-teal-500 focus:ring-offset-1 transition-all duration-200" title="Tải file excel">
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200" title="Tải file mẫu excel">
                    <File className="w-5 h-5" />
                  </button>
                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200" title="Xóa bộ lọc">
                    <FilterX className="w-5 h-5" />
                  </button>
                  <details className="relative">
                    <summary className="list-none flex items-center gap-2 border border-sky-300 text-sky-700 bg-sky px-5 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-sky-50 hover:border-sky-400 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200">
                      <Settings className="w-5 h-5" />
                    </summary>

                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 text-sm">
                      {[
                        ["courseCode", "Mã học phần"],
                        ["courseName", "Tên học phần"],
                        ["semester", "Học kỳ"],
                        ["academicYear", "Năm học"],
                        ["learningForm", "Hình thức học"],
                        ["practicalGroup", "Nhóm TH"],
                        ["createdAt", "Ngày tạo"],
                        ["endAt", "Ngày kết thúc"],
                        ["instructorCode", "Mã GV"],
                        ["instructor", "Giảng viên"],
                        ["department", "Khoa"],
                        ["averageRating", "Điểm đánh giá"],
                        ["status", "Trạng thái"],

                      ].map(([key, label]) => {
                        const active = visibleCols[key];

                        return (
                          <div
                            key={key}
                            onClick={() =>
                              setVisibleCols(prev => ({
                                ...prev,
                                [key]: !prev[key],
                              }))
                            }
                            className={`px-3 py-2 rounded cursor-pointer flex items-center justify-between transition
                                ${active
                                ? "bg-sky-50 text-sky-600 font-medium"
                                : "hover:bg-gray-50 text-gray-700"
                              }`}
                          >
                            <span>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                </div>
              </div>
            </div>


            {/* Bulk Actions Bar */}
            {selectedCount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-900">
                    Đã chọn {selectedCount} mục
                  </span>
                  <button
                    onClick={() => {
                      setSelectedIds([]);
                      setSelectAllPages(false);
                      setExcludedIds([]);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      console.log("Export selected:", selectedIds, "selectAllPages:", selectAllPages, "excludedIds:", excludedIds);
                      toast.success("Xuất dữ liệu thành công");
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Xuất dữ liệu
                  </button>
                  <button
                    onClick={() => {
                      openConfirmActionModal(
                        "delete",
                        {
                          ids: selectedIds,
                          count: selectedCount
                        }
                      );
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa đã chọn
                  </button>
                </div>
              </div>
            )}

            {isAllSelected && !selectAllPages && pagination.total > survey.length && (
              <div className="bg-blue-50 border-x border-b border-blue-200 px-4 py-2.5 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedIds.length}</strong> khảo sát trên trang này.{" "}
                <button
                  onClick={() => setSelectAllPages(true)}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                >
                  Chọn tất cả {pagination.total} khảo sát trong tất cả trang
                </button>
              </div>
            )}
            {selectAllPages && (
              <div className="bg-blue-100 border-x border-b border-blue-300 px-4 py-2.5 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedCount}</strong> khảo sát trong tất cả trang.{" "}
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

            {/* TABLE */}
            <div className="w-full overflow-x-auto rounded-b-lg border border-gray-200">
              <table className="w-full table-auto border-collapse text-left text-sm whitespace-nowrap">
                {/* ================== HEADER ================== */}
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="border-b">

                    {/* Checkbox */}
                    <th className="w-12 px-4 text-xs font-semibold text-gray-600 uppercase">
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

                    {visibleCols.courseCode && (
                      <th className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Mã học phần
                      </th>
                    )}

                    {visibleCols.courseName && (
                      <th className="h-12 px-4 min-w-[220px] text-xs font-semibold text-gray-600 uppercase">
                        Tên học phần
                      </th>
                    )}

                    {visibleCols.semester && (
                      <th className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Học kỳ
                      </th>
                    )}

                    {visibleCols.academicYear && (
                      <th className="h-12 px-4 text-xs font-semibold text-gray-600 uppercase">
                        Năm học
                      </th>
                    )}

                    {visibleCols.learningForm && (
                      <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Hình thức học
                      </th>
                    )}

                    {visibleCols.practicalGroup && (
                      <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Nhóm TH
                      </th>
                    )}

                    {visibleCols.createdAt && (
                      <th className="h-12 px-4 hidden md:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Ngày tạo
                      </th>
                    )}

                    {visibleCols.endAt && (
                      <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Ngày kết thúc
                      </th>
                    )}

                    {visibleCols.instructorCode && (
                      <th className="h-12 px-4 hidden lg:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Mã GV
                      </th>
                    )}

                    {visibleCols.instructor && (
                      <th className="h-12 px-4 min-w-[180px] text-xs font-semibold text-gray-600 uppercase">
                        Giảng viên
                      </th>
                    )}

                    {visibleCols.department && (
                      <th className="h-12 px-4 hidden xl:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Khoa
                      </th>
                    )}

                    {visibleCols.averageRating && (
                      <th className="h-12 px-4 hidden xl:table-cell text-xs font-semibold text-gray-600 uppercase">
                        Điểm ĐG
                      </th>
                    )}

                    {visibleCols.status && (
                      <th className="h-12 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Trạng thái
                      </th>
                    )}

                    {/* Action */}
                    <th className="h-12 px-4 text-center text-xs font-semibold text-gray-600 uppercase">
                      Hành động
                    </th>
                  </tr>
                </thead>

                {/* ================== BODY ================== */}
                <tbody>
                  {tableLoading && (
                    <tr>
                      <td colSpan={14} className="px-4 py-8 text-center">
                        <LoadingSpinner text="Đang tải dữ liệu..." color="blue" />
                      </td>
                    </tr>
                  )}
                  {!tableLoading && survey.length === 0 && (
                    <EmptyState
                      title="Không có dữ liệu khảo sát"
                      description="Hiện chưa có khảo sát phù hợp với điều kiện lọc hiện tại."
                      colSpan={14}
                      onAction={fetchSurveyList}
                      actionLabel="Tải lại dữ liệu"
                    />
                  )}
                  {survey.map((u) => (
                    <tr
                      key={u.id}
                      className={`border-b hover:bg-slate-50 transition-colors h-11 ${
                        selectedIds.includes(u.id) ? 'bg-blue-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-2">
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => handleSelectOne(u.id)}
                          className="cursor-pointer"
                        />
                      </td>

                      {visibleCols.courseCode && (
                        <td className="px-4 py-2">
                          {u.course_code}
                        </td>
                      )}

                      {visibleCols.courseName && (
                        <td
                          className="px-4 py-2 max-w-[260px] truncate"
                          title={u.course_name}
                        >
                          {u.course_name}
                        </td>
                      )}

                      {visibleCols.semester && (
                        <td className="px-4 py-2">
                          {u.semester}
                        </td>
                      )}

                      {visibleCols.academicYear && (
                        <td className="px-4 py-2">
                          {u.academic_year}
                        </td>
                      )}

                      {visibleCols.learningForm && (
                        <td className="px-4 py-2 hidden lg:table-cell">
                          {u.learning_form}
                        </td>
                      )}

                      {visibleCols.practicalGroup && (
                        <td className="px-4 py-2 hidden lg:table-cell">
                          {u.practical_group}
                        </td>
                      )}

                      {visibleCols.createdAt && (
                        <td className="px-4 py-2 hidden md:table-cell">
                          {u.created_at}
                        </td>
                      )}

                      {visibleCols.endAt && (
                        <td className="px-4 py-2 hidden lg:table-cell">
                          {u.end_at}
                        </td>
                      )}

                      {visibleCols.instructorCode && (
                        <td className="px-4 py-2 hidden lg:table-cell">
                          {u.instructor_code}
                        </td>
                      )}

                      {visibleCols.instructor && (
                        <td
                          className="px-4 py-2 max-w-[180px] truncate"
                          title={u.instructor}
                        >
                          {u.instructor}
                        </td>
                      )}

                      {visibleCols.department && (
                        <td className="px-4 py-2 hidden xl:table-cell">
                          {u.department}
                        </td>
                      )}

                      {visibleCols.averageRating && (
                        <td className="px-4 py-2 hidden xl:table-cell">
                          {u.average_rating}
                        </td>
                      )}

                      {visibleCols.status && (
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`inline-flex items-center justify-center min-w-[72px] px-2 py-0.5 rounded-full text-xs font-medium
                  ${u.status === "Active"
                                ? "bg-green-100 text-green-600"
                                : u.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-gray-200 text-gray-600"
                              }
                `}
                          >
                            {u.status}
                          </span>
                        </td>
                      )}

                      {/* Action */}
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Nút Xem chi tiết */}
                          <button 
                            title="Xem chi tiết câu hỏi" 
                            onClick={() => openViewSurveyModal(u)}
                            className="p-2 transition-colors duration-200 rounded-lg hover:bg-blue-50 group"
                          >
                            <Eye className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
                          </button>

                          {/* Nút Chỉnh sửa */}
                          <button 
                            title="Chỉnh sửa khảo sát"
                            onClick={() => openEditSurveyModal(u)}
                            className="p-2 transition-colors duration-200 rounded-lg hover:bg-green-50 group"
                          >
                            <PencilLine className="w-5 h-5 text-green-500 group-hover:text-green-600" />
                          </button>

                          {/* Nút Khóa */}
                          <button 
                            title="Khóa khảo sát"
                            onClick={() => openConfirmActionModal("lock", u)}
                            className="p-2 transition-colors duration-200 rounded-lg hover:bg-rose-50 group"
                          >
                            <Lock className="w-5 h-5 text-rose-500 group-hover:text-rose-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>

            {/* PAGINATION */}
            <Pagination
              currentPage={currentPage}
              totalPages={resolvedTotalPages}
              onPageChange={handlePageChange}
              hideOnSinglePage={false}
              disabled={tableLoading}
            />

            {/* MODAL UPLOAD */}
            <ModalUpload open={openUpload} onClose={() => setOpenUpload(false)} />

            {/* MODAL COMPONENTS */}
            <ModalAddSurvey
              isOpen={modalAddSurvey.isOpen}
              onClose={closeAddSurveyModal}
              onSubmit={handleAddSurvey}
            />
            
            <ModalEditSurvey
              isOpen={modalEditSurvey.isOpen}
              onClose={closeEditSurveyModal}
              surveyData={modalEditSurvey.surveyData}
              onSubmit={handleEditSurvey}
            />
            
            <ModalViewSurvey
              isOpen={modalViewSurvey.isOpen}
              onClose={closeViewSurveyModal}
              surveyData={modalViewSurvey.surveyData}
            />

            <ModalCourseSurveyList
              isOpen={modalCourseSurveyList.isOpen}
              onClose={closeCourseSurveyListModal}
            />
            
            <ModalConfirmAction
              isOpen={modalConfirmAction.isOpen}
              onClose={closeConfirmActionModal}
              actionType={modalConfirmAction.actionType}
              userData={modalConfirmAction.surveyData}
              onConfirm={handleConfirmAction}
            />

          </div>
        </div>
      </div>
    </div>

  );
};

export default AdminSurveyPage;

