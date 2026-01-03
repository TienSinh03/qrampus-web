import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 800 * 1024) {
      setAvatar(URL.createObjectURL(file));
    } else {
      alert("File quá lớn! Tối đa 800KB");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4">
        {/* Header giống các trang khác */}


        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
        <div className="bg-white rounded-b-xl shadow-sm border p-4">
          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={
                    avatar || "https://www.w3schools.com/w3images/avatar2.png"
                  }
                  className="w-28 h-28 rounded-full object-cover border"
                  alt="Avatar"
                />
                {avatar && (
                  <button
                    onClick={() => setAvatar(null)}
                    className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <label className="mt-4 cursor-pointer">
                <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg">
                  <Upload className="w-4 h-4 mr-2" />
                  Tải ảnh
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG, GIF – tối đa 800KB
              </p>
            </div>

            {/* Thông tin */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Họ tên giảng viên" defaultValue="Nguyễn Văn A" />
                <Input label="Mã nhân sự" defaultValue="1012345" />
                <Input label="Email" defaultValue="teacher@iuh.edu.vn" />
                <Input label="Điện thoại" defaultValue="0909 123 456" />
                <Input label="Khoa / Viện" defaultValue="Công nghệ thông tin" />
                <Input label="Địa chỉ" defaultValue="TP.HCM" />
              </div>

              <div className="flex gap-4 pt-4">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-lg">
                  Lưu thay đổi
                </button>

                <button
                  onClick={() => navigate("/dashboard/change-password")}
                  className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

export default AccountPage;
