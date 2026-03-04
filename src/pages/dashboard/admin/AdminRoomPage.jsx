import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import ModalAddRoom from "../../../components/modal/ModalAddRoom";
import ModalEditRoom from "../../../components/modal/ModalEditRoom";
import ModalViewRoom from "../../../components/modal/ModalViewRoom";
import ModalConfirmAction from "../../../components/modal/ModalConfirmAction";
import ModalExportRoomExcel from "../../../components/modal/ModalExportRoomExcel";
import ModalBulkUploadRoom from "../../../components/modal/ModalBulkUploadRoom";
import roomService from "../../../services/room.service";
import { exportRoomsToExcel } from "../../../utils/excelExport";
import {
  CirclePlus,
  LockKeyhole,
  LockKeyholeOpen,
  CloudUpload,
  Eye,
  PencilLine,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  X, ArrowDown, ArrowUp, FileSpreadsheet, FilterX, FileSearchIcon,
  ArrowDownToLine,
  File, Settings,
  MapPin
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
import EmptyState from "@components/layout/EmptyState";
const AdminRoomPage = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [openUpload, setOpenUpload] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [excludedIds, setExcludedIds] = useState([]);
  
  // Room data and pagination
  const [rooms, setRooms] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingRoomDetail, setLoadingRoomDetail] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    roomCode: "",
    roomName: "",
    status: ""
  });

  // Modal states
  const [modalAddRoom, setModalAddRoom] = useState({ isOpen: false });
  const [modalEditRoom, setModalEditRoom] = useState({ isOpen: false, roomData: null, roomId: null });
  const [modalViewRoom, setModalViewRoom] = useState({ isOpen: false, roomData: null });
  const [modalConfirmAction, setModalConfirmAction] = useState({
    isOpen: false,
    actionType: null,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
    userData: null,
  });
  const [modalExportExcel, setModalExportExcel] = useState({ isOpen: false, data: [] });

  // Modal handlers
  const openAddRoomModal = () => setModalAddRoom({ isOpen: true });
  const closeAddRoomModal = () => setModalAddRoom({ isOpen: false });

  const openEditRoomModal = async (roomId) => {
    // Validate roomId
    if (!roomId || typeof roomId !== 'string' && typeof roomId !== 'number') {
      console.error('Invalid roomId:', roomId);
      toast.error("ID phòng không hợp lệ");
      return;
    }
    
    setLoadingRoomDetail(true);
    setModalEditRoom({ isOpen: true, roomData: null, roomId }); // Open modal first with roomId
    
    try {
      const response = await roomService.getRoomById(roomId);
      
      if (response && response.success) {
        // Handle response structure
        const roomData = response.data?.room || response.data;
        setModalEditRoom({ isOpen: true, roomData, roomId });
      } else if (response && response.data) {
        setModalEditRoom({ isOpen: true, roomData: response.data, roomId });
      } else {
        toast.error("Không thể tải thông tin phòng");
        setModalEditRoom({ isOpen: false, roomData: null, roomId: null });
      }
    } catch (error) {
      console.error("Error fetching room detail:", error);
      toast.error("Đã có lỗi khi tải thông tin phòng");
      setModalEditRoom({ isOpen: false, roomData: null, roomId: null });
    } finally {
      setLoadingRoomDetail(false);
    }
  };
  
  const closeEditRoomModal = () => setModalEditRoom({ isOpen: false, roomData: null, roomId: null });

  const openViewRoomModal = async (roomId) => {
    setLoadingRoomDetail(true);
    setModalViewRoom({ isOpen: true, roomData: null }); // Open modal first
    
    try {
      const response = await roomService.getRoomById(roomId);
      
      if (response && response.success) {
        // Handle response structure
        const roomData = response.data?.room || response.data;
        setModalViewRoom({ isOpen: true, roomData });
      } else if (response && response.data) {
        setModalViewRoom({ isOpen: true, roomData: response.data });
      } else {
        toast.error("Không thể tải thông tin phòng");
        setModalViewRoom({ isOpen: false, roomData: null });
      }
    } catch (error) {
      console.error("Error fetching room detail:", error);
      toast.error("Đã có lỗi khi tải thông tin phòng");
      setModalViewRoom({ isOpen: false, roomData: null });
    } finally {
      setLoadingRoomDetail(false);
    }
  };
  
  const closeViewRoomModal = () => setModalViewRoom({ isOpen: false, roomData: null });

  const openConfirmActionModal = (actionType, title, message, confirmText, onConfirm, userData = null) => {
    setModalConfirmAction({
      isOpen: true,
      actionType,
      title,
      message,
      confirmText,
      onConfirm,
      userData,
    });
  };
  const closeConfirmActionModal = () => setModalConfirmAction({ ...modalConfirmAction, isOpen: false });

  // Fetch rooms from API
  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };
      
      // Add search filters
      if (filters.roomCode) {
        params.search = filters.roomCode;
      } else if (filters.roomName) {
        params.search = filters.roomName;
      } else if (searchQuery) {
        params.search = searchQuery;
      }
      
      // Add status filter
      if (filters.status !== "") {
        params.is_active = filters.status === "active";
      }

      const response = await roomService.getRooms(params);
      console.log("API Response:", response); // Debug log
      
      // Handle response based on actual API structure
      if (response && response.success) {
        // API returns: { success: true, data: { rooms: [...], pagination: {...} } }
        // or: { success: true, data: [...] }
        const responseData = response.data;
        
        if (Array.isArray(responseData)) {
          // data is directly an array
          setRooms(responseData);
          setPagination(response.pagination || {
            total: responseData.length,
            page: currentPage,
            limit: itemsPerPage,
            totalPages: Math.ceil(responseData.length / itemsPerPage)
          });
        } else if (responseData && Array.isArray(responseData.rooms)) {
          // data is an object with rooms array
          setRooms(responseData.rooms);
          setPagination(responseData.pagination || response.pagination || {
            total: responseData.rooms.length,
            page: currentPage,
            limit: itemsPerPage,
            totalPages: Math.ceil(responseData.rooms.length / itemsPerPage)
          });
        } else if (responseData && typeof responseData === 'object') {
          // data is an object, might be pagination info in root
          // Try to find the rooms array in the data object
          const rooms = Object.values(responseData).find(val => Array.isArray(val));
          if (rooms) {
            setRooms(rooms);
            setPagination(responseData.pagination || {
              total: rooms.length,
              page: currentPage,
              limit: itemsPerPage,
              totalPages: Math.ceil(rooms.length / itemsPerPage)
            });
          } else {
            console.error("No array found in response.data:", responseData);
            setRooms([]);
            toast.error("Không tìm thấy danh sách phòng trong dữ liệu");
          }
        } else {
          console.error("Unexpected data format:", responseData);
          setRooms([]);
          toast.error("Định dạng dữ liệu không đúng");
        }
      } else if (response && response.data && Array.isArray(response.data)) {
        // Standard response format: { data: [...], pagination: {...} }
        setRooms(response.data);
        setPagination(response.pagination || {
          total: response.data.length,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(response.data.length / itemsPerPage)
        });
      } else if (Array.isArray(response)) {
        // Response is directly an array
        setRooms(response);
        setPagination({
          total: response.length,
          page: currentPage,
          limit: itemsPerPage,
          totalPages: Math.ceil(response.length / itemsPerPage)
        });
      } else if (response && response.success === false) {
        // Error response
        setRooms([]);
        toast.error(response.message || "Không thể tải danh sách phòng học");
      } else {
        // Unexpected format
        console.error("Unexpected response format:", response);
        setRooms([]);
        toast.error("Không thể tải dữ liệu phòng học");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setRooms([]); // Ensure rooms is always an array
      toast.error(error.message || "Đã có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery, filters]);

  // Load rooms on component mount
  useEffect(() => {
    fetchRooms();
  }, [currentPage, itemsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset selection when changing pages (unless select all pages is active)
  useEffect(() => {
    if (!selectAllPages) {
      setSelectedIds([]);
    }
  }, [currentPage, selectAllPages]);

  // When selectAllPages = true and new page data loads, auto-select all on that page (except excluded)
  useEffect(() => {
    if (selectAllPages && rooms.length > 0) {
      setSelectedIds(rooms.filter(r => !excludedIds.includes(r.id)).map(r => r.id));
    }
  }, [rooms, selectAllPages, excludedIds]);

  const handleAddRoom = (formData) => {
    console.log("Add room:", formData);
    toast.success("Đã thêm phòng học thành công!");
    fetchRooms(); // Refresh the list
  };

  const handleEditRoom = async (formData) => {
    const roomId = modalEditRoom.roomId;
    
    if (!roomId) {
      toast.error("Không tìm thấy ID phòng");
      return;
    }
    
    try {
      console.log("Updating room:", roomId, formData);
      
      const response = await roomService.updateRoom(roomId, formData);
      
      if (response && response.success) {
        toast.success("Đã cập nhật thông tin phòng thành công!");
        fetchRooms(); // Refresh the list
        closeEditRoomModal();
      } else {
        toast.error(response?.message || "Cập nhật phòng thất bại");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error(error?.message || "Đã có lỗi khi cập nhật phòng");
    }
  };

  // Handle toggle room status (active/inactive)
  const handleToggleRoomStatus = async (room) => {
    try {
      const response = await roomService.toggleRoomStatus(room.id);
      
      if (response && response.success) {
        toast.success(
          room.is_active 
            ? `Đã khóa phòng ${room.room_name} thành công`
            : `Đã mở khóa phòng ${room.room_name} thành công`
        );
        fetchRooms(); // Refresh the list
      } else {
        toast.error(response?.message || "Không thể thay đổi trạng thái phòng");
      }
    } catch (error) {
      console.error("Error toggling room status:", error);
      toast.error(error.message || "Đã có lỗi xảy ra");
    }
  };

  // Open export Excel modal
  const openExportExcelModal = async () => {
    if (selectedIds.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 phòng học để xuất dữ liệu");
      return;
    }

    // Lấy dữ liệu phòng đã chọn (trang hiện tại)
    const selectedRooms = rooms.filter(room => selectedIds.includes(room.id));
    setModalExportExcel({ isOpen: true, data: selectedRooms });
  };

  const closeExportExcelModal = () => setModalExportExcel({ isOpen: false, data: [] });

  // Handle export to Excel
  const handleExportExcel = ({ selectedColumns, filename }) => {
    try {
      exportRoomsToExcel(modalExportExcel.data, filename, selectedColumns);
      toast.success(`Đã xuất ${modalExportExcel.data.length} phòng học ra file Excel thành công`);
      closeExportExcelModal();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Không thể xuất file Excel. Vui lòng thử lại!");
    }
  };

  // Handle bulk upload rooms
  const handleBulkUpload = async (roomsList) => {
    try {
      const response = await roomService.bulkCreateRooms(roomsList);
      
      if (response && response.success) {
        const result = response.data;
        
        if (result.successCount > 0) {
          toast.success(`Đã thêm thành công ${result.successCount} phòng học`);
        }
        
        if (result.failCount > 0) {
          toast.warning(`${result.failCount} phòng thất bại. Vui lòng kiểm tra chi tiết lỗi.`);
        }
        
        // Refresh room list
        fetchRooms();
        
        return response;
      } else {
        toast.error(response?.message || "Không thể upload danh sách phòng học");
        return response;
      }
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error(error.message || "Đã có lỗi xảy ra khi upload");
      throw error;
    }
  };

  // Hardcoded PHONG data removed - now fetching from API
  // const PHONG = [...];

  const pillStyle = {
    Active: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Inactive: "bg-gray-200 text-gray-600",
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Remove page IDs from excluded when re-selecting header
      const pageIds = rooms.map(item => item.id);
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

  const handleSelectOne = (roomId) => {
    if (selectAllPages) {
      if (excludedIds.includes(roomId)) {
        // Re-select: remove from excluded, add to selected
        setExcludedIds(excludedIds.filter(eid => eid !== roomId));
        setSelectedIds([...selectedIds, roomId]);
      } else {
        // Deselect: add to excluded, remove from selected
        setExcludedIds([...excludedIds, roomId]);
        setSelectedIds(selectedIds.filter(sid => sid !== roomId));
      }
    } else {
      if (selectedIds.includes(roomId)) {
        setSelectedIds(selectedIds.filter(selectedId => selectedId !== roomId));
      } else {
        setSelectedIds([...selectedIds, roomId]);
      }
    }
  };

  // Actual selected count
  const selectedCount = selectAllPages ? pagination.total - excludedIds.length : selectedIds.length;

  const isAllSelected = rooms.length > 0 && selectedIds.length === rooms.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < rooms.length;

  // Helper function to format coordinates
  const formatCoordinate = (coord) => {
    if (!coord || coord.x === undefined || coord.y === undefined) return 'N/A';
    // Format numbers, remove unnecessary decimals
    const x = Number(coord.x) % 1 === 0 ? coord.x : Number(coord.x).toFixed(1);
    const y = Number(coord.y) % 1 === 0 ? coord.y : Number(coord.y).toFixed(1);
    return (
      <div className="rounded-lg border bg-card/50 px-3.5 py-2 text-sm shadow-xs">
        <div className="space-y-2.5">
          {[x, y].map((loc, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <div className="rounded-full bg-red-50/70 p-1">
                <MapPin className="h-3.5 w-3.5 text-red-600" />
              </div>
              <span className="font-medium leading-snug">{loc}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };




  return (

    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Tổng số"
                value="21,459"
                percent="(+29%)"
                positive={true}
                subtitle="phòng đã tạo"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Tổng số"
                value="4,567"
                percent="(+18%)"
                positive={true}
                subtitle="phòng học hôm nay"
                icon={<UserPlus className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Tổng số"
                value="19,860"
                percent="(-14%)"
                positive={false}
                subtitle="phòng trống"
                icon={<UserCheck className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title="Tổng số"
                value="237"
                percent="(+42%)"
                positive={true}
                subtitle="phòng thiếu vị trí"
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

              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã phòng
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: A.001"
                    value={filters.roomCode}
                    onChange={(e) => setFilters({ ...filters, roomCode: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Phòng thí nghiệm"
                    value={filters.roomName}
                    onChange={(e) => setFilters({ ...filters, roomName: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái phòng
                  </label>
                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Tạm ngưng</option>
                  </select>
                </div>



              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between justify-start md:justify-end">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={openAddRoomModal}
                    className="flex items-center gap-2  border border-emerald-500 text-emerald-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                    title="Thêm phòng học mới"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setOpenBulkUpload(true)}
                    className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                    title="Upload danh sách phòng học bằng file Excel"
                  >
                    <CloudUpload className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage(1);
                      fetchRooms();
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                    title="Tìm kiếm"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700" />
                    ) : (
                      <FileSearchIcon className="w-5 h-5" />
                    )}
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
                    onClick={() => {
                      setFilters({ roomCode: "", roomName: "", status: "" });
                      setSearchQuery("");
                      setCurrentPage(1);
                      setSelectedIds([]);
                      setSelectAllPages(false);
                      setExcludedIds([]);
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Xóa bộ lọc, truy vấn bộ lọc khác"
                  >
                    <FilterX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>


            {/* Select all pages banner */}
            {isAllSelected && !selectAllPages && pagination.total > rooms.length && (
              <div className="bg-blue-50 border border-blue-200 px-4 py-3 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedIds.length}</strong> phòng trên trang này.{" "}
                <button
                  onClick={() => setSelectAllPages(true)}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                >
                  Chọn tất cả {pagination.total} phòng trong tất cả trang
                </button>
              </div>
            )}
            {selectAllPages && (
              <div className="bg-blue-100 border border-blue-300  px-4 py-3 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedCount}</strong> phòng trong tất cả trang.{" "}
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
                      Mã phòng
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Tên phòng
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Mô tả
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Vị trí 1
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Vị trí 2
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Vị trí 3
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Vị trí 4
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">
                      Trạng thái
                    </th>




                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">
                      {t("users.actions")}
                    </th>
                  </tr>
                </thead>

                {/* ================== BODY ================== */}
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-3">Đang tải dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : rooms.length === 0 ? (
                    <EmptyState
                      title="Không tìm thấy phòng học"
                      description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
                      colSpan={10}
                    />
                  ) : (
                    rooms.map((room) => (
                      <tr
                        key={room.id}
                        className={`border-b hover:bg-slate-50 transition-colors h-12 ${
                          selectedIds.includes(room.id) ? 'bg-blue-50' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="px-4 py-2">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.includes(room.id)}
                            onChange={() => handleSelectOne(room.id)}
                            className="cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-2">{room.room_code}</td>
                        <td className="px-4 py-2">{room.room_name}</td>
                        <td className="px-4 py-2">
                          <span className="text-sm text-gray-600">
                            {room.description || 'Chưa có mô tả'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {formatCoordinate(room.coordinates?.[0])}
                        </td>
                        <td className="px-4 py-2">
                          {formatCoordinate(room.coordinates?.[1])}
                        </td>
                        <td className="px-4 py-2">
                          {formatCoordinate(room.coordinates?.[2])}
                        </td>
                        <td className="px-4 py-2">
                          {formatCoordinate(room.coordinates?.[3])}
                        </td>


                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              room.is_active ? pillStyle.Active : pillStyle.Inactive
                            }`}
                          >
                            {room.is_active ? 'Hoạt động' : 'Không hoạt động'}
                          </span>
                        </td>


                        {/* Actions */}
                        <td className="px-4 py-2">
                          <div className="flex justify-center gap-3">
                            <button
                              title="Xem chi tiết"
                              onClick={() => openViewRoomModal(room.id)}
                            >
                              <Eye className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700" />
                            </button>
                            <button
                              title="Chỉnh sửa"
                              onClick={() => {
                                console.log('Edit room clicked, room:', room, 'room.id:', room.id);
                                openEditRoomModal(room.id);
                              }}
                            >
                              <PencilLine className="w-5 h-5 text-amber-500 cursor-pointer hover:text-amber-700" />
                            </button>
                            <button
                              title={room.is_active ? "Khóa phòng" : "Mở khóa phòng"}
                              onClick={() => openConfirmActionModal(
                                "lock",
                                room.is_active ? "Xác nhận khóa phòng" : "Xác nhận mở khóa phòng",
                                room.is_active 
                                  ? `Bạn có chắc chắn muốn khóa phòng ${room.room_name}?`
                                  : `Bạn có chắc chắn muốn mở khóa phòng ${room.room_name}?`,
                                room.is_active ? "Khóa phòng" : "Mở khóa phòng",
                                () => handleToggleRoomStatus(room)
                              )}
                            >
                              {room.is_active ? (
                                <LockKeyholeOpen className="w-5 h-5 text-green-500 cursor-pointer hover:text-green-700" />
                              ) : (
                                <LockKeyhole className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>


            {/* PAGINATION */}
            <div className="flex items-center justify-between px-2 mb-4">
              <span className="text-sm text-gray-500">
                Tổng: <strong>{pagination.total || 0}</strong> phòng học
              </span>
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>

            {/* MODAL UPLOAD */}
            <ModalUpload open={openUpload} onClose={() => setOpenUpload(false)} />

            {/* Modals */}
            <ModalBulkUploadRoom
              open={openBulkUpload}
              onClose={() => setOpenBulkUpload(false)}
              onUpload={handleBulkUpload}
            />

            <ModalAddRoom
              isOpen={modalAddRoom.isOpen}
              onClose={closeAddRoomModal}
              onSubmit={handleAddRoom}
            />

            <ModalEditRoom
              isOpen={modalEditRoom.isOpen}
              onClose={closeEditRoomModal}
              roomData={modalEditRoom.roomData}
              onSubmit={handleEditRoom}
              loading={loadingRoomDetail}
            />

            <ModalViewRoom
              isOpen={modalViewRoom.isOpen}
              onClose={closeViewRoomModal}
              roomData={modalViewRoom.roomData}
              loading={loadingRoomDetail}
            />

            <ModalConfirmAction
              isOpen={modalConfirmAction.isOpen}
              onClose={closeConfirmActionModal}
              actionType={modalConfirmAction.actionType}
              title={modalConfirmAction.title}
              message={modalConfirmAction.message}
              confirmText={modalConfirmAction.confirmText}
              onConfirm={modalConfirmAction.onConfirm}
            />

            <ModalExportRoomExcel
              isOpen={modalExportExcel.isOpen}
              onClose={closeExportExcelModal}
              onExport={handleExportExcel}
            />

            {/* Old Drawer - Removed */}
            {false && isDrawerOpen && (
              <>
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-[1000]"
                  onClick={closeDrawer}
                />

                {/* Drawer từ bên phải trượt ra */}
                <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
                  {/* Header Drawer */}
                  <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-lime-100">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Thêm phòng mới
                      </h3>
                    </div>
                    <button
                      onClick={closeDrawer}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none  rounded-full hover:bg-lime-400 transition-all  duration-300 ease-in-out p-2 hover:rotate-90"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Body Form */}
                  <div className="p-6 overflow-y-auto h-full pb-32">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mã phòng
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên phòng
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Vị trí 1
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          {/* X */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              X
                            </span>
                            <input type="number" placeholder="0" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Y */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              Y
                            </span>
                            <input type="number" placeholder="0" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Vị trí 2
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          {/* X */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              X
                            </span>
                            <input type="number" placeholder="0" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Y */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              Y
                            </span>
                            <input type="number" placeholder="0" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Vị trí 3
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          {/* X */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              X
                            </span>
                            <input type="number" placeholder="0" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Y */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              Y
                            </span>
                            <input type="number" placeholder="0" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Vị trí 4
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                          {/* X */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              X
                            </span>
                            <input type="number" placeholder="0" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          {/* Y */}
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              Y
                            </span>
                            <input type="number" placeholder="0" className="w-full border rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      </div>


                    </div>
                  </div>

                  {/* Footer Buttons - Fixed bottom */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
                    <button
                      onClick={closeDrawer}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Thêm phòng
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div >

  );
};

export default AdminRoomPage;
