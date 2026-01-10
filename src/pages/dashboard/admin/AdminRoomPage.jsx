import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
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
const AdminRoomPage = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  // const [checked, setChecked] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

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

  const totalPages = 5;

  const PHONG = [
    {
      ma_phong: "B1.04",
      ten_phong: "B1.04",
      x1: "10,0",
      y1: "10,5",

      x2: "30,5",
      y2: "10,0",

      x3: "30,0",
      y3: "0,0",

      x4: "10,0",
      y4: "0,5",
      trang_thai: 1      // Thường dùng Int trong SQL (1: Trống, 2: Bận, 0: Bảo trì)
    },
    {
      ma_phong: "H3.01",
      ten_phong: "H3.01",

      x1: "15,0",
      y1: "15,10",

      x2: "35,10",
      y2: "15,0",

      x3: "35,0",
      y3: "5,0",

      x4: "15,0",
      y4: "5,10",

      trang_thai: 1
    },
    {
      ma_phong: "H3.02",
      ten_phong: "H3.02",
      x1: "20,0",
      y1: "20,15",

      x2: "50,15",
      y2: "20,0",

      x3: "50,0",
      y3: "10,0",

      x4: "20,0",
      y4: "10,15",

      trang_thai: 0
    }
  ];



  const pillStyle = {
    Active: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Inactive: "bg-gray-200 text-gray-600",
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
                    Mã phòng
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên phòng
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 4203001549"
                    className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>


              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-wrap items-center justify-between justify-start md:justify-end">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={openDrawer}
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
                </div>
              </div>
            </div>


            {/* TABLE */}
            <div className="w-full overflow-x-auto rounded-b-xl border border-slate-200 bg-white shadow mb-6">
              <table className="w-full table-auto border-collapse text-left text-sm whitespace-nowrap">

                {/* ================== HEADER ================== */}
                <thead className="sticky top-0 z-10 bg-slate-100">
                  <tr className="border-b">

                    {/* Checkbox */}
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      <input type="checkbox" />
                    </th>

                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Mã phòng
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Tên phòng
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Ví trí 1
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Ví trí 2
                    </th>
                    <th className="h-12 px-4 text-xs font-semibold text-slate-600 uppercase">
                      Ví trí 3
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
                  {PHONG.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b hover:bg-slate-50 transition-colors h-12"
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-2">
                        <input type="checkbox" />
                      </td>
                      <td className="px-4 py-2">{u.ma_phong}</td>
                      <td className="px-4 py-2">{u.ten_phong}</td>
                      <td className="px-4 py-2">
                        ({u.x1}, {u.y1})
                      </td>
                      <td className="px-4 py-2">
                        ({u.x2}, {u.y2})
                      </td>
                      <td className="px-4 py-2">
                        ({u.x3}, {u.y3})
                      </td>
                      <td className="px-4 py-2">
                        ({u.x4}, {u.y4})
                      </td>


                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${u.trangThai === "Thành công"
                            ? pillStyle.Active
                            : u.trangThai === "Chờ duyệt"
                              ? pillStyle.Pending
                              : pillStyle.Inactive
                            }`}
                        >
                          {u.trangThai}
                        </span>
                      </td>


                      {/* Actions */}
                      <td className="px-4 py-2">
                        <div className="flex justify-center gap-3">
                          <Trash2 className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700" />
                          <Eye className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700" />

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
                              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-20">
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-slate-100"
                                  onClick={() => console.log("Edit", u.id)}
                                >
                                  <PencilLine className="w-4 h-4 mr-2" />
                                  Sửa
                                </button>
                                <button
                                  className="flex items-center w-full px-4 py-2 text-sm hover:bg-slate-100"
                                  onClick={() => console.log("Lock", u.id)}
                                >
                                  <LockKeyhole className="w-4 h-4 mr-2" />
                                  Khoá
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

            {isDrawerOpen && (
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
