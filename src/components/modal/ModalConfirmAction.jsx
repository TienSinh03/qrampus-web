import React from "react";
import { X, AlertTriangle, Trash2, Lock, CheckCircle, RefreshCw } from "lucide-react";

const ModalConfirmAction = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  actionType, // "delete", "activate", "lock", "reset"
  title,
  message,
  confirmText,
  cancelText = "Hủy",
  userData // Optional: user/survey/entity data for context
}) => {
  if (!isOpen) return null;

  const getActionIcon = () => {
    switch (actionType) {
      case "delete":
        return <Trash2 className="w-12 h-12 text-red-500" />;
      case "activate":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "lock":
        return <Lock className="w-12 h-12 text-orange-500" />;
      case "reset":
        return <RefreshCw className="w-12 h-12 text-blue-500" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-orange-500" />;
    }
  };

  const getButtonColor = () => {
    switch (actionType) {
      case "delete":
        return "bg-red-600 hover:bg-red-700";
      case "activate":
        return "bg-green-600 hover:bg-green-700";
      case "lock":
        return "bg-orange-400 hover:bg-orange-700";
      case "reset":
        return "bg-blue-600 hover:bg-blue-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  // Generate default messages if not provided
  const getDefaultTitle = () => {
    switch (actionType) {
      case "delete":
        return "Xác nhận xóa";
      case "activate":
        return "Xác nhận kích hoạt";
      case "lock":
        return "Xác nhận khóa khảo sát";
      case "reset":
        return "Xác nhận đặt lại";
      default:
        return "Xác nhận hành động";
    }
  };

  const getDefaultMessage = () => {
    switch (actionType) {
      case "delete":
        return "Bạn có chắc chắn muốn xóa mục này không? Hành động này không thể hoàn tác.";
      case "activate":
        return "Bạn có chắc chắn muốn kích hoạt mục này không?";
      case "lock":
        return "Bạn có chắc chắn muốn khóa khảo sát này không? Sinh viên sẽ không thể truy cập khảo sát sau khi bị khóa.";
      case "reset":
        return "Bạn có chắc chắn muốn đặt lại mục này không?";
      default:
        return "Bạn có chắc chắn muốn thực hiện hành động này không?";
    }
  };

  const getDefaultConfirmText = () => {
    switch (actionType) {
      case "delete":
        return "Xóa";
      case "activate":
        return "Kích hoạt";
      case "lock":
        return "Khóa khảo sát";
      case "reset":
        return "Đặt lại";
      default:
        return "Xác nhận";
    }
  };

  const displayTitle = title || getDefaultTitle();
  const displayMessage = message || getDefaultMessage();
  const displayConfirmText = confirmText || getDefaultConfirmText();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon Section */}
          <div className="flex flex-col items-center pt-8 pb-4">
            <div className="bg-gray-50 rounded-full p-4 mb-4">
              {getActionIcon()}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {displayTitle}
            </h3>
            <p className="text-gray-600 text-center px-6">
              {displayMessage}
            </p>
            {userData && userData.course_name && (
              <div className="mt-3 px-6 py-2 bg-orange-50 rounded-lg border border-orange-200 w-full mx-6">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Học phần:</span> {userData.course_name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Mã:</span> {userData.course_code}
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 px-6 py-4 bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors shadow-md ${getButtonColor()}`}
            >
              {displayConfirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalConfirmAction;
