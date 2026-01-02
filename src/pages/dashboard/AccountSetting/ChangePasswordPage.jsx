import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 max-w-xl">
        <div className="bg-white rounded-2xl shadow border p-8 mt-10">
          <button
            onClick={() => navigate("/dashboard/account-setting")}
            className="flex items-center text-sm text-purple-600 mb-6"
          >
            <ArrowLeft size={18} className="mr-1" />
            Quay lại tài khoản
          </button>

          <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>

          <form className="space-y-6">
            <PasswordInput
              label="Mật khẩu hiện tại"
              show={show.current}
              toggle={() => setShow({ ...show, current: !show.current })}
            />
            <PasswordInput
              label="Mật khẩu mới"
              show={show.next}
              toggle={() => setShow({ ...show, next: !show.next })}
            />
            <PasswordInput
              label="Xác nhận mật khẩu"
              show={show.confirm}
              toggle={() => setShow({ ...show, confirm: !show.confirm })}
            />

            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-3 bg-purple-600 text-white rounded-lg">
                Lưu thay đổi
              </button>
              <button type="button" className="flex-1 py-3 border rounded-lg">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PasswordInput = ({ label, show, toggle }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
      >
        {show ? <EyeOff /> : <Eye />}
      </button>
    </div>
  </div>
);

export default ChangePasswordPage;
