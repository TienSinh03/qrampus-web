import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import Pagination from "../../../components/common/Pagination";
import ModalUpload from "../../../components/common/ModalUpload";
import {
  Trash2, Users,
  QrCode, MessageSquareText, SquareCheckBig, CopyX,
  FileSpreadsheet, FilterX, ArrowUp, ArrowDown
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
import { useNavigate } from "react-router-dom";
import { usePersonnelProfile } from "../../../contexts/PersonnelProfileContext";
import { DEPARTMENTS } from "../../../constants/departments";

const ITEMS_PER_PAGE = 10;

const pillStyle = {
  active: "bg-green-100 text-green-600",
  inactive: "bg-gray-200 text-gray-600",
  pending: "bg-yellow-100 text-yellow-600",
};

const SkeletonRow = () => (
  <tr className="border-b animate-pulse">
    <td className="px-4 py-3">
      <div className="h-4 w-24 bg-slate-200 rounded" />
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
        <div className="h-4 w-36 bg-slate-200 rounded" />
      </div>
    </td>
    <td className="px-4 py-3 hidden lg:table-cell">
      <div className="h-4 w-40 bg-slate-200 rounded" />
    </td>
    <td className="px-4 py-3 text-center">
      <div className="h-6 w-20 bg-slate-200 rounded-full mx-auto" />
    </td>
  </tr>
);

const AdminQRPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { teachers, teachersPagination, fetchTeachers, teachersLoading } = usePersonnelProfile();

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);

  const [filters, setFilters] = useState({
    teacherCode: "",
    fullName: "",
    department: "",
    status: "",
    period: "",
    date: "",
  });

  useEffect(() => {
    fetchTeachers({ page: currentPage, limit: ITEMS_PER_PAGE });
  }, [fetchTeachers, currentPage]);

  const filteredTeachers = useMemo(() => {
    return (teachers ?? []).filter((gv) => {
      const code = (gv.teacher_code ?? "").toLowerCase();
      const name = (gv.full_name ?? "").toLowerCase();
      const dept = (gv.department ?? "").toLowerCase();
      const status = (gv.user?.status ?? "").toLowerCase();

      if (
        filters.teacherCode &&
        !code.includes(filters.teacherCode.toLowerCase())
      )
        return false;

      if (
        filters.fullName &&
        !name.includes(filters.fullName.toLowerCase())
      )
        return false;

      if (
        filters.department &&
        !dept.includes(filters.department.toLowerCase())
      )
        return false;

      if (filters.status && status !== filters.status) return false;

      return true;
    });
  }, [teachers, filters]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      teacherCode: "",
      fullName: "",
      department: "",
      status: "",
      period: "",
      date: "",
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Tổng phiên điểm danh"
                value="310"
                percent="(+18%)"
                positive={true}
                subtitle="Hôm nay"
                icon={<QrCode className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Phiên hiện tại"
                value="21,459"
                percent="(+29%)"
                positive={true}
                subtitle="Học phần"
                icon={<MessageSquareText className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />


              <StatsCard
                title="Phiên thành công"
                value="19,860"
                percent="(-14%)"
                positive={false}
                subtitle="Thầy/Cô đã tạo"
                icon={<SquareCheckBig className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title="Phiên chưa tạo"
                value="237"
                percent="(+42%)"
                positive={true}
                subtitle="Last week analytics"
                icon={<CopyX className="w-6 h-6 text-yellow-600" />}
                iconBg="bg-yellow-100"
              />

            </div>

          <div className="bg-white border p-6 mb-0">
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

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã số nhân sự
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 4203001549"
                  value={filters.teacherCode}
                  onChange={(e) =>
                    handleFilterChange("teacherCode", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên..."
                  value={filters.fullName}
                  onChange={(e) =>
                    handleFilterChange("fullName", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khoa/Viện
                </label>
                <select
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn khoa --</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
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
                  onChange={(e) =>
                    handleFilterChange("status", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3" />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className="flex items-center gap-2 border border-emerald-400 text-emerald-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                  title="Tải file excel"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                </button>

                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
                  title="Xóa bộ lọc"
                >
                  <FilterX className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto rounded-b-xl border border-slate-200 bg-white shadow">
            <table className="w-full table-auto border-collapse text-left text-sm whitespace-nowrap">
              <thead className="sticky top-0 z-10 bg-slate-100">
                <tr className="border-b">
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                    Mã nhân sự
                  </th>
                  <th className="h-12 px-4 min-w-[220px] text-xs font-semibold text-slate-600 uppercase">
                    Giảng viên
                  </th>
                  <th className="h-12 px-4 min-w-[160px] text-xs font-semibold text-slate-600 uppercase hidden lg:table-cell">
                    Khoa
                  </th>
                  <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">
                    Trạng thái học phần
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Loading skeleton */}
                {teachersLoading &&
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}

                {/* Data rows */}
                {!teachersLoading &&
                  filteredTeachers.map((gv) => (
                    <tr
                      key={gv.teacher_code}
                      onClick={() =>
                        navigate(
                          `/dashboard/admin/qrcode/session/qrcode-detail/${gv.id}`, { state: { teacher: gv } }
                        )
                      }
                      className="border-b hover:bg-slate-50 transition-colors cursor-pointer h-12"
                    >
                      <td className="px-4 py-2 font-medium text-slate-700">
                        {gv.teacher_code}
                      </td>

                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3 max-w-[240px]">
                          {gv.avatar_url ? (
                            <img
                              src={gv.avatar_url}
                              alt={gv.full_name}
                              className="w-9 h-9 rounded-full object-cover border shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full border shrink-0 bg-[#153898] text-white flex items-center justify-center font-semibold uppercase">
                              {gv.full_name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                          )}
                          <div className="truncate" title={gv.full_name}>
                            <div className="font-medium text-slate-800 truncate">
                              {gv.full_name}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        className="px-4 py-2 text-slate-700 hidden lg:table-cell truncate max-w-[180px]"
                        title={gv.department}
                      >
                        {gv.department}
                      </td>

                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            pillStyle[gv.user?.status?.toLowerCase()] ||
                            "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {gv.user?.status === "active"
                            ? "Hoạt động"
                            : gv.user?.status === "inactive"
                            ? "Tạm ngưng"
                            : gv.user?.status || "-"}
                        </span>
                      </td>
                    </tr>
                  ))}

                {/* Empty state */}
                {!teachersLoading && filteredTeachers.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-slate-400 text-sm"
                    >
                      Không tìm thấy kết quả phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-2 mb-4 mt-3">
            <span className="text-sm text-gray-500">
              Hiển thị{" "}
              <strong>{filteredTeachers.length}</strong>
              {" "}/{" "}
              <strong>{teachersPagination.total || 0}</strong> giảng viên
            </span>
            <Pagination
              currentPage={currentPage}
              totalPages={teachersPagination.totalPages || 1}
              onPageChange={handlePageChange}
              disabled={teachersLoading}
            />
          </div>

          <ModalUpload
            open={openUpload}
            onClose={() => setOpenUpload(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminQRPage;