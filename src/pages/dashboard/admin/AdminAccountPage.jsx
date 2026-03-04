import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import ModalEditUser from "../../../components/modal/ModalEditUser";
import ModalViewUser from "../../../components/modal/ModalViewUser";
import ModalConfirmAction from "../../../components/modal/ModalConfirmAction";
import ModalResetPassword from "../../../components/modal/ModalResetPassword";
import ModalExportAccountExcel from "../../../components/modal/ModalExportAccountExcel";
import userService from "../../../services/user.service";
import { exportAccountsToExcel } from "../../../utils/excelExport";
import LoadingSpinner from "@components/layout/LoadingSpinner";
import EmptyState from "@components/layout/EmptyState";
import { toast } from "sonner";


import {
  CirclePlus,
  Trash2,
  LockKeyhole,
  LockKeyholeOpen,
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
  GitPullRequest
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
const AdminAccountPage = () => {
  const { t } = useTranslation();

  // API Data states
  const [users, setUsers] = useState([]);
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
    code: "",
    fullName: "",
    email: "",
    status: "",
    type: "", // personnel or student
    department: "",
    phone: "",
    dob: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const [excludedIds, setExcludedIds] = useState([]);
  const [expanded, setExpanded] = useState(false);

  // Modal states
  const [modalEditUser, setModalEditUser] = useState({ isOpen: false, userData: null });
  const [modalViewUser, setModalViewUser] = useState({ isOpen: false, userData: null });
  const [modalConfirmAction, setModalConfirmAction] = useState({
    isOpen: false,
    actionType: null,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
  });
  const [modalResetPassword, setModalResetPassword] = useState({
    isOpen: false,
    userIds: [],
    isBulk: false,
    userData: null
  });
  const [modalExportExcel, setModalExportExcel] = useState({ isOpen: false, data: [] });

  // Modal handlers
  const openEditUserModal = (user) => setModalEditUser({ isOpen: true, userData: user });
  const closeEditUserModal = () => setModalEditUser({ isOpen: false, userData: null });

  const openViewUserModal = (user) => setModalViewUser({ isOpen: true, userData: user });
  const closeViewUserModal = () => setModalViewUser({ isOpen: false, userData: null });

  const openConfirmActionModal = (actionType, title, message, confirmText, onConfirm) => {
    setModalConfirmAction({ isOpen: true, actionType, title, message, confirmText, onConfirm });
  };
  const closeConfirmActionModal = () => setModalConfirmAction({ ...modalConfirmAction, isOpen: false });

  // Reset password handlers
  const openResetPasswordModal = (userIds, isBulk = false, userData = null) => {
    setModalResetPassword({ 
      isOpen: true, 
      userIds: Array.isArray(userIds) ? userIds : [userIds], 
      isBulk, 
      userData 
    });
  };
  
  const closeResetPasswordModal = () => {
    setModalResetPassword({ 
      isOpen: false, 
      userIds: [], 
      isBulk: false, 
      userData: null 
    });
    // Refresh data after reset
    fetchUsers();
  };

  // Export Excel handlers
  const openExportExcelModal = async () => {
    if (selectedCount === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 tài khoản để xuất dữ liệu");
      return;
    }

    // Nếu chọn tất cả trang, fetch toàn bộ rồi lọc bỏ excluded
    if (selectAllPages) {
      try {
        const params = {
          page: 1,
          limit: pagination.total,
        };
        if (filters.search) params.search = filters.search;
        if (filters.code) params.search = filters.code;
        if (filters.fullName) params.search = filters.fullName;
        if (filters.email) params.email = filters.email;
        if (filters.status) params.status = filters.status;
        if (filters.type) params.type = filters.type;
        if (filters.department) params.department = filters.department;
        if (filters.phone) params.phone = filters.phone;
        if (filters.dob) params.dob = filters.dob;

        const response = await userService.getAdminUsers(params);
        if (response && response.data && response.data.users) {
          const allUsers = (response.data.users || []).filter(u => !excludedIds.includes(u.id));
          setModalExportExcel({ isOpen: true, data: allUsers });
        }
      } catch (error) {
        toast.error("Không thể tải danh sách tài khoản để xuất.");
      }
      return;
    }

    // Lấy dữ liệu user đã chọn (trang hiện tại)
    const selectedUsers = users.filter(u => selectedIds.includes(u.id));
    setModalExportExcel({ isOpen: true, data: selectedUsers });
  };

  const closeExportExcelModal = () => setModalExportExcel({ isOpen: false, data: [] });

  const handleExportExcel = ({ selectedColumns, filename }) => {
    try {
      exportAccountsToExcel(modalExportExcel.data, filename, selectedColumns);
      toast.success(`Đã xuất ${modalExportExcel.data.length} tài khoản ra file Excel thành công`);
      closeExportExcelModal();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Không thể xuất file Excel. Vui lòng thử lại!");
    }
  };

  const handleResetPassword = async (password) => {
    const { userIds, isBulk } = modalResetPassword;
    
    try {
      if (isBulk) {
        // Bulk reset
        const response = await userService.bulkResetPassword(userIds, password);
        return response; // Return response to show results
      } else {
        // Single reset
        const response = await userService.resetPassword(userIds[0], password);
        toast.success("Đã reset mật khẩu thành công!");
        return response;
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  // Toggle user status (active/deactivate)
  const handleToggleUserStatus = async (user) => {
    try {
      console.log("Toggling user status for:", user.user_name);
      
      const response = await userService.toggleUserStatus(user.user_name);
      
      if (response.success) {
        const newStatus = response.data.status;
        const statusText = newStatus === 'active' ? 'kích hoạt' : 'tạm ngưng';
        toast.success(`Đã ${statusText} tài khoản thành công!`);
        
        // Refresh data
        fetchUsers();
      } else {
        toast.error(response.message || "Không thể cập nhật trạng thái tài khoản");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error(error.message || "Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại!");
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
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
      if (filters.code) params.search = filters.code;
      if (filters.fullName) params.search = filters.fullName;
      if (filters.email) params.email = filters.email;
      if (filters.status) params.status = filters.status;
      if (filters.type) params.type = filters.type;
      if (filters.department) params.department = filters.department;
      if (filters.phone) params.phone = filters.phone;
      if (filters.dob) params.dob = filters.dob;

      const response = await userService.getAdminUsers(params);
      
      console.log("API Response:", response); // Debug log
      
      // Response structure: { success, data: { users: [...], pagination: {...} } }
      if (response && response.data) {
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
        setPagination(response.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
      } else {
        // Fallback if response structure is different
        setUsers([]);
        setPagination({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message || "Không thể tải danh sách tài khoản");
      toast.error(err.message || "Không thể tải danh sách tài khoản");
      setUsers([]); // Ensure users is always an array even on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when currentPage changes
  useEffect(() => {
    fetchUsers();
    if (!selectAllPages) {
      setSelectedIds([]);
    }
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-select users when selectAllPages is true
  useEffect(() => {
    if (selectAllPages && users.length > 0) {
      setSelectedIds(users.filter(u => !excludedIds.includes(u.id)).map(u => u.id));
    }
  }, [users]); // eslint-disable-line react-hooks/exhaustive-deps

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
    fetchUsers();
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      code: "",
      fullName: "",
      email: "",
      status: "",
      type: "",
      department: "",
      phone: "",
      dob: ""
    });
    setCurrentPage(1);
    setSelectedIds([]);
    setSelectAllPages(false);
    setExcludedIds([]);
    setTimeout(() => fetchUsers(), 100);
  };

  // Role mapping
  const roleMapping = {
    teacher: "Giảng viên",
    admin: "Quản trị viên",
    attendance_staff: "Ban chấm công",
    student: "Sinh viên"
  };

  // Role color mapping
  const roleColorMapping = {
    teacher: "bg-blue-100 text-blue-700 border border-blue-200",
    admin: "bg-red-100 text-red-700 border border-red-200",
    attendance_staff: "bg-green-100 text-green-700 border border-green-200",
    student: "bg-purple-100 text-purple-700 border border-purple-200"
  };

  // Get role display text
  const getRoleDisplay = (roles) => {
    if (!roles || roles.length === 0) return "-";
    return roles.map(role => roleMapping[role] || role).join(", ");
  };

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

  const pillStyle = {
    active: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    inactive: "bg-gray-200 text-gray-600",
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const pageIds = users.map(item => item.id);
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
        // Re-select: remove from excluded, add to selected
        setExcludedIds(excludedIds.filter(eid => eid !== id));
        setSelectedIds([...selectedIds, id]);
      } else {
        // Deselect: add to excluded, remove from selected
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

  // Actual selected count
  const selectedCount = selectAllPages ? pagination.total - excludedIds.length : selectedIds.length;

  const isAllSelected = users.length > 0 && selectedIds.length === users.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < users.length;

  return (

    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Total Users"
                value="21,459"
                percent="(+29%)"
                positive={true}
                subtitle="Tổng tài khoản"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Users Active"
                value="4,567"
                percent="(+18%)"
                positive={true}
                subtitle="Đang hoạt động"
                icon={<UserPlus className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title="Inactive Users"
                value="19,860"
                percent="(-14%)"
                positive={false}
                subtitle="Chờ kích hoạt"
                icon={<UserCheck className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title=" Locked Users"
                value="237"
                percent="(+42%)"
                positive={true}
                subtitle="Đã khóa"
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
                    value={filters.code}
                    onChange={(e) => handleFilterChange('code', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                    <option value="inactive">Chưa kích hoạt</option>
                    <option value="pending">Chờ duyệt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại tài khoản
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tất cả</option>
                    <option value="personnel">Nhân sự</option>
                    <option value="student">Sinh viên</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khoa/Viện
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Khoa CNTT"
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>


                {expanded && (
                  <>
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
                  </>
                )}


              </div>
              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between justify-start md:justify-end">
                <div className="flex flex-wrap items-center gap-3 ">
                  <button
                    onClick={async () => {
                      if (selectedCount === 0) {
                        toast.warning("Vui lòng chọn ít nhất 1 tài khoản để reset mật khẩu");
                        return;
                      }

                      let ids = [];
                      if (selectAllPages) {
                        try {
                          const params = { page: 1, limit: pagination.total };
                          if (filters.status) params.status = filters.status;
                          if (filters.type) params.type = filters.type;
                          if (filters.department) params.department = filters.department;
                          const res = await userService.getAdminUsers(params);
                          if (res && res.data && res.data.users) {
                            ids = (res.data.users || [])
                              .filter(u => !excludedIds.includes(u.id))
                              .map(u => u.id)
                              .filter(Boolean);
                          }
                        } catch {
                          toast.error("Không thể tải danh sách để reset mật khẩu");
                          return;
                        }
                      } else {
                        ids = selectedIds.filter(Boolean);
                      }

                      if (ids.length === 0) {
                        toast.error("Không tìm thấy ID cho các tài khoản đã chọn");
                        return;
                      }

                      // Open reset password modal
                      openResetPasswordModal(ids, true);
                    }}
                    disabled={loading}
                    className={`flex items-center gap-2 border px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ${
                      selectedCount > 0
                        ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md focus:ring-blue-500"
                        : "border-blue-400 text-blue-400 hover:bg-blue-100 hover:shadow-md focus:ring-blue-500"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={selectedCount > 0 ? `Reset mật khẩu ${selectedCount} tài khoản đã chọn` : "Chọn tài khoản để reset mật khẩu"}
                  >
                    {loading ? <LoadingSpinner size="sm" color="blue" /> : <GitPullRequest className="w-5 h-5" />}
                    {selectedCount > 0 && <span className="text-sm">({selectedCount})</span>}
                  </button>


                  <button
                    onClick={async () => {
                      if (selectedCount === 0) {
                        toast.warning("Vui lòng chọn ít nhất 1 tài khoản để khóa/mở khóa");
                        return;
                      }

                      let usernames = [];
                      if (selectAllPages) {
                        try {
                          const params = { page: 1, limit: pagination.total };
                          if (filters.status) params.status = filters.status;
                          if (filters.type) params.type = filters.type;
                          if (filters.department) params.department = filters.department;
                          const res = await userService.getAdminUsers(params);
                          if (res && res.data && res.data.users) {
                            usernames = (res.data.users || [])
                              .filter(u => !excludedIds.includes(u.id))
                              .map(u => u.user_name)
                              .filter(Boolean);
                          }
                        } catch {
                          toast.error("Không thể tải danh sách để khóa/mở khóa");
                          return;
                        }
                      } else {
                        const selectedUsers = users.filter(u => selectedIds.includes(u.id));
                        usernames = selectedUsers.map(u => u.user_name).filter(Boolean);
                      }

                      if (usernames.length === 0) {
                        toast.error("Không tìm thấy user_name cho các tài khoản đã chọn");
                        return;
                      }

                      openConfirmActionModal(
                        "lock",
                        "Xác nhận khóa/mở khóa tài khoản",
                        `Bạn có chắc chắn muốn thay đổi trạng thái ${usernames.length} tài khoản đã chọn?`,
                        "Xác nhận",
                        async () => {
                          try {
                            const response = await userService.bulkToggleUserStatus(usernames);

                            if (response.success) {
                              const { successCount, failCount } = response.data;

                              if (failCount > 0) {
                                toast.warning(
                                  `Đã cập nhật ${successCount} tài khoản thành công. ${failCount} tài khoản thất bại.`
                                );
                              } else {
                                toast.success(`Đã cập nhật ${successCount} tài khoản thành công!`);
                              }

                              setSelectedIds([]);
                              setSelectAllPages(false);
                              setExcludedIds([]);
                              fetchUsers();
                            }
                          } catch (error) {
                            console.error("Error bulk toggling status:", error);
                            toast.error(error.message || "Có lỗi xảy ra khi cập nhật trạng thái");
                          }
                        }
                      );
                    }}
                    className={`flex items-center gap-2 border px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ${
                      selectedCount > 0
                        ? "border-amber-600 bg-amber-600 text-white hover:bg-amber-700 hover:shadow-md focus:ring-amber-500"
                        : "border-amber-400 text-amber-400 hover:bg-amber-100 hover:shadow-md focus:ring-amber-500"
                    }`}
                    title={selectedCount > 0 ? `Khóa/Mở khóa ${selectedCount} tài khoản đã chọn` : "Chọn tài khoản để khóa/mở khóa"}
                  >
                    <LockKeyhole className="w-5 h-5" />
                    {selectedCount > 0 && <span className="text-sm">({selectedCount})</span>}
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

                  <button
                    onClick={handleClearFilters}
                    disabled={loading}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                    title="Xóa bộ lọc"
                  >
                    <FilterX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Select all pages banner */}
            {isAllSelected && !selectAllPages && pagination.total > users.length && (
              <div className="bg-blue-50 border-x border-b border-blue-200 px-4 py-2.5 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedIds.length}</strong> tài khoản trên trang này.{" "}
                <button
                  onClick={() => setSelectAllPages(true)}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                >
                  Chọn tất cả {pagination.total} tài khoản trong tất cả trang
                </button>
              </div>
            )}
            {selectAllPages && (
              <div className="bg-blue-100 border-x border-b border-blue-300 px-4 py-2.5 text-sm text-center text-blue-800">
                Đã chọn <strong>{selectedCount}</strong> tài khoản trong tất cả trang.{" "}
                <button
                  onClick={() => { setSelectAllPages(false); setSelectedIds([]); setExcludedIds([]); }}
                  className="text-blue-600 underline font-medium hover:text-blue-800"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
            )}

            {/* TABLE */}
            <div className="w-full overflow-x-auto bg-white shadow mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th>
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
                    <th className="h-12 px-4">MGV-MSSV</th>
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
                          onClick={fetchUsers}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Thử lại
                        </button>
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <EmptyState
                      title="Không tìm thấy tài khoản"
                      description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
                      colSpan={8}
                    />
                  ) : users.map((u) => (
                    <tr key={u.id} className={`border-t hover:bg-slate-50 ${
                      selectedIds.includes(u.id) ? 'bg-blue-50' : ''
                    }`}>
                      <td>
                        <input
                          type="checkbox"
                          className="ml-4 cursor-pointer"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => handleSelectOne(u.id)}
                        />
                      </td>
                      <td className="px-2 h-10 flex items-center gap-2 p-6">
                        {u.avatar_url ? (
                          <img 
                            src={u.avatar_url} 
                            alt={u.full_name}
                            className="w-8 h-8 rounded-full object-cover" 
                          />
                        ) : (
                          <div className={`w-8 h-8 rounded-full ${getAvatarColor(u.full_name)} flex items-center justify-center text-white text-xs font-semibold`}>
                            {getInitials(u.full_name)}
                          </div>
                        )}
                      </td>
                      <td className="px-4">{u.code}</td>
                      <td className="px-4 min-w-max">{u.full_name}</td>

                      <td className="px-4">{u.email}</td>
                      <td className="px-4">
                        {u.roles && u.roles.length > 0 
                          ? (
                            <div className="flex flex-wrap gap-1">
                              {u.roles.map((role, index) => (
                                <span 
                                  key={`${u.id}-${role}-${index}`}
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    roleColorMapping[role] || "bg-gray-100 text-gray-700 border border-gray-200"
                                  }`}
                                >
                                  {roleMapping[role] || role}
                                </span>
                              ))}
                            </div>
                          )
                          : "-"}
                      </td>

                      <td className="px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            pillStyle[u.status?.toLowerCase()] || 'bg-gray-200 text-gray-600'
                          }`}
                        >
                          {u.status === 'active' ? 'Hoạt động' : 
                           u.status === 'inactive' ? 'Tạm ngưng' : 
                           u.status === 'pending' ? 'Chờ duyệt' :
                           u.status || '-'}
                        </span>
                      </td>

                      <td className="px-4">
                        <div className="flex gap-3">
                          <button
                            title="Xem chi tiết"
                            onClick={() => openViewUserModal(u)}
                          >
                            <Eye className="text-blue-500 cursor-pointer w-5 h-5" />
                          </button>
                          <button
                            title="Reset mật khẩu"
                            onClick={() => openResetPasswordModal([u.id], false, u)}
                          >
                            <GitPullRequest className="text-amber-500 cursor-pointer w-5 h-5" />
                          </button>
                          <button
                            title={u.status === 'active' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                            onClick={() => openConfirmActionModal(
                              "lock",
                              u.status === 'active' ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản",
                              u.status === 'active' 
                                ? `Bạn có chắc chắn muốn khóa tài khoản của ${u.full_name}?`
                                : `Bạn có chắc chắn muốn mở khóa tài khoản của ${u.full_name}?`,
                              u.status === 'active' ? "Khóa tài khoản" : "Mở khóa tài khoản",
                              () => handleToggleUserStatus(u)
                            )}
                          >
                            {u.status === 'active' ? (
                              <LockKeyholeOpen className="text-green-500 cursor-pointer w-5 h-5" />
                            ) : (
                              <LockKeyhole className="text-red-500 cursor-pointer w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between px-2 mb-4">
              <span className="text-sm text-gray-500">
                Tổng: <strong>{pagination.total || 0}</strong> tài khoản
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages || 1}
                onPageChange={(page) => setCurrentPage(page)}
                disabled={loading}
              />
            </div>

            {/* MODALS */}
            <ModalUpload open={openUpload} onClose={() => setOpenUpload(false)} />
            
            <ModalEditUser
              isOpen={modalEditUser.isOpen}
              onClose={closeEditUserModal}
              userData={modalEditUser.userData}
            />

            <ModalViewUser
              isOpen={modalViewUser.isOpen}
              onClose={closeViewUserModal}
              userData={modalViewUser.userData}
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

            <ModalResetPassword
              isOpen={modalResetPassword.isOpen}
              onClose={closeResetPasswordModal}
              onConfirm={handleResetPassword}
              userIds={modalResetPassword.userIds}
              isBulk={modalResetPassword.isBulk}
              userData={modalResetPassword.userData}
            />

            <ModalExportAccountExcel
              isOpen={modalExportExcel.isOpen}
              onClose={closeExportExcelModal}
              onExport={handleExportExcel}
            />

            {/* OLD DRAWER REMOVED - Now using ModalEditUser */}
            {false && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 bg-black/50 z-[999]"
                  onClick={closeDrawer}
                />

                {/* Drawer */}
                <div className=" fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl  flex flex-col">
                  {/* ================= HEADER ================= */}
                  <div className="flex items-center justify-between px-6 py-5 border-b bg-blue-300">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Cập nhật hồ sơ tài khoản
                    </h3>

                    <button
                      onClick={closeDrawer}
                      className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-lime-300 transition-all duration-300 hover:rotate-90"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* ================= BODY (SCROLL) ================= */}
                  <div className="flex-1 overflow-y-auto px-6 py-6 pb-36 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cập nhật mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã giảng viên / Sinh viên
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ tên Giảng viên
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Khoa / Viện
                      </label>
                      <select className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500">
                        <option>Khoa Công nghệ thông tin</option>
                        <option>Khoa Điện tử - Viễn thông</option>
                        <option>Khoa Cơ khí</option>
                        <option>Khoa Kinh tế</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phân quyền tài khoản
                      </label>
                      <select className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        <option>Giảng viên</option>
                        <option>Quản trị viên</option>
                        <option>Bộ phận chấm công</option>
                      </select>
                    </div>

                    {/* Ảnh đại diện */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh đại diện
                      </label>
                      <input
                        type="file"
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    {/* thiết kế khung ảnh hiện tại */}
                    <div className="relative w-28 h-28 mx-auto">
                      <img
                        src={"https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png"}
                        className="w-full rounded-lg border border-blue-300 px-4 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-sky-500 p-2 rounded-full text-white shadow hover:bg-sky-600 cursor-pointer"
                      >
                        <Camera size={16} />
                      </label>
                    </div>

                  </div>

                  {/* ================= FOOTER ================= */}
                  <div className=" sticky bottom-0 flex justify-end gap-4 px-6 py-4 border-t bg-white/90 backdrop-blur">
                    <button
                      onClick={closeDrawer}
                      className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                    >
                      Hủy
                    </button>

                    <button
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md"
                    >
                      Lưu thay đổi
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

export default AdminAccountPage;
