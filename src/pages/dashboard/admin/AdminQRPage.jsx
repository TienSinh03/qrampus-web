import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Pagination from "../../../components/common/Pagination";
import Search from "../../../components/common/Search";
import ModalUpload from "../../../components/common/ModalUpload";
import { CirclePlus, Trash2, LockKeyhole, CloudUpload, Eye, MoreVertical, PencilLine, Users, UserCheck, UserX, UserPlus, QrCode, MessageSquareText, SquareCheckBig, CopyX } from "lucide-react";
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
      trangthaihocphan: "hoạt động",
    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      maNhanSu: "1000002",
      hoTen: "Trần Thị Thu Hà",
      khoa: "Kinh tế",
      tietDay: ["4-6", "10-12"],
      trangthaihocphan: "tạm ngưng",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
      maNhanSu: "1000003",
      hoTen: "Lê Quang Huy",
      khoa: "Ngoại ngữ",
      tietDay: ["1-3", "13-15"],
      trangthaihocphan: "tạm ngưng",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      maNhanSu: "1000004",
      hoTen: "Phạm Văn Long",
      khoa: "Cơ khí",
      tietDay: ["7-9", "10-12"],
      trangthaihocphan: "hoạt động",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
      maNhanSu: "1000005",
      hoTen: "Hoàng Thị Ngọc Anh",
      khoa: "Luật",
      tietDay: ["4-6", "13-15"],
      trangthaihocphan: "hoạt động",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      maNhanSu: "1000006",
      hoTen: "Đặng Quốc Bảo",
      khoa: "Điện - Điện tử",
      tietDay: ["1-3", "4-6"],
      trangthaihocphan: "tạm ngưng",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
      maNhanSu: "1000007",
      hoTen: "Võ Thanh Thảo",
      khoa: "Xây dựng",
      tietDay: ["7-9", "13-15"],
      trangthaihocphan: "tạm ngưng",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
      maNhanSu: "1000008",
      hoTen: "Bùi Đức Thành",
      khoa: "Môi trường",
      tietDay: ["1-3", "10-12"],
      trangthaihocphan: "hoạt động",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      maNhanSu: "1000009",
      hoTen: "Ngô Thị Mai",
      khoa: "Du lịch",
      tietDay: ["4-6", "7-9"],
      trangthaihocphan: "hoạt động",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
      maNhanSu: "1000010",
      hoTen: "Phan Anh Tuấn",
      khoa: "Quản trị kinh doanh",
      tietDay: ["10-12", "13-15"],
      trangthaihocphan: "hoạt động",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      maNhanSu: "1000011",
      hoTen: "Lý Thanh Hương",
      khoa: "Tài chính - Ngân hàng",
      tietDay: ["1-3", "7-9"],
      trangthaihocphan: "hoạt động",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
      maNhanSu: "1000012",
      hoTen: "Mai Quốc Khánh",
      khoa: "Kế toán",
      tietDay: ["4-6", "13-15"],
      trangthaihocphan: "hoạt động",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
      maNhanSu: "1000013",
      hoTen: "Tạ Ngọc Trinh",
      khoa: "Marketing",
      tietDay: ["7-9", "10-12"],
      trangthaihocphan: "hoạt động",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      maNhanSu: "1000014",
      hoTen: "Cao Minh Đức",
      khoa: "Công nghệ thực phẩm",
      tietDay: ["1-3", "13-15"],
      trangthaihocphan: "hoạt động",

    },
    {
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
      maNhanSu: "1000015",
      hoTen: "Vũ Hoàng Yến",
      khoa: "Thiết kế đồ họa",
      tietDay: ["4-6", "10-12"],
      trangthaihocphan: "hoạt động",

    },
  ];



  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý phiên điểm danh

      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      {/* FILTERS */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="container px-6 m-auto">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12 items-center">

            {/* Search */}
            <div className="col-span-4 md:col-span-4 lg:col-span-6">
              <Search
                placeholder="Tìm kiếm: mã nhân sự; họ tên giảng viên"

              />
            </div>

            {/* Select Khoa */}
            <div className="col-span-4 md:col-span-4 lg:col-span-3">
              <select


                className="w-full h-11 rounded-lg border border-slate-300 px-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Danh sách Khoa/Viện</option>
                <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                <option value="Kinh tế">Kinh tế</option>
                <option value="Ngoại ngữ">Ngoại ngữ</option>
                <option value="Cơ khí">Cơ khí</option>
                <option value="Luật">Luật</option>
                <option value="Điện - Điện tử">Điện - Điện tử</option>
                <option value="Xây dựng">Xây dựng</option>
                <option value="Môi trường">Môi trường</option>
                <option value="Du lịch">Du lịch</option>
                <option value="Quản trị kinh doanh">Quản trị kinh doanh</option>
              </select>
            </div>
            {/* Select Trạng thái học phần */}
            <div className="col-span-4 md:col-span-4 lg:col-span-3">
              <select


                className="w-full h-11 rounded-lg border border-slate-300 px-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Trạng thái học phần</option>
                <option value="hoạt động">Hoạt động</option>
                <option value="tạm ngưng">Tạm ngưng</option>

              </select>
            </div>

          </div>
        </div>
      </div>


      {/* TABLE */}
      <div className="w-full overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr>
              <th className="h-12 px-4 font-semibold text-slate-600">Mã nhân sự</th>
              <th className="h-12 px-4 font-semibold text-slate-600">Giảng viên</th>
              <th className="h-12 px-4 font-semibold text-slate-600">Khoa</th>
              <th className="h-12 px-4 font-semibold text-slate-600">Tiết dạy</th>
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

                {/* Actions */}
                <td className="px-4 py-3">
                  {gv.trangthaihocphan === "hoạt động" ? (
                    <span className="px-4 py-1 text-sm rounded-full bg-green-100 text-green-600">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-600">
                      Không hoạt động
                    </span>
                  )}
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
  );
};

export default AdminQRPage;
