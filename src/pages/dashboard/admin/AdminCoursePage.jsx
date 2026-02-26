import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import ModalAddCourse from "../../../components/modal/ModalAddCourse";
import ModalEditCourse from "../../../components/modal/ModalEditCourse";
import ModalViewCourse from "../../../components/modal/ModalViewCourse";
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
  File,
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
const AdminCoursePage = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal states
  const [modalAddCourse, setModalAddCourse] = useState({ isOpen: false });
  const [modalEditCourse, setModalEditCourse] = useState({ isOpen: false, courseData: null });
  const [modalViewCourse, setModalViewCourse] = useState({ isOpen: false, courseData: null });
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

  const openViewCourseModal = (course) => setModalViewCourse({ isOpen: true, courseData: course });
  const closeViewCourseModal = () => setModalViewCourse({ isOpen: false, courseData: null });

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

  const MONHOC = [
    {
      maHocPhan: "421234567890",
      tenMonHoc: "Nhập môn lập trình",
      ky: 1,
      namHoc: "2023-2024",
      khoa: "Công nghệ thông tin",
      siSo: 60,
      hinhThucHoc: "Lý thuyết",
      trangThai: "Đang mở"
    },
    {
      maHocPhan: "421234567891",
      tenMonHoc: "Nhập môn lập trình",
      ky: 1,
      namHoc: "2023-2024",
      khoa: "Công nghệ thông tin",
      siSo: 60,
      hinhThucHoc: "Lý thuyết",
      trangThai: "Đang mở"
    }, {
      maHocPhan: "421234567892",
      tenMonHoc: "Nhập môn lập trình",
      ky: 1,
      namHoc: "2023-2024",
      khoa: "Công nghệ thông tin",
      siSo: 60,
      hinhThucHoc: "Lý thuyết",
      trangThai: "Đang mở"
    }, {
      maHocPhan: "421234567894",
      tenMonHoc: "Nhập môn lập trình",
      ky: 1,
      namHoc: "2023-2024",
      khoa: "Công nghệ thông tin",
      siSo: 60,
      hinhThucHoc: "Lý thuyết",
      trangThai: "Đang mở"
    },
  ];

  const pillStyle = {
    "Active": "bg-green-100 text-green-600",
    "Đang mở": "bg-green-100 text-green-600",
    "Pending": "bg-yellow-100 text-yellow-600",
    "Inactive": "bg-gray-200 text-gray-600",
  };

  // Checkbox handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(MONHOC.map(item => item.maHocPhan));
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

  const isAllSelected = MONHOC.length > 0 && selectedIds.length === MONHOC.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < MONHOC.length;

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
                title="Tổng số"
                value="21,459"
                percent="(+29%)"
                positive={true}
                subtitle="môn học đã tạo"
                icon={<Users className="w-6 h-6 text-purple-600" />}
                iconBg="bg-purple-100"
              />

              <StatsCard
                title="Tổng số môn học"
                value="4,567"
                percent="(+18%)"
                positive={true}
                subtitle="chưa có lịch"
                icon={<UserPlus className="w-6 h-6 text-rose-600" />}
                iconBg="bg-rose-100"
              />

              <StatsCard
                title="Tổng số môn học"
                value="19,860"
                percent="(-14%)"
                positive={false}
                subtitle="đã có lịch"
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
                    Mã số nhân sự
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border px-3 py-2"
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
                {expanded && (
                  <>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mail
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: ...."
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày sinh
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
                    onClick={openAddCourseModal}
                    className="flex items-center gap-2  border border-emerald-500 text-emerald-500 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                    title="Thêm môn học, khóa học mới"
                  >
                    <CirclePlus className="w-5 h-5" />
                  </button>

                  <button
                    className="flex items-center gap-2 border border-rose-400 text-rose-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-rose-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-rose-500 focus:ring-offset-1 transition-all duration-200"
                    title="Xóa môn học đã chọn, chuyển đổi trạng thái"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setOpenUpload(true)}
                    className="flex items-center gap-2 border border-blue-400 text-blue-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-blue-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                    title="Upload danh sách môn học, vui lòng tải mẫu excel bên dưới"
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
                        "Xác nhận xóa nhiều học phần",
                        `Bạn có chắc chắn muốn xóa ${selectedIds.length} học phần đã chọn? Hành động này không thể hoàn tác.`,
                        "Xóa tất cả",
                        () => {
                          console.log("Delete selected:", selectedIds);
                          toast.success(`Đã xóa ${selectedIds.length} học phần thành công`);
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
                      Khoa
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
                      {t("users.actions")}
                    </th>
                  </tr>
                </thead>

                {/* ================== BODY ================== */}
                <tbody>
                  {MONHOC.map((u) => (
                    <tr
                      key={u.maHocPhan}
                      className={`border-b hover:bg-slate-50 transition-colors h-12 ${
                        selectedIds.includes(u.maHocPhan) ? 'bg-blue-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-2">
                        <input 
                          type="checkbox"
                          checked={selectedIds.includes(u.maHocPhan)}
                          onChange={() => handleSelectOne(u.maHocPhan)}
                          className="cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-2">
                        {u.maHocPhan}
                      </td>

                      <td
                        className="px-4 py-2 max-w-[260px] truncate"
                        title={u.tenMonHoc}
                      >
                        {u.tenMonHoc}
                      </td>

                      <td className="px-4 py-2">
                        {u.ky}
                      </td>

                      <td className="px-4 py-2">
                        {u.namHoc}
                      </td>

                      <td
                        className="px-4 py-2 hidden lg:table-cell truncate max-w-[180px]"
                        title={u.khoa}
                      >
                        {u.khoa}
                      </td>

                      <td className="px-4 py-2 text-center">
                        {u.siSo}
                      </td>

                      <td className="px-4 py-2 hidden md:table-cell">
                        {u.hinhThucHoc}
                      </td>

                      {/* Trạng thái */}
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`inline-flex items-center justify-center min-w-[80px] px-3 py-0.5 rounded-full text-xs font-medium ${pillStyle[u.trangThai]}`}
                        >
                          {u.trangThai}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-2">
                        <div className="flex justify-center gap-3">
                          <Trash2 
                            className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700" 
                            onClick={() => openConfirmActionModal(
                              "delete",
                              "Xác nhận xóa môn học",
                              `Bạn có chắc chắn muốn xóa môn học ${u.tenMonHoc}? Hành động này không thể hoàn tác.`,
                              "Xóa môn học",
                              () => {
                                console.log("Delete course", u.maHocPhan);
                                toast.success("Đã xóa môn học thành công");
                              }
                            )}
                          />
                          <Eye 
                            className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700" 
                            onClick={() => openViewCourseModal(u)}
                          />

                          {/* More Menu */}
                          <div className="relative">
                            <MoreVertical
                              className="w-5 h-5 cursor-pointer hover:text-slate-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenu(openMenu === u.maHocPhan ? null : u.maHocPhan);
                              }}
                            />

                            {openMenu === u.maHocPhan && (
                              <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-20">
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenu(null);
                                    openEditCourseModal(u);
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
                                      "Xác nhận khóa môn học",
                                      `Bạn có chắc chắn muốn khóa môn học ${u.tenMonHoc}?`,
                                      "Khóa môn học",
                                      () => {
                                        console.log("Lock course", u.maHocPhan);
                                        toast.success("Đã khóa môn học thành công");
                                      },
                                      { course_name: u.tenMonHoc, course_code: u.maHocPhan }
                                    );
                                  }}
                                >
                                  <LockKeyhole className="w-4 h-4 mr-2" />
                                  Khóa
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
            <ModalAddCourse 
              isOpen={modalAddCourse.isOpen}
              onClose={closeAddCourseModal}
              onSubmit={(formData) => {
                console.log("Add course", formData);
                toast.success("Đã thêm môn học thành công");
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
              courseData={modalViewCourse.courseData}
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

export default AdminCoursePage;
