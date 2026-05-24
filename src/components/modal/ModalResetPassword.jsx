import React, { useState, useEffect } from "react";
import { X, Key, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const ModalResetPassword = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  userIds = [], // Array of user IDs for bulk reset
  isBulk = false, // true if bulk reset
  userData = null // Single user data for single reset
}) => {
  const [passwordType, setPasswordType] = useState("default"); // "default" or "custom"
  const [customPassword, setCustomPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetResults, setResetResults] = useState(null);

  // Reset form khi modal đóng/mở
  useEffect(() => {
    if (isOpen) {
      setPasswordType("default");
      setCustomPassword("");
      setConfirmPassword("");
      setResetResults(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate custom password
    if (passwordType === "custom") {
      if (!customPassword) {
        toast.error("Vui lòng nhập mật khẩu mới");
        return;
      }
      if (customPassword.length < 6) {
        toast.error("Mật khẩu phải có ít nhất 6 ký tự");
        return;
      }
      if (customPassword !== confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }
    }

    const password = passwordType === "default" ? "12345678" : customPassword;

    setIsSubmitting(true);
    try {
      const result = await onConfirm(password);
      setResetResults(result);
      
      // Don't close immediately if bulk reset - show results
      if (!isBulk) {
        setTimeout(() => {
          onClose();
          toast.success("Đã reset mật khẩu thành công!");
        }, 1500);
      }
    } catch (error) {
      toast.error(error.message || "Có lỗi xảy ra khi reset mật khẩu");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Nếu đã có kết quả bulk reset, hiển thị danh sách
  if (resetResults && isBulk && resetResults.data) {
    const { successCount = 0, failCount = 0, results = [] } = resetResults.data || {};

    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/60 z-[999] backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="fixed right-0 top-0 bottom-0 z-[1000] w-full max-w-2xl overflow-auto animate-slide-in-right">
          <div className="bg-white h-full shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">
                  Kết quả reset mật khẩu
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Summary */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    Tổng số tài khoản: <strong>{results?.length || 0}</strong>
                  </span>
                  <div className="flex gap-4">
                    <span className="text-green-700">
                      Thành công: <strong>{successCount}</strong>
                    </span>
                    {failCount > 0 && (
                      <span className="text-red-700">
                        Thất bại: <strong>{failCount}</strong>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border flex items-center justify-between ${
                      result.success
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">
                          {result.user_name || result.user_id}
                        </p>
                        {result.success ? (
                          <p className="text-sm text-green-700">
                            Reset mật khẩu thành công
                          </p>
                        ) : (
                          <p className="text-sm text-red-700">
                            {result.error || "Có lỗi xảy ra"}
                          </p>
                        )}
                      </div>
                    </div>
                    {result.success && (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.status === 'active' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {result.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 mt-auto">
              <button
                onClick={handleClose}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Form reset password
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-[999] backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 bottom-0 z-[1000] w-full max-w-md animate-slide-in-right">
        <div className="bg-white h-full shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Reset mật khẩu
                </h3>
                <p className="text-sm text-gray-600">
                  {isBulk 
                    ? `${userIds?.length || 0} tài khoản đã chọn` 
                    : userData?.full_name || "Đặt lại mật khẩu tài khoản"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
            {/* Password Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Chọn loại mật khẩu
              </label>

              {/* Default Password Option */}
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="passwordType"
                  value="default"
                  checked={passwordType === "default"}
                  onChange={(e) => setPasswordType(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    Mật khẩu mặc định
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Sử dụng mật khẩu: <code className="px-2 py-0.5 bg-gray-100 rounded text-blue-600 font-mono">12345678</code>
                  </div>
                </div>
              </label>

              {/* Custom Password Option */}
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="passwordType"
                  value="custom"
                  checked={passwordType === "custom"}
                  onChange={(e) => setPasswordType(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">
                    Mật khẩu tùy chỉnh
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Tự nhập mật khẩu mới (tối thiểu 6 ký tự)
                  </div>
                </div>
              </label>
            </div>

            {/* Custom Password Inputs */}
            {passwordType === "custom" && (
              <div className="space-y-4 pl-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            )}

            {/* Warning Message */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Lưu ý:</p>
                  <p>
                    {isBulk 
                      ? `Mật khẩu của ${userIds?.length || 0} tài khoản sẽ được đặt lại. Người dùng cần sử dụng mật khẩu mới để đăng nhập.`
                      : "Mật khẩu của tài khoản sẽ được đặt lại. Người dùng cần sử dụng mật khẩu mới để đăng nhập."}
                  </p>
                </div>
              </div>
            </div>
          </form>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 mt-auto">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Xác nhận reset</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalResetPassword;
