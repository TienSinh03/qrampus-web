import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ModalEditRoom = ({ isOpen, onClose, roomData, onSubmit }) => {
  const [formData, setFormData] = useState({
    ma_phong: "",
    ten_phong: "",
    x1: "",
    y1: "",
    x2: "",
    y2: "",
    x3: "",
    y3: "",
    x4: "",
    y4: "",
    trang_thai: 1,
  });

  // Populate form when roomData changes
  useEffect(() => {
    if (roomData) {
      // eslint-disable-next-line
      setFormData({
        ma_phong: roomData.ma_phong || "",
        ten_phong: roomData.ten_phong || "",
        x1: roomData.x1 || "",
        y1: roomData.y1 || "",
        x2: roomData.x2 || "",
        y2: roomData.y2 || "",
        x3: roomData.x3 || "",
        y3: roomData.y3 || "",
        x4: roomData.x4 || "",
        y4: roomData.y4 || "",
        trang_thai: roomData.trang_thai ?? 1,
      });
    }
  }, [roomData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[999]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header Drawer */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-blue-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Chỉnh sửa phòng học
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-blue-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <div className="flex-1 p-6 overflow-y-auto pb-32">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ma_phong"
                value={formData.ma_phong}
                onChange={handleChange}
                disabled
                className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Mã phòng không thể thay đổi</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ten_phong"
                value={formData.ten_phong}
                onChange={handleChange}
                placeholder="Ví dụ: Phòng B1.04"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Tọa độ điểm 1
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    X1
                  </label>
                  <input
                    type="text"
                    name="x1"
                    value={formData.x1}
                    onChange={handleChange}
                    placeholder="10,0"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Y1
                  </label>
                  <input
                    type="text"
                    name="y1"
                    value={formData.y1}
                    onChange={handleChange}
                    placeholder="10,5"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Tọa độ điểm 2
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    X2
                  </label>
                  <input
                    type="text"
                    name="x2"
                    value={formData.x2}
                    onChange={handleChange}
                    placeholder="30,5"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Y2
                  </label>
                  <input
                    type="text"
                    name="y2"
                    value={formData.y2}
                    onChange={handleChange}
                    placeholder="10,0"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Tọa độ điểm 3
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    X3
                  </label>
                  <input
                    type="text"
                    name="x3"
                    value={formData.x3}
                    onChange={handleChange}
                    placeholder="30,0"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Y3
                  </label>
                  <input
                    type="text"
                    name="y3"
                    value={formData.y3}
                    onChange={handleChange}
                    placeholder="0,0"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Tọa độ điểm 4
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    X4
                  </label>
                  <input
                    type="text"
                    name="x4"
                    value={formData.x4}
                    onChange={handleChange}
                    placeholder="10,0"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Y4
                  </label>
                  <input
                    type="text"
                    name="y4"
                    value={formData.y4}
                    onChange={handleChange}
                    placeholder="0,5"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="trang_thai"
                value={formData.trang_thai}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t bg-white/90 backdrop-blur">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalEditRoom;
