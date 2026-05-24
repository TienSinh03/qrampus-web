import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/common/Pagination";
import ModalExportExcel from "../../../components/modal/ModalExportExcel";
import personnelService from "../../../services/personnel.service";
import reportService from "../../../services/report.service";
import LoadingSpinner from "@components/layout/LoadingSpinner";
import EmptyState from "@components/layout/EmptyState";
import { toast } from "sonner";
import { DEPARTMENTS } from "../../../constants/departments";
import { exportPersonnelToExcel } from "../../../utils/excelExport";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  ArrowDown,
  ArrowUp,
  FileSpreadsheet,
  FileSearchIcon,
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
const AttendanceTeacherPage = () => {
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
  const [cardLoading, setCardLoading] = useState(false);
  const [cardStats, setCardStats] = useState({
    teachers: {
      total: 0,
      this_month: 0,
      growth: 0,
      active: 0,
      active_rate: 0,
    },
  });

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
  const [expanded, setExpanded] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [modalExportExcel, setModalExportExcel] = useState({ isOpen: false, data: [] });

  const openExportExcelModal = async () => {
    if (pagination.total === 0) {
      toast.warning("Không có dữ liệu để xuất Excel");
      return;
    }

    if (selectedRows.length > 0) {
      const selectedData = personnels.filter((personnel) => selectedRows.includes(personnel.id));
      if (selectedData.length > 0) {
        setModalExportExcel({ isOpen: true, data: selectedData });
        return;
      }
    }

    try {
      const params = {
        page: 1,
        limit: pagination.total,
      };

      if (filters.search) params.search = filters.search;
      if (filters.teacherCode) params.search = filters.teacherCode;
      if (filters.fullName) params.search = filters.fullName;
      if (filters.department) params.department = filters.department;
      if (filters.status) params.status = filters.status;
      if (filters.email) params.email = filters.email;
      if (filters.phone) params.phone = filters.phone;
      if (filters.dob) params.dob = filters.dob;
      if (filters.role) params.role = filters.role;

      const response = await personnelService.getAllTeachers(params);
      if (response.success && response.data) {
        const allPersonnels = response.data.teachers || response.data.personnels || [];
        setModalExportExcel({ isOpen: true, data: allPersonnels });
      }
    } catch {
      toast.error("Không thể tải danh sách giảng viên để xuất.");
    }
  };

  const closeExportExcelModal = () => setModalExportExcel({ isOpen: false, data: [] });

  const handleExportExcel = ({ selectedColumns, filename }) => {
    try {
      exportPersonnelToExcel(modalExportExcel.data, filename, selectedColumns);
      toast.success(`Đã xuất ${modalExportExcel.data.length} giảng viên ra file Excel thành công`);
      closeExportExcelModal();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Không thể xuất file Excel. Vui lòng thử lại!");
    }
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

      const response = await personnelService.getAllTeachers(params);
      
      if (response.success && response.data) {
        setPersonnels(response.data.teachers || response.data.personnels || []);
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

  const fetchCardPersonnel = async () => {
    try {
      setCardLoading(true);
      const response = await reportService.getCardpersonnel();
      if (response?.data?.teachers) {
        setCardStats({
          teachers: {
            total: Number(response.data.teachers.total) || 0,
            this_month: Number(response.data.teachers.this_month) || 0,
            growth: Number(response.data.teachers.growth) || 0,
            active: Number(response.data.teachers.active) || 0,
            active_rate: Number(response.data.teachers.active_rate) || 0,
          },
        });
      }
    } catch (err) {
      console.error("Error fetching card personnel stats:", err);
      toast.error(err.message || "Không thể tải thống kê giảng viên");
    } finally {
      setCardLoading(false);
    }
  };

  // Fetch data on mount and when filters/currentPage change
  useEffect(() => {
    fetchPersonnels();
  }, [currentPage]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setSelectedRows([]);
  }, [personnels]);

  useEffect(() => {
    fetchCardPersonnel();
  }, []);


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

  const toggleSelectAll = () => {
    if (personnels.length === 0) return;
    if (selectedRows.length === personnels.length) {
      setSelectedRows([]);
      return;
    }
    setSelectedRows(personnels.map((item) => item.id));
  };

  const toggleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((item) => item !== id));
      return;
    }
    setSelectedRows([...selectedRows, id]);
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

  // Role color mapping
  const roleColorMapping = {
    teacher: "bg-blue-100 text-blue-700 border border-blue-200",
    admin: "bg-red-100 text-red-700 border border-red-200",
    attendance_staff: "bg-green-100 text-green-700 border border-green-200"
  };

  const inactiveTeachers = Math.max(cardStats.teachers.total - cardStats.teachers.active, 0);
  const inactiveRate = Math.max(100 - cardStats.teachers.active_rate, 0);
  const formatNumber = (value) => new Intl.NumberFormat('vi-VN').format(value || 0);
  const formatPercent = (value) => `${value >= 0 ? '+' : ''}${Number(value || 0).toFixed(1)}%`;
  const isAllSelected = personnels.length > 0 && selectedRows.length === personnels.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < personnels.length;

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
                title="Tổng giảng viên"
                value={cardLoading ? '...' : formatNumber(cardStats.teachers.total)}
                percent={cardLoading ? '...' : `(${formatPercent(cardStats.teachers.growth)})`}
                positive={cardStats.teachers.growth >= 0}
                subtitle="Toàn hệ thống"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Giảng viên mới"
                value={cardLoading ? '...' : formatNumber(cardStats.teachers.this_month)}
                percent={cardLoading ? '...' : `(${formatPercent(cardStats.teachers.growth)})`}
                positive={cardStats.teachers.growth >= 0}
                subtitle="Trong tháng này"
                icon={<UserPlus className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Giảng viên hoạt động"
                value={cardLoading ? '...' : formatNumber(cardStats.teachers.active)}
                percent={cardLoading ? '...' : `(${formatPercent(cardStats.teachers.active_rate)})`}
                positive={cardStats.teachers.active_rate >= 50}
                subtitle="Tỷ lệ active"
                icon={<UserCheck className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title="Giảng viên chưa active"
                value={cardLoading ? '...' : formatNumber(inactiveTeachers)}
                percent={cardLoading ? '...' : `(${formatPercent(inactiveRate)})`}
                positive={false}
                subtitle="Tỷ lệ chưa active"
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
                    onClick={handleSearch}
                    disabled={loading}
                    className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                    title="Tìm kiếm"
                  >
                    {loading ? <LoadingSpinner size="sm" color="blue" /> : <FileSearchIcon className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={openExportExcelModal}
                    disabled={pagination.total === 0 || loading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 transition-all duration-200 ${
                      pagination.total > 0 && !loading
                        ? 'border border-emerald-400 text-emerald-400 hover:bg-emerald-100 hover:shadow-md focus:ring-emerald-500'
                        : 'border border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                    title={
                      selectedRows.length > 0
                        ? `Xuất ${selectedRows.length} giảng viên đã chọn`
                        : pagination.total > 0
                          ? `Xuất ${pagination.total} giảng viên theo bộ lọc`
                          : "Xuất danh sách excel"
                    }
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    {(selectedRows.length > 0 || pagination.total > 0) && (
                      <span className="ml-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {selectedRows.length > 0 ? selectedRows.length : pagination.total}
                      </span>
                    )}
                  </button>
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
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="h-12 px-4">Ảnh</th>
                    <th className="h-12 px-4">Mã nhân sự</th>
                    <th className="h-12 px-4">{t("users.name")}</th>
                    <th className="h-12 px-4">{t("users.email")}</th>
                    <th className="h-12 px-4">{t("users.role")}</th>
                    <th className="h-12 px-4">{t("users.status")}</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <LoadingSpinner size="lg" color="blue" text="Đang tải dữ liệu..." />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
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
                    <EmptyState
                      title="Không tìm thấy nhân sự"
                      description="Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
                      colSpan={7}
                    />
                  ) : personnels.map((personnel) => (
                    <tr
                      key={personnel.id}
                      className={`border-t hover:bg-slate-50 ${selectedRows.includes(personnel.id) ? "bg-blue-50" : ""}`}
                    >
                      <td>
                        <input
                          type="checkbox"
                          className="ml-4 cursor-pointer"
                          checked={selectedRows.includes(personnel.id)}
                          onChange={() => toggleSelectRow(personnel.id)}
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
                        {personnel.user?.roles && personnel.user.roles.length > 0 
                          ? (
                            <div className="flex flex-wrap gap-1">
                              {personnel.user.roles.map((role, index) => (
                                <span 
                                  key={`${personnel.id}-${role.id || role.name || index}`}
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    roleColorMapping[role.name] || "bg-gray-100 text-gray-700 border border-gray-200"
                                  }`}
                                >
                                  {roleMapping[role.name] || role.name}
                                </span>
                              ))}
                            </div>
                          )
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            {/* PAGINATION */}
            <div className="flex items-center justify-between px-2 mb-4">
              <span className="text-sm text-gray-500">
                Tổng: <strong>{pagination.total || 0}</strong> giảng viên
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages || 1}
                onPageChange={(page) => setCurrentPage(page)}
                disabled={loading}
              />
            </div>

            <ModalExportExcel
              isOpen={modalExportExcel.isOpen}
              onClose={closeExportExcelModal}
              personnels={modalExportExcel.data}
              onExport={handleExportExcel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTeacherPage;
