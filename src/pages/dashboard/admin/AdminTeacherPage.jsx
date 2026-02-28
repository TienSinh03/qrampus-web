import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import ModalAddTeacher from "../../../components/modal/ModalAddTeacher";
import ModalEditTeacher from "../../../components/modal/ModalEditTeacher";
import ModalViewTeacher from "../../../components/modal/ModalViewTeacher";
import ModalConfirmAction from "../../../components/modal/ModalConfirmAction";
import personnelService from "../../../services/personnel.service";
import LoadingSpinner from "@components/layout/LoadingSpinner";
import { toast } from "sonner";
import { DEPARTMENTS } from "../../../constants/departments";
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
  X, ArrowDown, ArrowUp, FileSpreadsheet, FilterX, FileSearchIcon,
  ArrowDownToLine,
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
const AdminTeacherPage = () => {
  const { t } = useTranslation();

  // API Data states
  const [personnels, setPersonnels] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    teacherCode: "",
    fullName: "",
    department: "",
    status: "",
    email: "",
    phone: "",
    dob: "",
    role: "" // teacher/attendance_staff/admin
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // Modal states
  const [modalAddTeacher, setModalAddTeacher] = useState(false);
  const [modalEditTeacher, setModalEditTeacher] = useState({ isOpen: false, teacherData: null });
  const [modalViewTeacher, setModalViewTeacher] = useState({ isOpen: false, teacherData: null });
  const [modalConfirmAction, setModalConfirmAction] = useState({
    isOpen: false,
    actionType: null,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
  });

  // Modal handlers
  const openAddTeacherModal = () => setModalAddTeacher(true);
  const closeAddTeacherModal = () => setModalAddTeacher(false);

  const openEditTeacherModal = (teacher) => {
    setModalEditTeacher({ isOpen: true, teacherData: teacher });
    setOpenMenu(null);
  };
  const closeEditTeacherModal = () => setModalEditTeacher({ isOpen: false, teacherData: null });

  const openViewTeacherModal = (teacher) => setModalViewTeacher({ isOpen: true, teacherData: teacher });
  const closeViewTeacherModal = () => setModalViewTeacher({ isOpen: false, teacherData: null });

  const openConfirmActionModal = (actionType, title, message, confirmText, onConfirm) => {
    setModalConfirmAction({ isOpen: true, actionType, title, message, confirmText, onConfirm });
    setOpenMenu(null);
  };
  const closeConfirmActionModal = () => setModalConfirmAction({ ...modalConfirmAction, isOpen: false });

  const handleAddTeacher = async (formData) => {
    try {
      console.log("Add teacher form data:", formData);
      
      // Role mapping
      const roleMap = {
        "Giảng viên": "teacher",
        "Quản trị viên": "admin",
        "Bộ phận chấm công": "attendance_staff"
      };
      
      // Transform data từ form format sang API format
      const apiData = {
        code: formData.teacherId,
        full_name: formData.fullName,
        email: formData.email,
        dob: formData.dateOfBirth,
        department: formData.department,
        phone: formData.phoneNumber,
        avatar_url: "", // TODO: Handle file upload
        role: roleMap[formData.role] || "teacher"
      };
      
      // Validate required fields
      if (!apiData.code || !apiData.full_name || !apiData.email) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }
      
      // Call API to create personnel
      const response = await personnelService.createPersonnel(apiData);
      
      if (response.success) {
        toast.success(response.message || "Đã thêm nhân sự thành công!");
        closeAddTeacherModal();
        // Refresh danh sách
        fetchPersonnels();
      }
    } catch (error) {
      console.error("Error creating personnel:", error);
      toast.error(error.message || "Không thể thêm nhân sự. Vui lòng thử lại!");
    }
  };

  const handleEditTeacher = (formData) => {
    console.log("Edit teacher:", formData);
    toast.success("Đã cập nhật thông tin giảng viên thành công!");
  };

  // Fetch personnels from API
  const fetchPersonnels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = {
        page: currentPage,
        limit: pagination.limit || 10,
      };

      // Add filters if they have values
      if (filters.search) params.search = filters.search;
      if (filters.teacherCode) params.search = filters.teacherCode; // Use search for teacher code
      if (filters.fullName) params.search = filters.fullName; // Use search for full name
      if (filters.department) params.department = filters.department;
      if (filters.status) params.status = filters.status;
      if (filters.email) params.email = filters.email;
      if (filters.phone) params.phone = filters.phone;
      if (filters.dob) params.dob = filters.dob;
      if (filters.role) params.role = filters.role;

      const response = await personnelService.getAllPersonnels(params);
      
      if (response.success && response.data) {
        setPersonnels(response.data.personnels || []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
      }
    } catch (err) {
      console.error("Error fetching personnels:", err);
      setError(err.message || "Không thể tải danh sách nhân sự");
      toast.error(err.message || "Không thể tải danh sách nhân sự");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when filters/currentPage change
  useEffect(() => {
    fetchPersonnels();
  }, [currentPage]);


  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle search/filter submit
  const handleSearch = () => {
    setCurrentPage(1); // Reset to page 1
    fetchPersonnels();
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      teacherCode: "",
      fullName: "",
      department: "",
      status: "",
      email: "",
      phone: "",
      dob: "",
      role: ""
    });
    setCurrentPage(1);
    // Fetch will be triggered by useEffect
    setTimeout(() => fetchPersonnels(), 100);
  };

  const pillStyle = {
    active: "bg-green-100 text-green-600",
    inactive: "bg-gray-200 text-gray-600",
    pending: "bg-yellow-100 text-yellow-600",
  };

  // Role mapping
  const roleMapping = {
    teacher: "Giảng viên",
    admin: "Quản trị viên",
    attendance_staff: "Ban chấm công"
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(personnels.map(item => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isAllSelected = personnels.length > 0 && selectedIds.length === personnels.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < personnels.length;

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Get color for avatar based on name
  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500"
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // CỘT, BẢNG

  return (

    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Session"
                value="21,459"
                percent="(+29%)"
                positive={true}
                subtitle="Total User"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Paid Users"
                value="4,567"
                percent="(+18%)"
                positive={true}
                subtitle="Last week analytics"
                icon={<UserPlus className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Active Users"
                value="19,860"
                percent="(-14%)"
                positive={false}
                subtitle="Last week analytics"
                icon={<UserCheck className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title="Pending Users"
                value="237"
                percent="(+42%)"
                positive={true}
                subtitle="Last week analytics"
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
                    Mã số nhân sự
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    value={filters.teacherCode}
                    onChange={(e) => handleFilterChange('teacherCode', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập họ tên"
                    value={filters.fullName}
                    onChange={(e) => handleFilterChange('fullName', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khoa/Viện
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    {DEPARTMENTS.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <select 
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="inactive">Tạm ngưng</option>
                  </select>
                </div>
                {expanded && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mail
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: example@iuh.edu.vn"
                        value={filters.email}
                        onChange={(e) => handleFilterChange('email', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: 0912345678"
                        value={filters.phone}
                        onChange={(e) => handleFilterChange('phone', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={filters.dob}
                        onChange={(e) => handleFilterChange('dob', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vai trò
                      </label>
                      <select 
                        value={filters.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Tất cả</option>
                        <option value="teacher">Giảng viên</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="attendance_staff">Ban chấm công</option>
                      </select>
                    </div>
                  </>
                )}


              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between justify-start md:justify-end">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={openAddTeacherModal}
                    className="flex items-center gap-2  border border-emerald-500 text-emerald-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                    title="thêm giảng viên, thủ công"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </button>

                  <button
                    className="flex items-center gap-2 border border-rose-400 text-rose-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-rose-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:ring-offset-1 transition-all duration-200"
                    title="Xóa giảng viên viên, chuyển thành trạng thái tạm ngưng"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setOpenUpload(true)}
                    className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                    title="Upload danh sách giảng viên, vui lòng tải mẫu excel bên dưới"
                  >
                    <CloudUpload className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                    title="Tìm kiếm"
                  >
                    {loading ? <LoadingSpinner size="sm" color="blue" /> : <FileSearchIcon className="w-5 h-5" />}
                  </button>

                  <button
                    className="flex items-center gap-2 border border-emerald-400 text-emerald-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                    title="Xuất danh sách excel"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleClearFilters}
                    disabled={loading}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Xóa bộ lọc, truy vấn bộ lọc khác"
                  >
                    <FilterX className="w-5 h-5" />
                  </button>

                </div>
              </div>
            </div>


            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-blue-900">
                    Đã chọn {selectedIds.length} mục
                  </span>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      console.log("Export selected:", selectedIds);
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
                        "Xác nhận xóa nhiều giảng viên",
                        `Bạn có chắc chắn muốn xóa ${selectedIds.length} giảng viên đã chọn? Hành động này không thể hoàn tác.`,
                        "Xóa tất cả",
                        () => {
                          console.log("Delete selected:", selectedIds);
                          toast.success(`Đã xóa ${selectedIds.length} giảng viên thành công`);
                          setSelectedIds([]);
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

            {/* TABLE */}
            <div className="w-full overflow-x-auto bg-white rounded-xl shadow mb-6">
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
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="h-12 px-4">Ảnh</th>
                    <th className="h-12 px-4">Mã nhân sự</th>
                    <th className="h-12 px-4">{t("users.name")}</th>
                    <th className="h-12 px-4">{t("users.email")}</th>
                    <th className="h-12 px-4">{t("users.role")}</th>
                    <th className="h-12 px-4">{t("users.status")}</th>
                    <th className="h-12 px-4">{t("users.actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <LoadingSpinner size="lg" color="blue" text="Đang tải dữ liệu..." />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <p className="text-red-500">{error}</p>
                        <button
                          onClick={fetchPersonnels}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Thử lại
                        </button>
                      </td>
                    </tr>
                  ) : personnels.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <p className="text-gray-500">Không có dữ liệu</p>
                      </td>
                    </tr>
                  ) : personnels.map((personnel) => (
                    <tr key={personnel.id} className={`border-t hover:bg-slate-50 ${
                      selectedIds.includes(personnel.id) ? 'bg-blue-50' : ''
                    }`}>
                      <td>
                        <input
                          type="checkbox"
                          className="ml-4 cursor-pointer"
                          checked={selectedIds.includes(personnel.id)}
                          onChange={() => handleSelectOne(personnel.id)}
                        />
                      </td>
                      <td className="px-2 h-10 flex items-center gap-2 p-6">
                        {personnel.avatar_url ? (
                          <img 
                            src={personnel.avatar_url} 
                            alt={personnel.full_name}
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                        ) : (
                          <div className={`w-8 h-8 rounded-full ${getAvatarColor(personnel.full_name)} flex items-center justify-center text-white text-xs font-semibold`}>
                            {getInitials(personnel.full_name)}
                          </div>
                        )}
                      </td>
                      <td className="px-4">{personnel.teacher_code}</td>
                      <td className="px-4 min-w-max">{personnel.full_name}</td>

                      <td className="px-4">{personnel.email}</td>
                      <td className="px-4">
                        {personnel.user?.roles?.[0]?.name 
                          ? roleMapping[personnel.user.roles[0].name] || personnel.user.roles[0].name
                          : "-"}
                      </td>

                      <td className="px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            pillStyle[personnel.user?.status?.toLowerCase()] || 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {personnel.user?.status === 'active' ? 'Hoạt động' : 
                           personnel.user?.status === 'inactive' ? 'Tạm ngưng' : 
                           personnel.user?.status || '-'}
                        </span>
                      </td>

                      <td className="px-4">
                        <div className="flex gap-3">
                          <button
                            title="Xóa"
                            onClick={() => openConfirmActionModal(
                              "delete",
                              "Xác nhận xóa nhân sự",
                              `Bạn có chắc chắn muốn xóa nhân sự ${personnel.full_name}? Trạng thái sẽ chuyển thành tạm ngưng.`,
                              "Xóa nhân sự",
                              () => {
                                console.log("Delete personnel", personnel.id);
                                toast.success("Đã xóa nhân sự thành công");
                              }
                            )}
                          >
                            <Trash2 className="text-red-500 cursor-pointer w-5 h-5" />
                          </button>
                          <button
                            title="Xem chi tiết"
                            onClick={() => openViewTeacherModal(personnel)}
                          >
                            <Eye className="text-blue-500 cursor-pointer w-5 h-5" />
                          </button>
                          {/* More Menu */}
                          <div className="relative">
                            <MoreVertical
                              className="cursor-pointer w-5 h-5"
                              onClick={() =>
                                setOpenMenu(openMenu === personnel.id ? null : personnel.id)
                              }
                            />

                            {/* Dropdown */}
                            {openMenu === personnel.id && (
                              <div className="absolute mt-2 w-25 bg-white shadow-lg rounded-md border z-20">
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-slate-100"
                                  title="Chỉnh sửa"
                                  onClick={() => openEditTeacherModal(personnel)}
                                >
                                  <PencilLine className="inline w-4 h-4 mr-2" />
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-slate-100"
                                  title="Khóa tài khoản"
                                  onClick={() => openConfirmActionModal(
                                    "lock",
                                    "Xác nhận khóa tài khoản",
                                    `Bạn có chắc chắn muốn khóa tài khoản của ${personnel.full_name}?`,
                                    "Khóa tài khoản",
                                    () => {
                                      console.log("Lock personnel", personnel.id);
                                      toast.success("Đã khóa tài khoản thành công");
                                    }
                                  )}
                                >
                                  <LockKeyhole className="inline w-4 h-4 mr-2" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />

            {/* MODALS */}
            <ModalUpload open={openUpload} onClose={() => setOpenUpload(false)} />
            
            <ModalAddTeacher
              isOpen={modalAddTeacher}
              onClose={closeAddTeacherModal}
              onSubmit={handleAddTeacher}
            />

            <ModalEditTeacher
              isOpen={modalEditTeacher.isOpen}
              onClose={closeEditTeacherModal}
              teacherData={modalEditTeacher.teacherData}
              onSubmit={handleEditTeacher}
            />

            <ModalViewTeacher
              isOpen={modalViewTeacher.isOpen}
              onClose={closeViewTeacherModal}
              teacherData={modalViewTeacher.teacherData}
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

            {/* OLD DRAWER REMOVED - Now using ModalAddTeacher */}
            {false && (
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
                        Thêm hồ sơ Giảng viên
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
                          Mã giảng viên
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ tên Giảng viên
                        </label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          className="w-full border  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="text"
                          className="w-full border  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Khoa/Viện
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option>Khoa Công nghệ thông tin</option>
                          <option>Khoa Điện tử - Viễn thông</option>
                          <option>Khoa Cơ khí</option>
                          <option>Khoa Kinh tế</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phân quyền tài khoản
                        </label>
                        <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                          <option>Giảng viên</option>
                          <option>Quản trị viên</option>
                          <option>Bộ phận chấm công</option>
                        </select>
                      </div>

                      {/* ảnh đại diện */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ảnh đại diện
                        </label>
                        <input
                          type="file"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
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
                      Tạo hồ sơ
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTeacherPage;
