import React, { useState } from "react";
import Pagination from "../../components/common/Pagination";
import Search from "../../components/common/Search";
import ModalUpload from "../../components/common/ModalUpload";
import { CirclePlus, Trash2, LockKeyhole, CloudUpload} from "lucide-react";

const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  const [checked, setChecked] = useState(false)

  const totalPages = 5;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <p>Trang này dành cho việc quản lý người dùng trong hệ thống.</p>

      <div className="container m-auto px-4">
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-12 
          gap-4 
          items-center
        ">

          {/* Search */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-5">
            <Search
              placeholder="Tìm kiếm người dùng..."
              onSearch={(query) => console.log("Searching for:", query)}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-7">
            <div className="
              flex 
              flex-wrap 
              gap-2 
              justify-center 
              md:justify-end
            ">

              <button className="btn-primary">
                <CirclePlus className="w-5 h-5" /> Thêm nhân sự
              </button>

              <button className="btn-danger">
                <Trash2 className="w-5 h-5" /> Xóa nhân sự
              </button>
              
              <button className="btn-warning">
                <LockKeyhole className="w-5 h-5" /> Khóa tài khoản
              </button>

              <button 
                onClick={() => setOpenUpload(true)} 
                className="btn-info"
              >
                <CloudUpload className="w-5 h-5" />
                Upload nhân sự
              </button>
            </div>
          </div>
        </div>

        {/* MODAL */}
        <ModalUpload open={openUpload} onClose={() => setOpenUpload(false)} />
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
              <td className="h-10 px-4 text-sm border-t">

                <input
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded border-2 border-slate-500 bg-white transition-colors checked:border-emerald-500 checked:bg-emerald-500 checked:hover:border-emerald-600 checked:hover:bg-emerald-600 focus:outline-none checked:focus:border-emerald-700 checked:focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50"
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                  id="id-c01"
                />


              </td>
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
