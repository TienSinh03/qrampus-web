import React from "react";
import { X, DoorOpen, MapPin, Navigation } from "lucide-react";

// InfoRow component for displaying room information
// eslint-disable-next-line no-unused-vars
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
      <Icon className="w-5 h-5 text-cyan-600" />
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-base font-medium text-gray-800">{value || "Chưa cập nhật"}</p>
    </div>
  </div>
);

const ModalViewRoom = ({ isOpen, onClose, roomData }) => {
  if (!isOpen || !roomData) return null;

  const getStatusDisplay = (status) => {
    return status === 1 ? "Hoạt động" : "Không hoạt động";
  };

  const getStatusStyle = (status) => {
    return status === 1 
      ? "bg-green-100 text-green-600" 
      : "bg-gray-200 text-gray-600";
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[999]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-cyan-100">
          <h3 className="text-xl font-semibold text-gray-800">
            Chi tiết phòng học
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-cyan-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
            {/* Room Info Header */}
            <div className="flex flex-col items-center mb-6 pb-6 border-b">
              <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                <DoorOpen className="w-10 h-10 text-cyan-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                {roomData.ten_phong}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                {roomData.ma_phong}
              </p>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(roomData.trang_thai)}`}
              >
                {getStatusDisplay(roomData.trang_thai)}
              </span>
            </div>

            {/* Room Details */}
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <InfoRow
                  icon={MapPin}
                  label="Mã phòng"
                  value={roomData.ma_phong}
                />
                <InfoRow
                  icon={DoorOpen}
                  label="Tên phòng"
                  value={roomData.ten_phong}
                />
              </div>

              {/* Coordinates Section */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-cyan-600" />
                  Tọa độ phòng học
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Point 1 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-gray-600 mb-2">Điểm 1</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">X1</p>
                        <p className="text-sm font-medium text-gray-800">{roomData.x1}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Y1</p>
                        <p className="text-sm font-medium text-gray-800">{roomData.y1}</p>
                      </div>
                    </div>
                  </div>

                  {/* Point 2 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-gray-600 mb-2">Điểm 2</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">X2</p>
                        <p className="text-sm font-medium text-gray-800">{roomData.x2}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Y2</p>
                        <p className="text-sm font-medium text-gray-800">{roomData.y2}</p>
                      </div>
                    </div>
                  </div>

                  {/* Point 3 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-gray-600 mb-2">Điểm 3</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">X3</p>
                        <p className="text-sm font-medium text-gray-800">{roomData.x3}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Y3</p>
                        <p className="text-sm font-medium text-gray-800">{roomData.y3}</p>
                      </div>
                    </div>
                  </div>

                  {/* Point 4 */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-xs font-semibold text-gray-600 mb-2">Điểm 4</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">X4</p>
                        <p className="text-sm font-medium text-gray-800">{roomData.x4}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Y4</p>
                        <p className="text-sm font-medium text-gray-800">{roomData.y4}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Footer - Fixed bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-end gap-4 px-6 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 shadow-md transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalViewRoom;
