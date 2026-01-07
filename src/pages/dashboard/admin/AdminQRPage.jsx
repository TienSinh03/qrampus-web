import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import {
  CirclePlus, Trash2, LockKeyhole, CloudUpload, Eye, MoreVertical, PencilLine, Users, UserCheck, UserX, UserPlus,
  QrCode, MessageSquareText, SquareCheckBig, CopyX,
  ArrowDownToLine, FileSpreadsheet, FilterX, ArrowUp, ArrowDown
} from "lucide-react";
import StatsCard from "../../../components/common/StatsCard";
import { useNavigate } from "react-router-dom";

const AdminQRPage = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  const navigate = useNavigate();







  const totalPages = 5;

  const giangvien = [
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
      maNhanSu: "1000001",
      hoTen: "Nguyễn Minh Tâm",
      khoa: "Công nghệ thông tin",
      tietDay: ["1-3", "7-9"],
      trangthaihocphan: "Tạo thành công",
      ngayday: "2024-06-15",
    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      maNhanSu: "1000002",
      hoTen: "Trần Thị Thu Hà",
      khoa: "Kinh tế",
      tietDay: ["4-6", "10-12"],
      trangthaihocphan: "Chưa tạo",
      ngayday: "2024-06-15",


    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
      maNhanSu: "1000003",
      hoTen: "Lê Quang Huy",
      khoa: "Ngoại ngữ",
      tietDay: ["1-3", "13-15"],
      trangthaihocphan: "Tạo thành công",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      maNhanSu: "1000004",
      hoTen: "Phạm Văn Long",
      khoa: "Cơ khí",
      tietDay: ["7-9", "10-12"],
      trangthaihocphan: "Tạo thành công",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
      maNhanSu: "1000005",
      hoTen: "Hoàng Thị Ngọc Anh",
      khoa: "Luật",
      tietDay: ["4-6", "13-15"],
      trangthaihocphan: "Quá hạn",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      maNhanSu: "1000006",
      hoTen: "Đặng Quốc Bảo",
      khoa: "Điện - Điện tử",
      tietDay: ["1-3", "4-6"],
      trangthaihocphan: "Quá hạn",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
      maNhanSu: "1000007",
      hoTen: "Võ Thanh Thảo",
      khoa: "Xây dựng",
      tietDay: ["7-9", "13-15"],
      trangthaihocphan: "Quá hạn",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
      maNhanSu: "1000008",
      hoTen: "Bùi Đức Thành",
      khoa: "Môi trường",
      tietDay: ["1-3", "10-12"],
      trangthaihocphan: "Quá hạn",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      maNhanSu: "1000009",
      hoTen: "Ngô Thị Mai",
      khoa: "Du lịch",
      tietDay: ["4-6", "7-9"],
      trangthaihocphan: "Quá hạn",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
      maNhanSu: "1000010",
      hoTen: "Phan Anh Tuấn",
      khoa: "Quản trị kinh doanh",
      tietDay: ["10-12", "13-15"],
      trangthaihocphan: "Quá hạn",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      maNhanSu: "1000011",
      hoTen: "Lý Thanh Hương",
      khoa: "Tài chính - Ngân hàng",
      tietDay: ["1-3", "7-9"],
      trangthaihocphan: "Tạo thành công",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
      maNhanSu: "1000012",
      hoTen: "Mai Quốc Khánh",
      khoa: "Kế toán",
      tietDay: ["4-6", "13-15"],
      trangthaihocphan: "Tạo thành công",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
      maNhanSu: "1000013",
      hoTen: "Tạ Ngọc Trinh",
      khoa: "Marketing",
      tietDay: ["7-9", "10-12"],
      trangthaihocphan: "Tạo thành công",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      maNhanSu: "1000014",
      hoTen: "Cao Minh Đức",
      khoa: "Công nghệ thực phẩm",
      tietDay: ["1-3", "13-15"],
      trangthaihocphan: "Tạo thành công",
      ngayday: "2024-06-15",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
      maNhanSu: "1000015",
      hoTen: "Vũ Hoàng Yến",
      khoa: "Thiết kế đồ họa",
      tietDay: ["4-6", "10-12"],
      trangthaihocphan: "Tạo thành công",
      ngayday: "2024-06-15",


    },
  ];

  // Expandable filter state
  const [expanded, setExpanded] = useState(false);




  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 p-1">
        <div className="mx-auto">
          <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="">
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

            <div className="bg-white border p-6">
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
                    <option>Tạo thành công</option>
                    <option>Chưa tạo</option>
                    <option>Quá hạn</option>
                  </select>
                </div>
                {expanded && (
                  <>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tiết dạy
                      </label>
                      <select className="w-full rounded-lg border px-3 py-2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>1-3</option>
                        <option>4-6</option>
                        <option>7-9</option>
                        <option>10-12</option>
                        <option>13-15</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày dạy
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

                </div>

                {/* Nhóm buttons phụ bên phải */}
                <div className="flex flex-wrap items-center gap-3">


                  {/* Tải Excel */}
                  <button
                    className="flex items-center gap-2 border border-emerald-400 text-emerald-400 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-emerald-100 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 transition-all duration-200"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    Tải Excel
                  </button>

                  {/* Xóa bộ lọc */}
                  <button
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-100 hover:border-gray-400 hover:shadow-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-all duration-200"
                  >
                    <FilterX className="w-5 h-5" />
                    Xóa bộ lọc
                  </button>
                </div>

              </div>
            </div>

            {/* TABLE */}
            <div className="w-full overflow-x-auto bg-white rounded-b-xl shadow">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 sticky top-0 z-10">
                  <tr>
                    <th className="h-12 px-4 font-semibold text-slate-600">Mã nhân sự</th>
                    <th className="h-12 px-4 font-semibold text-slate-600">Giảng viên</th>
                    <th className="h-12 px-4 font-semibold text-slate-600">Khoa</th>
                    <th className="h-12 px-4 font-semibold text-slate-600">Tiết dạy</th>
                    <th className="h-12 px-4 font-semibold text-slate-600 text-center">Ngày dạy</th>
                    <th className="h-12 px-4 font-semibold text-slate-600 text-center">
                      Trạng thái học phần
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200">
                  {giangvien.map((gv) => (
                    <tr
                      key={gv.maNhanSu}
                      onClick={() => navigate(`/dashboard/admin/qrcode/session/qrcode-detail`)}

                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {/* Mã nhân sự */}
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {gv.maNhanSu}
                      </td>

                      {/* Giảng viên */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3" >
                          <img
                            src={gv.avatar_url}
                            alt={gv.hoTen}
                            className="w-9 h-9 rounded-full object-cover border"
                          />
                          <div>
                            <div className="font-medium text-slate-800">
                              {gv.hoTen}
                            </div>

                          </div>
                        </div>
                      </td>

                      {/* Khoa */}
                      <td className="px-4 py-3 text-slate-700">
                        {gv.khoa}
                      </td>

                      {/* Tiết dạy */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {gv.tietDay.map((tiet, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700"
                            >
                              {tiet}
                            </span>
                          ))}
                        </div>
                      </td>
                      {/* Ngày dạy */}
                      <td className="px-4 py-3 text-center text-slate-700">
                        {gv.ngayday}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">

                        <span className="px-4 py-1 text-sm rounded-full bg-green-100 text-green-600">
                          {gv.trangthaihocphan}
                        </span>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQRPage;
