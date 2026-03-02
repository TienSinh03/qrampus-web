import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import ModalAddStudent from "../../../components/modal/ModalAddStudent";
import ModalEditStudent from "../../../components/modal/ModalEditStudent";
import ModalViewStudent from "../../../components/modal/ModalViewStudent";
import ModalConfirmAction from "../../../components/modal/ModalConfirmAction";
import studentService from "../../../services/student.service";
import userService from "../../../services/user.service";
import { toast } from "sonner";
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
  ArrowDown, ArrowUp, FileSpreadsheet, FilterX, FileSearchIcon
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
import { DEPARTMENTS } from "../../../constants/departments";
import EmptyState from "@components/layout/EmptyState";
const AdminStudentPage = () => {
  const { t } = useTranslation();

  // API Data states
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    studentCode: "",
    fullName: "",
    department: "",
    status: "",
    email: "",
    phone: "",
    dob: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  // const [checked, setChecked] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal states
  const [modalAddStudent, setModalAddStudent] = useState(false);
  const [modalEditStudent, setModalEditStudent] = useState({ isOpen: false, studentData: null });
  const [modalViewStudent, setModalViewStudent] = useState({ isOpen: false, studentData: null });
  const [modalConfirmAction, setModalConfirmAction] = useState({
    isOpen: false,
    actionType: null,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: null,
  });

  // Modal handlers
  const openAddStudentModal = () => setModalAddStudent(true);
  const closeAddStudentModal = () => setModalAddStudent(false);

  const openEditStudentModal = async (student) => {
    try {
      const response = await studentService.getStudentByCode(student.student_code);
      const fullData = response.success && response.data ? response.data : student;
      setModalEditStudent({ isOpen: true, studentData: fullData });
    } catch (err) {
      toast.error(err.message || "Không thể tải thông tin sinh viên");
      setModalEditStudent({ isOpen: true, studentData: student });
    }
  };
  const closeEditStudentModal = () => setModalEditStudent({ isOpen: false, studentData: null });

  const openViewStudentModal = async (student) => {
    try {
      const response = await studentService.getStudentByCode(student.student_code);
      const fullData = response.success && response.data ? response.data : student;
      setModalViewStudent({ isOpen: true, studentData: fullData });
    } catch (err) {
      toast.error(err.message || "Không thể tải thông tin sinh viên");
      setModalViewStudent({ isOpen: true, studentData: student });
    }
  };
  const closeViewStudentModal = () => setModalViewStudent({ isOpen: false, studentData: null });

  const openConfirmActionModal = (actionType, title, message, confirmText, onConfirm) => {
    setModalConfirmAction({ isOpen: true, actionType, title, message, confirmText, onConfirm });
  };
  const closeConfirmActionModal = () => setModalConfirmAction({ ...modalConfirmAction, isOpen: false });

  const handleAddStudent = async (formData) => {
    try {
      await studentService.createStudent(formData);
      toast.success("Tạo hồ sơ sinh viên thành công!");
      fetchStudents();
    } catch (err) {
      toast.error(err.message || "Không thể tạo sinh viên");
    }
  };

  const handleEditStudent = async (formData) => {
    try {
      const { student_code, status, avatar, ...rest } = formData;
      await studentService.updateStudentByAdmin(student_code, rest);
      toast.success("Đã cập nhật thông tin sinh viên thành công!");
      fetchStudents();
    } catch (err) {
      toast.error(err.message || "Không thể cập nhật sinh viên");
    }
  };

  // Toggle user status (active/deactivate)
  const handleToggleStudentStatus = async (student) => {
    try {
      console.log("Toggling user status for:", student.user?.user_name);

      const response = await userService.toggleUserStatus(student.user?.user_name);

      if (response.success) {
        const newStatus = response.data.status;
        const statusText = newStatus === 'active' ? 'kích hoạt' : 'tạm ngưng';
        toast.success(`Đã ${statusText} tài khoản thành công!`);
        fetchStudents();
      } else {
        toast.error(response.message || "Không thể cập nhật trạng thái tài khoản");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      toast.error(error.message || "Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại!");
    }
  };

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: pagination.limit || 10,
      };

      if (filters.search) params.search = filters.search;
      if (filters.studentCode) params.search = filters.studentCode;
      if (filters.fullName) params.search = filters.fullName;
      if (filters.department) params.major = filters.department;
      if (filters.status) params.status = filters.status;
      if (filters.email) params.email = filters.email;
      if (filters.phone) params.phone = filters.phone;
      if (filters.dob) params.dob = filters.dob;

      const response = await studentService.getAllStudents(params);

      // Controller trả về: { success, message, data: [...students], meta: { total, page, limit, totalPages } }
      if (response.success && response.data) {
        setStudents(Array.isArray(response.data) ? response.data : []);
        setPagination(response.meta || { total: 0, page: 1, limit: 10, totalPages: 0 });
      }
    } catch (err) {
      console.error("Error fetching students:", err);
      toast.error(err.message || "Không thể tải danh sách sinh viên");
    } finally {
      setLoading(false);
    }
  };

  // Fetch khi trang thay đổi
  useEffect(() => {
    fetchStudents();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle filter
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStudents();
  };

  const handleClearFilters = () => {
    setFilters({ search: "", studentCode: "", fullName: "", department: "", status: "", email: "", phone: "", dob: "" });
    setCurrentPage(1);
    setTimeout(() => fetchStudents(), 100);
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

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const avatarColors = [
    "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-rose-500",
    "bg-amber-500", "bg-cyan-500", "bg-teal-500", "bg-indigo-500",
  ];
  const getAvatarColor = (name) => {
    if (!name) return "bg-gray-400";
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  const pillStyle = {
    active: "bg-green-100 text-green-600",
    inactive: "bg-gray-200 text-gray-600",
    pending: "bg-yellow-100 text-yellow-600",
  };

  const statusLabel = {
    active: "Hoạt động",
    inactive: "Tạm ngưng",
    pending: "Chờ duyệt",
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(students.map(item => item.id));
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

  const isAllSelected = students.length > 0 && selectedIds.length === students.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < students.length;

  const [expanded, setExpanded] = useState(false);

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
                    Mã số sinh viên
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    value={filters.studentCode}
                    onChange={(e) => handleFilterChange("studentCode", e.target.value)}
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
                    onChange={(e) => handleFilterChange("fullName", e.target.value)}
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khoa/Viện
                  </label>
                  <select
                    value={filters.department}
                    onChange={(e) => handleFilterChange("department", e.target.value)}
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
                    onChange={(e) => handleFilterChange("status", e.target.value)}
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
                        onChange={(e) => handleFilterChange("email", e.target.value)}
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
                        onChange={(e) => handleFilterChange("phone", e.target.value)}
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
                        onChange={(e) => handleFilterChange("dob", e.target.value)}
                        className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}


              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between justify-start md:justify-end">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={openAddStudentModal}
                    className="flex items-center gap-2 border border-emerald-500 text-emerald-500 px-5 
                    py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md 
                    focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                    title="Thêm sinh viên thủ công"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </button>

                  <button
                    onClick={async () => {
                      if (selectedIds.length === 0) {
                        toast.warning("Vui lòng chọn ít nhất 1 sinh viên để khóa/mở khóa");
                        return;
                      }

                      const selectedStudents = students.filter(s => selectedIds.includes(s.id));
                      const usernames = selectedStudents.map(s => s.user?.user_name).filter(Boolean);

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
                                toast.warning(`Đã cập nhật ${successCount} tài khoản thành công. ${failCount} tài khoản thất bại.`);
                              } else {
                                toast.success(`Đã cập nhật ${successCount} tài khoản thành công!`);
                              }
                              setSelectedIds([]);
                              fetchStudents();
                            }
                          } catch (error) {
                            console.error("Error bulk toggling status:", error);
                            toast.error(error.message || "Có lỗi xảy ra khi cập nhật trạng thái");
                          }
                        }
                      );
                    }}
                    className={`flex items-center gap-2 border px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ${
                      selectedIds.length > 0
                        ? "border-amber-600 bg-amber-600 text-white hover:bg-amber-700 hover:shadow-md focus:ring-amber-500"
                        : "border-amber-400 text-amber-400 hover:bg-amber-100 hover:shadow-md focus:ring-amber-500"
                    }`}
                    title={selectedIds.length > 0 ? `Khóa/Mở khóa ${selectedIds.length} mục đã chọn` : "Chọn sinh viên để khóa/mở khóa"}
                  >
                    <LockKeyhole className="w-5 h-5" />
                    {selectedIds.length > 0 && <span className="text-sm">({selectedIds.length})</span>}
                  </button>

                  <button
                    onClick={() => setOpenUpload(true)}
                    className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                    title="Upload danh sách sinh viên, vui lòng tải mẫu excel bên dưới"
                  >
                    <CloudUpload className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleSearch}
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
                    onClick={() => {
                      if (selectedIds.length === 0) return;
                      console.log("Export selected:", selectedIds);
                      toast.success(`Đã xuất ${selectedIds.length} sinh viên thành công`);
                    }}
                    className={`flex items-center gap-2 border px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ${
                      selectedIds.length > 0
                        ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md focus:ring-emerald-500"
                        : "border-emerald-400 text-emerald-400 hover:bg-emerald-100 hover:shadow-md focus:ring-emerald-500"
                    }`}
                    title={selectedIds.length > 0 ? `Xuất ${selectedIds.length} mục đã chọn` : "Chọn sinh viên để xuất excel"}
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    {selectedIds.length > 0 && <span className="text-sm">({selectedIds.length})</span>}
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


                {/* Nhóm buttons phụ bên phải: Lọc, Export, Xóa lọc */}
                <div className="flex flex-wrap items-center gap-3">

                </div>
              </div>
            </div>


            {/* TABLE */}
            <div className="w-full overflow-x-auto bg-white shadow mb-6">
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
                    <th className="h-12 px-4">MSSV</th>
                    <th className="h-12 px-4">{t("users.name")}</th>
                    <th className="h-12 px-4">{t("users.email")}</th>
                    <th className="h-12 px-4">Lớp học</th>
                    <th className="h-12 px-4">{t("users.status")}</th>
                    <th className="h-12 px-4">{t("users.actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-10">
                        <div className="flex justify-center items-center gap-3">
                          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-emerald-600"></div>
                          <span className="text-gray-500">Đang tải dữ liệu...</span>
                        </div>
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <EmptyState
                      title="Không tìm thấy sinh viên"
                      description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
                      colSpan={8}
                    />
                  ) : (
                  students.map((u) => (
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
                            className="w-8 h-8 rounded-full object-cover"
                            alt={u.full_name}
                          />
                        ) : (
                          <div className={`w-8 h-8 rounded-full ${getAvatarColor(u.full_name)} flex items-center justify-center text-white text-xs font-semibold`}>
                            {getInitials(u.full_name)}
                          </div>
                        )}
                      </td>
                      <td className="px-4">{u.student_code}</td>
                      <td className="px-4 min-w-max">{u.full_name}</td>

                      <td className="px-4">{u.email}</td>
                      <td className="px-4">{u.class_name  || '-'}</td>

                      <td className="px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${pillStyle[u.user?.status] || pillStyle['inactive']}`}
                        >
                          {statusLabel[u.user?.status] || 'Tạm ngưng'}
                        </span>
                      </td>

                      <td className="px-4">
                        <div className="flex gap-3">
                          <button
                            title="Xem chi tiết"
                            onClick={() => openViewStudentModal(u)}
                          >
                            <Eye className="text-blue-500 cursor-pointer w-5 h-5" />
                          </button>
                          <button
                            title="Chỉnh sửa"
                            onClick={() => openEditStudentModal(u)}
                          >
                            <PencilLine className="text-amber-500 cursor-pointer w-5 h-5" />
                          </button>
                          <button
                            title={u.user?.status === 'active' ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                            onClick={() => openConfirmActionModal(
                              "lock",
                              u.user?.status === 'active' ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa tài khoản",
                              u.user?.status === 'active'
                                ? `Bạn có chắc chắn muốn khóa tài khoản của ${u.full_name}?`
                                : `Bạn có chắc chắn muốn mở khóa tài khoản của ${u.full_name}?`,
                              u.user?.status === 'active' ? "Khóa tài khoản" : "Mở khóa tài khoản",
                              () => handleToggleStudentStatus(u)
                            )}
                          >
                            {u.user?.status === 'active' ? (
                              <LockKeyholeOpen className="text-green-500 cursor-pointer w-5 h-5" />
                            ) : (
                              <LockKeyhole className="text-red-500 cursor-pointer w-5 h-5" />
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
                Tổng: <strong>{pagination.total || 0}</strong> sinh viên
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
            
            <ModalAddStudent
              isOpen={modalAddStudent}
              onClose={closeAddStudentModal}
              onSubmit={handleAddStudent}
            />

            <ModalEditStudent
              isOpen={modalEditStudent.isOpen}
              onClose={closeEditStudentModal}
              studentData={modalEditStudent.studentData}
              onSubmit={handleEditStudent}
            />

            <ModalViewStudent
              isOpen={modalViewStudent.isOpen}
              onClose={closeViewStudentModal}
              studentData={modalViewStudent.studentData}
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

            {/* OLD DRAWER REMOVED */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentPage;
