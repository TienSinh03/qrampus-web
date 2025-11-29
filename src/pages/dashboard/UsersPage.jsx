import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Pagination from "../../components/common/Pagination";
import Search from "../../components/common/Search";
import ModalUpload from "../../components/common/ModalUpload";
import { CirclePlus, Trash2, LockKeyhole, CloudUpload, Eye, MoreVertical, PencilLine, Users, UserCheck, UserX, UserPlus } from "lucide-react";
import StatsCard from "../../components/common/StatsCard";
const UsersPage = () => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [openUpload, setOpenUpload] = useState(false);
  // const [checked, setChecked] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

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
    }, {
      id: 5,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    }, {
      id: 5,
      avatar_url: "https://demos.themeselection.com/materio-mui-nextjs-admin-template/demo-1/images/avatars/5.png",
      full_name: "Maggy Hurran",
      email: "mhurran4@yahoo.co.jp",
      role: "Subscriber",
      user_id: "23456",
      status: "Pending",
    }, {
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
      {/* <h1 className="text-2xl font-bold">Quản lý người dùng</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatsCard
          title="Session"
          value="21,459"
          percent="(+29%)"
          positive={true}
          subtitle="Total User"
          icon={<Users className="w-6 h-6 text-purple-600" />}
          iconBg="bg-purple-100"
        />

        <StatsCard
          title="Paid Users"
          value="4,567"
          percent="(+18%)"
          positive={true}
          subtitle="Last week analytics"
          icon={<UserPlus className="w-6 h-6 text-rose-600" />}
          iconBg="bg-rose-100"
        />

        <StatsCard
          title="Active Users"
          value="19,860"
          percent="(-14%)"
          positive={false}
          subtitle="Last week analytics"
          icon={<UserCheck className="w-6 h-6 text-green-600" />}
          iconBg="bg-green-100"
        />

        <StatsCard
          title="Pending Users"
          value="237"
          percent="(+42%)"
          positive={true}
          subtitle="Last week analytics"
          icon={<UserX className="w-6 h-6 text-yellow-600" />}
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
                placeholder={t('users.searchPlaceholder')}
                onSearch={(query) => console.log("Searching for:", query)}
              />
            </div>

            {/* Buttons */}
            <div className="col-span-4 md:col-span-4 lg:col-span-6">
              <div className="flex justify-end gap-3 flex-wrap">
                <button className="btn-primary">
                  <CirclePlus className="w-4 h-4" /> {t('users.addUser')}
                </button>

                <button className="btn-danger">
                  <Trash2 className="w-4 h-4" /> {t('users.deleteUser')}
                </button>

                <button className="btn-info" onClick={() => setOpenUpload(true)} >
                  <CloudUpload className="w-4 h-4" /> {t('users.upload')}
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
              <th className="h-12 px-4">{t('users.name')}</th>
              <th className="h-12 px-4">{t('users.email')}</th>
              <th className="h-12 px-4">{t('users.role')}</th>
              <th className="h-12 px-4">ID</th>
              <th className="h-12 px-4">{t('users.status')}</th>
              <th className="h-12 px-4">{t('users.actions')}</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-slate-50">
                <td className="px-4 h-14 flex items-center gap-2">
                  <img src={u.avatar_url} className="w-8 h-8 rounded-full" />
                  <div>
                    <div className="font-medium">{u.full_name}</div>
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
                    {/* More Menu */}
                    <div className="relative">
                      <MoreVertical className="cursor-pointer w-5 h-5" onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)} />

                      {/* Dropdown */}
                      {openMenu === u.id && (
                        <div className="absolute mt-2 w-25 bg-white shadow-lg rounded-md border z-20">
                          <button className="w-full text-left px-4 py-2 hover:bg-slate-100" onClick={() => console.log("Edit", u.id)}>
                            <PencilLine className="inline w-4 h-4 mr-2" />
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-slate-100" onClick={() => console.log("Lock", u.id)}>
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
    </div>
  );
};

export default UsersPage;
