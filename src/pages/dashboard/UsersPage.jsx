import React, { useState } from "react";
import Pagination from "../../components/common/Pagination";
import Search from "../../components/common/Search";
import ModalUpload from "../../components/common/ModalUpload";
import { CirclePlus, Trash2, LockKeyhole, CloudUpload} from "lucide-react";

const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);

  const totalPages = 5;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <p>Trang này dành cho việc quản lý người dùng trong hệ thống.</p>

      <div className="container m-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">

          {/* Search */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-5">
            <Search
              placeholder="Tìm kiếm người dùng..."
              onSearch={(query) => console.log("Searching for:", query)}
            />
          </div>

          {/* Action Buttons */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-7">
            <div className="flex flex-wrap justify-center md:justify-end gap-2">

              <button className="h-12 px-6 bg-emerald-50 text-emerald-600 font-medium rounded-md border-black transition hover:bg-emerald-100">
                <CirclePlus className="inline-block w-5 h-5 mr-2" />
                Thêm nhân sự
              </button>

              <button className="h-12 px-6 bg-emerald-50 text-emerald-600 font-medium rounded-md transition hover:bg-emerald-100">
                <Trash2 className="inline-block w-5 h-5 mr-2" />
                Xóa nhân sự
              </button>

              <button className="h-12 px-6 bg-emerald-50 text-emerald-600 font-medium rounded-md transition hover:bg-emerald-100">
                <LockKeyhole className="inline-block w-5 h-5 mr-2" />
                Khóa tài khoản
              </button>

              <button onClick={() => setOpenUpload(true)} className="h-12 px-6 bg-emerald-50 text-emerald-600 font-medium rounded-md">
                <CloudUpload className="inline-block w-5 h-5 mr-2" />
                Upload nhân sự
              </button>
    

              {/* Modal upload */}
              <ModalUpload open={openUpload} onClose={() => setOpenUpload(false)} />

            </div>
          </div>
        </div>
      </div>


      {/* TABLE */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border border-separate rounded border-slate-200">
          <tbody>
            <tr>
              <th className="h-10 px-4 text-sm font-medium bg-slate-100 text-slate-700">#</th>
              <th className="h-10 px-4 text-sm font-medium bg-slate-100 text-slate-700">Mã Nhân sự</th>
              <th className="h-10 px-4 text-sm font-medium bg-slate-100 text-slate-700">Họ tên</th>
              <th className="h-10 px-4 text-sm font-medium bg-slate-100 text-slate-700">Email</th>
              <th className="h-10 px-4 text-sm font-medium bg-slate-100 text-slate-700">Đơn vị</th>
              <th className="h-10 px-4 text-sm font-medium bg-slate-100 text-slate-700">Trạng thái</th>
            </tr>

            {/* Example Row */}
            <tr>
              <td className="h-10 px-4 text-sm border-t">1</td>
              <td className="h-10 px-4 text-sm border-t">Ayub Salas</td>
              <td className="h-10 px-4 text-sm border-t">Designer</td>
              <td className="h-10 px-4 text-sm border-t">Carroll Group</td>
              <td className="h-10 px-4 text-sm border-t">Member</td>
              <td className="h-10 px-4 text-sm border-t">salas_a</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination Reusable */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UsersPage;
