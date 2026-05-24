import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react"; // Thêm Check, X để làm icon note
import { useNavigate } from "react-router-dom";
import AuthService from "@services/AuthService";

const ChangePasswordPage = () => {
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  // --- HÀM KIỂM TRA ĐIỀU KIỆN MẬT KHẨU ---
  const getPasswordRequirements = (password) => {
    return [
      { label: "Ít nhất 8 ký tự", met: password.length >= 8 },
      { label: "Ít nhất 1 chữ hoa", met: /[A-Z]/.test(password) },
      { label: "Ít nhất 1 chữ thường", met: /[a-z]/.test(password) },
      { label: "Ít nhất 1 chữ số", met: /\d/.test(password) },
      { label: "Ít nhất 1 ký tự đặc biệt (!@#$%...)", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
    if (message.text) setMessage({ type: "", text: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    const requirements = getPasswordRequirements(formData.newPassword);

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else {
      // Kiểm tra xem tất cả các yêu cầu trong note đã khớp chưa
      const unmet = requirements.filter(r => !r.met);
      if (unmet.length > 0) {
        newErrors.newPassword = "Mật khẩu mới chưa đủ mạnh";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "Mật khẩu mới phải khác mật khẩu hiện tại";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await AuthService.changePassword(formData.currentPassword, formData.newPassword);
      setMessage({ type: "success", text: "Đổi mật khẩu thành công! Đang chuyển hướng..." });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate("/dashboard/account-setting"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Đổi mật khẩu thất bại." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 max-w-xl">
        <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-xl" />
        <div className="bg-white rounded-b-xl shadow-sm border p-8">
          <button
            onClick={() => navigate("/dashboard/account-setting")}
            className="flex items-center text-sm text-purple-600 mb-6 hover:underline"
          >
            <ArrowLeft size={18} className="mr-1" />
            Quay lại tài khoản
          </button>

          <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>

          {message.text && (
            <div className={`mb-4 p-4 rounded-lg border ${
              message.type === "success" ? "bg-green-50 text-green-800 border-green-200" : "bg-red-50 text-red-800 border-red-200"
            }`}>
              {message.text}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <PasswordInput
              label="Mật khẩu hiện tại"
              value={formData.currentPassword}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              show={show.current}
              toggle={() => setShow({ ...show, current: !show.current })}
              error={errors.currentPassword}
              disabled={loading}
            />

            <div>
              <PasswordInput
                label="Mật khẩu mới"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                show={show.next}
                toggle={() => setShow({ ...show, next: !show.next })}
                error={errors.newPassword}
                disabled={loading}
              />
              
              {/* --- PHẦN GHI CHÚ MẬT KHẨU --- */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Yêu cầu mật khẩu:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getPasswordRequirements(formData.newPassword).map((req, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {req.met ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <X size={14} className="text-gray-300" />
                      )}
                      <span className={`text-xs ${req.met ? "text-green-700" : "text-gray-500"}`}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <PasswordInput
              label="Xác nhận mật khẩu mới"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              show={show.confirm}
              toggle={() => setShow({ ...show, confirm: !show.confirm })}
              error={errors.confirmPassword}
              disabled={loading}
            />

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 transition-all"
              >
                {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Component con giữ nguyên logic style nhưng gọn gàng hơn
const PasswordInput = ({ label, show, toggle, value, onChange, error, disabled }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${
          error ? "border-red-500 bg-red-50" : "border-gray-300"
        }`}
        placeholder={`Nhập ${label.toLowerCase()}`}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

export default ChangePasswordPage;