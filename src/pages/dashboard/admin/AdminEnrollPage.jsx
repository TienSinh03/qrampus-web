import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import ModalAddEnroll from "../../../components/modal/ModalAddEnroll";
import ModalEditEnroll from "../../../components/modal/ModalEditEnroll";
import ModalViewEnroll from "../../../components/modal/ModalViewEnroll";
import ModalConfirmAction from "../../../components/modal/ModalConfirmAction";
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
  File, Settings
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
const AdminEnrollPage = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal states
  const [modalAddEnroll, setModalAddEnroll] = useState({ isOpen: false });
  const [modalEditEnroll, setModalEditEnroll] = useState({ isOpen: false, enrollData: null });
  const [modalViewEnroll, setModalViewEnroll] = useState({ isOpen: false, enrollData: null });
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
  const openAddEnrollModal = () => setModalAddEnroll({ isOpen: true });
  const closeAddEnrollModal = () => setModalAddEnroll({ isOpen: false });

  const openEditEnrollModal = (enroll) => setModalEditEnroll({ isOpen: true, enrollData: enroll });
  const closeEditEnrollModal = () => setModalEditEnroll({ isOpen: false, enrollData: null });

  const openViewEnrollModal = (enroll) => setModalViewEnroll({ isOpen: true, enrollData: enroll });
  const closeViewEnrollModal = () => setModalViewEnroll({ isOpen: false, enrollData: null });

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".relative")) {
        setOpenMenu(null);
      }
    };

    if (openMenu !== null) {
      document.addEventListener("click", handleClick);
    }

    return () => document.removeEventListener("click", handleClick);
  }, [openMenu]);

  const totalPages = 5;




  const DANH_SACH_DANG_KY = [
    {
      id: 1,
      maSinhVien: "21010611",
      hoTen: "Nguyễn Văn A",
      maHocPhan: "421234567890",
      monHoc: "Cấu trúc dữ liệu và Giải thuật",
      ky: 1,
      namHoc: "2024-2025",
      khoa: "Công nghệ thông tin",
      nhomThucHanh: "Nhóm 03",
      hinhThucHoc: "Lý thuyết",
      ngayDangKy: "15/08/2024",
      lichHoc: "Thứ 2 8:00 - 10:00",
      trangThai: "Thành công"
    },
    {
      id: 2,
      maSinhVien: "21010612",
      hoTen: "Trần Thị B",
      maHocPhan: "421234567891",
      monHoc: "Toán cao cấp A1",
      ky: 1,
      namHoc: "2024-2025",
      khoa: "Khoa học cơ bản",
      nhomThucHanh: "Không có",
      hinhThucHoc: "Kết hợp",
      ngayDangKy: "16/08/2024",
      lichHoc: "Thứ 2 8:00 - 10:00, Thứ 4 13:00 - 15:00",
      trangThai: "Chờ duyệt"
    },
    {
      id: 3,
      maSinhVien: "21010613",
      hoTen: "Lê Hoàng C",
      maHocPhan: "421234567892",
      monHoc: "Tiếng Anh chuyên ngành",
      ky: 2,
      namHoc: "2023-2024",
      khoa: "Ngoại ngữ",
      nhomThucHanh: "Nhóm 01",
      hinhThucHoc: "Thực hành",
      ngayDangKy: "10/01/2024",      
      lichHoc: "Thứ 2 8:00 - 10:00, Thứ 4 13:00 - 15:00",

      trangThai: "Đã hủy"
    }
  ];

  const pillStyle = {
    "Thành công": "bg-green-100 text-green-600",
    "Chờ duyệt": "bg-yellow-100 text-yellow-600",
    "Đã hủy": "bg-gray-200 text-gray-600",
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(DANH_SACH_DANG_KY.map(item => item.id));
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

  const isAllSelected = DANH_SACH_DANG_KY.length > 0 && selectedIds.length === DANH_SACH_DANG_KY.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < DANH_SACH_DANG_KY.length;

  // CỘT, BẢNG
  // cột , bảng
  const [visibleCols, setVisibleCols] = useState({
    maSinhVien: true,
    hoTen: true,
    maHocPhan: true,
    monHoc: true,
    ky: true,
    namHoc: true,
    khoa: true,
    nhomThucHanh: true,
    hinhThucHoc: true,
    ngayDangKy: true,
    trangThai: true,

  });


  return (

    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          {/* Header */}
          <div className="h-1 bg-[#153898] mb-6" />
          <div className="">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatsCard
                title="Tổng số"
                value="21,459"
                percent="(+29%)"
                positive={true}
                subtitle="sinh viên đã tham gia"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Tổng số"
                value="4,567"
                percent="(+18%)"
                positive={true}
                subtitle="học phần"
                icon={<UserPlus className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Tổng số lịch"
                value="19,860"
                percent="(-14%)"
                positive={false}
                subtitle="Sinh viên hôm nay "
                icon={<UserCheck className="w-6 h-6 text-green-600" />}
                iconBg="bg-green-100"
              />

              <StatsCard
                title=".........."
                value="237"
                percent="(+42%)"
                positive={true}
                subtitle="..............."
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
                    Kỳ học
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Kỳ 1</option>
                    <option>Kỳ 2</option>
                    <option>Kỳ 3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Năm học
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: ...."
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã sinh viên
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                        Trạng thái
                      </label>
                      <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Đang hoạt động</option>
                        <option>Tạm ngưng</option>
                        <option>Đã xóa</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên Sinh viên
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã học phần
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên học phần
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày đăng ký
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
              <div className="mt-6 flex flex-wrap items-center justify-between justify-start md:justify-end">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={openAddEnrollModal}
                    className="flex items-center gap-2  border border-emerald-500 text-emerald-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                    title="Thêm sinh viên vào học phần"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </button>

                  <button
                    className="flex items-center gap-2 border border-rose-400 text-rose-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-rose-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:ring-offset-1 transition-all duration-200"
                    title="Xóa sinh viên đã chọn, chuyển đổi trạng thái"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setOpenUpload(true)}
                    className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                    title="Upload danh sách sinh viên, vui lòng tải mẫu excel bên dưới"
                  >
                    <CloudUpload className="w-5 h-5" />
                  </button>

                  <button
                    className="flex items-center gap-2 border border-blue-300 text-blue-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:border-blue-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1 transition-all duration-200" title="Tìm kiếm"
                  >
                    <FileSearchIcon className="w-5 h-5" />
                  </button>

                  <button
                    className="flex items-center gap-2 border border-emerald-400 text-emerald-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                    title="Xuất danh sách excel"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                  </button>

                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200" title="Tải file mẫu excel">
                    <File className="w-5 h-5" />
                  </button>
                  <button
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
                    title="Xóa bộ lọc, truy vấn bộ lọc khác"
                  >
                    <FilterX className="w-5 h-5" />
                  </button>
                  <details className="relative">
                    <summary className="list-none flex items-center gap-2 border border-sky-300 text-sky-700 bg-sky px-5 py-2.5 rounded-lg font-medium cursor-pointer hover:bg-sky-50 hover:border-sky-400 hover:text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 transition-all duration-200">
                      <Settings className="w-5 h-5" />
                    </summary>

                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-20 text-sm">
                      {[
                        ["maSinhVien", "Mã sinh viên"],
                        ["hoTen", "Họ tên"],
                        ["maHocPhan", "Mã học phần"],
                        ["monHoc", "Môn học"],
                        ["ky", "Kỳ"],
                        ["namHoc", "Năm học"],
                        ["khoa", "Khoa"],
                        ["nhomThucHanh", "Nhóm thực hành"],
                        ["hinhThucHoc", "Hình thức học"],
                        ["ngayDangKy", "Ngày đăng ký"],
                        ['lichHoc', 'Lịch học'],
                        ["trangThai", "Trạng thái"],


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
                        "Xác nhận xóa nhiều sinh viên",
                        `Bạn có chắc chắn muốn xóa ${selectedIds.length} sinh viên đã chọn? Hành động này không thể hoàn tác.`,
                        "Xóa tất cả",
                        () => {
                          console.log("Delete selected:", selectedIds);
                          toast.success(`Đã xóa ${selectedIds.length} sinh viên thành công`);
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
                    {visibleCols.maSinhVien && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Mã sinh viên
                      </th>
                    )}
                    {visibleCols.hoTen && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Họ tên
                      </th>
                    )}

                    {visibleCols.maHocPhan && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Mã học phần
                      </th>
                    )}

                    {visibleCols.monHoc && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Môn học
                      </th>
                    )}
                    {visibleCols.ky && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Kỳ
                      </th>
                    )}
                    {visibleCols.namHoc && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Năm học
                      </th>
                    )}
                    {visibleCols.khoa && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Khoa
                      </th>
                    )}
                    {visibleCols.nhomThucHanh && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">
                        Nhóm thực hành
                      </th>
                    )}
                    {visibleCols.hinhThucHoc && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Hình thức học
                      </th>
                    )}
                    {visibleCols.ngayDangKy && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Ngày đăng ký
                      </th>
                    )}
                    {visibleCols.lichHoc && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                        Lịch học
                      </th>
                    )}

                    {visibleCols.trangThai && (
                      <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">
                        Trạng thái
                      </th>
                    )}



                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase text-center">
                      {t("users.actions")}
                    </th>
                  </tr>
                </thead>

                {/* ================== BODY ================== */}
                <tbody>
                  {DANH_SACH_DANG_KY.map((u) => (
                    <tr
                      key={u.id}
                      className={`border-b hover:bg-slate-50 transition-colors h-12 ${
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

                      {visibleCols.maSinhVien && (
                        <td className="px-4 py-2">
                          {u.maSinhVien}
                        </td>
                      )}
                      {visibleCols.hoTen && (
                        <td className="px-4 py-2">
                          {u.hoTen}
                        </td>
                      )}
                      {visibleCols.maHocPhan && (
                        <td className="px-4 py-2">
                          {u.maHocPhan}
                        </td>
                      )}
                      {visibleCols.monHoc && (
                        <td className="px-4 py-2">
                          {u.monHoc}
                        </td>
                      )}
                      {visibleCols.ky && (
                        <td className="px-4 py-2">
                          {u.ky}
                        </td>
                      )}
                      {visibleCols.namHoc && (
                        <td className="px-4 py-2">
                          {u.namHoc}
                        </td>
                      )}
                      {visibleCols.khoa && (
                        <td className="px-4 py-2">
                          {u.khoa}
                        </td>
                      )}
                      {visibleCols.nhomThucHanh && (
                        <td className="px-4 py-2 text-center">
                          {u.nhomThucHanh}
                        </td>
                      )}
                      {visibleCols.hinhThucHoc && (
                        <td className="px-4 py-2">
                          {u.hinhThucHoc}
                        </td>
                      )}
                      {visibleCols.ngayDangKy && (
                        <td className="px-4 py-2">
                          {u.ngayDangKy}
                        </td>
                      )}
                      {visibleCols.lichHoc && (
                        <td className="px-4 py-2">
                          {u.lichHoc} 
                        </td>

                      )}
                      {visibleCols.trangThai && (
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.trangThai === "Thành công"
                                ? pillStyle.Active  
                                : u.trangThai === "Chờ duyệt"
                                  ? pillStyle.Pending
                                  : pillStyle.Inactive
                            }`} 
                          >
                            {u.trangThai}
                          </span>
                        </td>
                      )}


                      {/* Actions */}
                      <td className="px-4 py-2">
                        <div className="flex justify-center gap-3">
                          <Trash2 
                            className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700" 
                            onClick={() => openConfirmActionModal(
                              "delete",
                              "Xác nhận xóa đăng ký",
                              `Bạn có chắc chắn muốn xóa đăng ký môn ${u.monHoc} của sinh viên ${u.hoTen}? Hành động này không thể hoàn tác.`,
                              "Xóa đăng ký",
                              () => {
                                console.log("Delete enroll", u.id);
                                toast.success("Đã xóa đăng ký thành công");
                              }
                            )}
                          />
                          <Eye 
                            className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700" 
                            onClick={() => openViewEnrollModal(u)}
                          />

                          {/* More Menu */}
                          <div className="relative">
                            <MoreVertical
                              className="w-5 h-5 cursor-pointer hover:text-slate-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenu(openMenu === u.id ? null : u.id);
                              }}
                            />

                            {openMenu === u.id && (
                              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-20">
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenu(null);
                                    openEditEnrollModal(u);
                                  }}
                                >
                                  <PencilLine className="w-4 h-4 mr-2" />
                                  Sửa
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-b-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenu(null);
                                    openConfirmActionModal(
                                      "lock",
                                      "Xác nhận hủy đăng ký",
                                      `Bạn có chắc chắn muốn hủy đăng ký môn ${u.monHoc} của sinh viên ${u.hoTen}?`,
                                      "Hủy đăng ký",
                                      () => {
                                        console.log("Cancel enroll", u.id);
                                        toast.success("Đã hủy đăng ký thành công");
                                      }
                                    );
                                  }}
                                >
                                  <LockKeyhole className="w-4 h-4 mr-2" />
                                  Hủy
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
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />

            {/* MODAL UPLOAD */}
            <ModalUpload open={openUpload} onClose={() => setOpenUpload(false)} />

            {/* MODALS */}
            <ModalAddEnroll 
              isOpen={modalAddEnroll.isOpen}
              onClose={closeAddEnrollModal}
              onSubmit={(formData) => {
                console.log("Add enrollment", formData);
                toast.success("Đã thêm đăng ký thành công");
              }}
            />

            <ModalEditEnroll 
              isOpen={modalEditEnroll.isOpen}
              onClose={closeEditEnrollModal}
              enrollData={modalEditEnroll.enrollData}
              onSubmit={(formData) => {
                console.log("Edit enrollment", formData);
                toast.success("Đã cập nhật đăng ký thành công");
              }}
            />

            <ModalViewEnroll 
              isOpen={modalViewEnroll.isOpen}
              onClose={closeViewEnrollModal}
              enrollData={modalViewEnroll.enrollData}
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
          </div>
        </div>
      </div>
    </div >

  );
};

export default AdminEnrollPage;
