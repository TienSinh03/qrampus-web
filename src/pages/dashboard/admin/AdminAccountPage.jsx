import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";

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
  File, Camera,
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
const AdminAccountPage = () => {
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

  const users = [
    {
      id: 1,
      full_name: "Nguyễn Thị Yến Nhi",
      email: "nguyenthiyennhi@iuh.edu.vn",
      avatar_url: "https://i.pravatar.cc/150?img=1",
      role: "Quản trị viên",
      user_id: "10001234",
      status: "Inactive",
    },
    {
      id: 2,
      full_name: "Nguyễn Thị Quỳnh Như",
      email: "nguyenthiquynhnhu@iuh.edu.vn",
      avatar_url: "https://i.pravatar.cc/150?img=2",
      role: "Ban chấm công",
      user_id: "10001235",
      status: "Pending",
    },
    {
      id: 3,
      full_name: "Lê Thị Kim Oanh",
      email: "lethikimoanh@iuh.edu.vn",
      avatar_url: "https://i.pravatar.cc/150?img=3",
      role: "Ban chấm công",
      user_id: "10001236",
      status: "Active",
    },
    {
      id: 4,
      full_name: "Võ Thanh Sang",
      email: "vothanhsang@iuh.edu.vn",
      avatar_url: "https://i.pravatar.cc/150?img=4",
      role: "Giảng viên",
      user_id: "10001237",
      status: "Inactive",
    },
    {
      id: 5,
      full_name: "Phạm Đoàn Thanh Sang",
      email: "phamdoanthanhsang@iuh.edu.vn",
      avatar_url: "https://i.pravatar.cc/150?img=5",
      role: "Giảng viên",
      user_id: "10001238",
      status: "Pending",
    },
    {
      id: 6,
      full_name: "Nguyễn Phúc Sang",
      email: "nguyenphucsang@iuh.edu.vn",
      avatar_url: "https://i.pravatar.cc/150?img=6",
      role: "Giảng viên",
      user_id: "10001239",
      status: "Pending",
    },
    {
      id: 7,
      full_name: "Dương Thị Thanh Thảo",
      email: "duongthithanhthao@iuh.edu.vn",
      avatar_url: "https://i.pravatar.cc/150?img=7",
      role: "Giảng viên",
      user_id: "10001240",
      status: "Pending",
    },
    {
      id: 8,
      full_name: "Trần Thị Thanh Thảo",
      email: "tranthithanhthao@iuh.edu.vn",
      avatar_url: "https://i.pravatar.cc/150?img=8",
      role: "Giảng viên",
      user_id: "10001241",
      status: "Pending",
    },
  ];

  const pillStyle = {
    Active: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Inactive: "bg-gray-200 text-gray-600",
  };
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
                      Mở rộng bộ lọc
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
                    Trạng thái
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Đang hoạt động</option>
                    <option>Chưa kích hoạt</option>
                    <option>Đã khóa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phân quyền
                  </label>
                  <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Sinh viên</option>
                    <option>Giảng viên</option>
                    <option>Bộ phận chấm công</option>
                    <option>Admin</option>

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
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-3 py-2"
                      />
                    </div>
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
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                {/* Nhóm buttons chính bên trái */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Kích hoạt tài khoản - Xanh lá hiện đại */}
                  <button className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200">
                    <CheckLine className="w-5 h-5" />
                    Kích hoạt tài khoản
                  </button>

                  {/* Khóa tài khoản - Đỏ nổi bật nhưng không chói */}
                  <button className="flex items-center gap-2 bg-rose-400 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-rose-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all duration-200">
                    <Lock className="w-5 h-5" />
                    Khóa tài khoản
                  </button>
                </div>

                {/* Nhóm buttons phụ bên phải */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Tải Excel - Xanh dương lá chuyên nghiệp */}
                  <button className="flex items-center gap-2 bg-teal-500 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-teal-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200">
                    <FileSpreadsheet className="w-5 h-5" />
                    Tải Excel
                  </button>

                  {/* Tải PDF - Cam/đỏ nhẹ nhàng */}
                  <button className="flex items-center gap-2 bg-amber-400 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-amber-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200">
                    <File className="w-5 h-5" />
                    Tải PDF
                  </button>

                  {/* Xóa bộ lọc - Style outline tinh tế */}
                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 bg-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200">
                    <FilterX className="w-5 h-5" />
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>


            {/* TABLE */}
            <div className="w-full overflow-x-auto bg-white  shadow mb-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th>
                      <input type="checkbox" className="ml-4" />
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
                  {users.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-slate-50">
                      <td>
                        <input
                          type="checkbox"
                          className="ml-4"
                        />
                      </td>
                      <td className="px-2 h-10 flex items-center gap-2 p-6">
                        <img src={u.avatar_url} className="w-8 h-8 rounded-full" />
                      </td>
                      <td className="px-4">{u.user_id}</td>
                      <td className="px-4 min-w-max">{u.full_name}</td>

                      <td className="px-4">{u.email}</td>
                      <td className="px-4">{u.role}</td>

                      <td className="px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${pillStyle[u.status]
                            }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="px-4">
                        <div className="flex gap-3">
                          <button title="Xóa" alt="Xóa">
                            <Trash2 className="text-red-500 cursor-pointer w-5 h-5" />
                          </button>
                          <button title="Xem chi tiết" alt="Xem chi tiết">
                            <Eye className="text-blue-500 cursor-pointer w-5 h-5" />
                          </button>
                          {/* More Menu */}
                          <div className="relative">
                            <MoreVertical
                              className="cursor-pointer w-5 h-5"
                              onClick={() =>
                                setOpenMenu(openMenu === u.id ? null : u.id)
                              }
                            />

                            {/* Dropdown */}
                            {openMenu === u.id && (
                              <div className="absolute mt-2 w-25 bg-white shadow-lg rounded-md border z-20">
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-slate-100"
                                  title="Chỉnh sửa"
                                  // onClick={() => console.log("Edit", u.id)}
                                  onClick={openDrawer}
                                >
                                  <PencilLine className="inline w-4 h-4 mr-2" />
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 hover:bg-slate-100"
                                  title="Khóa tài khoản"
                                  onClick={() =>
                                    toast.error("Bạn muốn khóa tài khoản này?", {
                                      action: {
                                        label: "Yes",
                                        onClick: () => {
                                          // xử lý khóa tài khoản
                                          console.log("Lock user", u.id);
                                          toast.success("Đã khóa tài khoản");
                                        },
                                      },
                                      cancel: {
                                        label: "No",
                                      },
                                    })
                                  }
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
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />

            {/* MODAL UPLOAD */}
            <ModalUpload open={openUpload} onClose={() => setOpenUpload(false)} />

            {isDrawerOpen && (
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
