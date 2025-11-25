import React, { useState } from "react";
import Pagination from "../../components/common/Pagination";
import Search from "../../components/common/Search";
import ModalUpload from "../../components/common/ModalUpload";
import { CirclePlus, Trash2, LockKeyhole, CloudUpload, Eye, MoreVertical } from "lucide-react";

const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  const [checked, setChecked] = useState(false);

  const totalPages = 5;

  const users = [
    {
      id: 1,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/3.png",
      full_name: "Galen Slixby",
      email: "gslixby0@abc.net.au",
      role: "Editor",
      user_id: "123456",
      status: "Inactive",
    },
    {
      id: 2,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/2.png",
      full_name: "Halsey Redmore",
      email: "hredmore1@imgur.com",
      role: "Author",
      user_id: "125678",
      status: "Pending",
    },
    {
      id: 3,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/1.png",
      full_name: "Marjory Sicely",
      email: "msicely2@who.int",
      role: "Maintainer",
      user_id: "456321",
      status: "Active",
    },
    {
      id: 4,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/4.png",
      full_name: "Cyrill Risby",
      email: "crisby3@wordpress.com",
      role: "Maintainer",
      user_id: "456789",
      status: "Inactive",
    },
    {
      id: 5,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    },
  ];

  const pillStyle = {
    Active: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Inactive: "bg-gray-200 text-gray-600",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
      <p>Trang này dành cho việc quản lý người dùng trong hệ thống.</p>

      {/* FILTERS */}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <div className="container px-6 m-auto">
          <div className="grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12 items-center">

            {/* Search */}
            <div className="col-span-4 md:col-span-4 lg:col-span-6">
              <Search
                placeholder="Tìm kiếm người dùng..."
                onSearch={(query) => console.log("Searching for:", query)}
              />
            </div>

            {/* Buttons */}
            <div className="col-span-4 md:col-span-4 lg:col-span-6">
              <div className="flex justify-end gap-3 flex-wrap">
                <button className="btn-primary">
                  <CirclePlus className="w-4 h-4" /> Add User
                </button>

                <button className="btn-danger">
                  <Trash2 className="w-4 h-4" /> Xóa User
                </button>

                <button className="btn-info" onClick={() => setOpenUpload(true)} >
                  <CloudUpload className="w-4 h-4" /> Upload User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-100">
              <th className="h-12 px-4">User</th>
              <th className="h-12 px-4">Email</th>
              <th className="h-12 px-4">Role</th>
              <th className="h-12 px-4">ID</th>
              <th className="h-12 px-4">Status</th>
              <th className="h-12 px-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-slate-50">
                <td className="px-4 h-14 flex items-center gap-2">
                  <img src={u.avatar_url} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-sm text-gray-500">{u.email.split("@")[0]}</div>
                  </div>
                </td>

                <td className="px-4">{u.email}</td>
                <td className="px-4">{u.role}</td>
                <td className="px-4">{u.user_id}</td>

                <td className="px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${pillStyle[u.status]}`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="px-4">
                  <div className="flex gap-3">
                    <Trash2 className="text-red-500 cursor-pointer w-5 h-5" />
                    <Eye className="text-blue-500 cursor-pointer w-5 h-5" />
                    <MoreVertical className="cursor-pointer w-5 h-5" />
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
    </div>
  );
};

export default UsersPage;
