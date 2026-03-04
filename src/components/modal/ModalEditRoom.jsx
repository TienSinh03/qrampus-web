import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { validateRoomForm } from "../../utils/validation/roomValidation";

const ModalEditRoom = ({ isOpen, onClose, roomData, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    ma_phong: "",
    ten_phong: "",
    mo_ta: "",
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

  const [errors, setErrors] = useState({});

  // Populate form when roomData changes
  useEffect(() => {
    if (roomData) {
      console.log("ModalEditRoom - roomData received:", roomData);
      
      // Handle both Vietnamese and English field names
      const roomCode = roomData.room_code || roomData.ma_phong || "";
      const roomName = roomData.room_name || roomData.ten_phong || "";
      const description = roomData.description || roomData.mo_ta || "";
      
      // Convert is_active (boolean) to trang_thai (number 1/0)
      let status = 1; // Default active
      if (roomData.is_active !== undefined) {
        status = roomData.is_active ? 1 : 0;
      } else if (roomData.trang_thai !== undefined) {
        status = roomData.trang_thai ? 1 : 0;
      }
      
      console.log("ModalEditRoom - is_active/trang_thai:", roomData.is_active, roomData.trang_thai, "=> status:", status);
      
      let coordinates = { x1: "", y1: "", x2: "", y2: "", x3: "", y3: "", x4: "", y4: "" };
      
      // Handle coordinates array format
      if (roomData.coordinates && Array.isArray(roomData.coordinates)) {
        roomData.coordinates.forEach((coord, index) => {
          if (index < 4) {
            coordinates[`x${index + 1}`] = coord.x !== undefined ? coord.x : "";
            coordinates[`y${index + 1}`] = coord.y !== undefined ? coord.y : "";
          }
        });
      } else {
        // Handle old format (x1, y1, x2, y2, etc.)
        coordinates = {
          x1: roomData.x1 || "",
          y1: roomData.y1 || "",
          x2: roomData.x2 || "",
          y2: roomData.y2 || "",
          x3: roomData.x3 || "",
          y3: roomData.y3 || "",
          x4: roomData.x4 || "",
          y4: roomData.y4 || "",
        };
      }
      
      // Intentional: We need to sync form state with prop changes
      // eslint-disable-next-line
      setFormData({
        ma_phong: roomCode,
        ten_phong: roomName,
        mo_ta: description,
        ...coordinates,
        trang_thai: status,
      });
      setErrors({});
    }
  }, [roomData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert trang_thai from string to number
    const newValue = name === "trang_thai" ? Number(value) : value;
    
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Clear coordinate errors when any coordinate field changes
    if (name.startsWith('x') || name.startsWith('y')) {
      setErrors((prev) => ({ ...prev, coordinates: "" }));
    }
  };

  const handleSubmit = () => {
    // Transform formData to API format and validate
    const apiData = {
      room_code: formData.ma_phong,
      room_name: formData.ten_phong,
      description: formData.mo_ta || "",
      coordinates: [
        { x: parseFloat(formData.x1) || 0, y: parseFloat(formData.y1) || 0 },
        { x: parseFloat(formData.x2) || 0, y: parseFloat(formData.y2) || 0 },
        { x: parseFloat(formData.x3) || 0, y: parseFloat(formData.y3) || 0 },
        { x: parseFloat(formData.x4) || 0, y: parseFloat(formData.y4) || 0 },
      ],
      // Convert trang_thai (1/0) to is_active (boolean)
      is_active: formData.trang_thai === 1 || formData.trang_thai === true,
    };

    // Validate
    const validationErrors = validateRoomForm(apiData);
    
    if (Object.keys(validationErrors).length > 0) {
      // Map validation errors back to form field names
      const mappedErrors = {};
      if (validationErrors.room_code) mappedErrors.ma_phong = validationErrors.room_code;
      if (validationErrors.room_name) mappedErrors.ten_phong = validationErrors.room_name;
      if (validationErrors.coordinates) mappedErrors.coordinates = validationErrors.coordinates;
      if (validationErrors.description) mappedErrors.mo_ta = validationErrors.description;
      
      setErrors(mappedErrors);
      return;
    }

    // Submit with API format
    if (onSubmit) {
      onSubmit(apiData);
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
      <div className="fixed inset-y-0 right-0 z-[1000] w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
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
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Đang tải thông tin...</span>
            </div>
          ) : !roomData ? (
            <div className="flex items-center justify-center py-20 text-gray-500">
              Không có dữ liệu phòng học
            </div>
          ) : (
          <div className="grid grid-cols-1 gap-4">{/* Existing form fields */}
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
              {errors.ma_phong && (
                <p className="text-xs text-red-500 mt-1">{errors.ma_phong}</p>
              )}
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
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.ten_phong ? "border-red-500" : ""
                }`}
              />
              {errors.ten_phong && (
                <p className="text-xs text-red-500 mt-1">{errors.ten_phong}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="mo_ta"
                value={formData.mo_ta}
                onChange={handleChange}
                placeholder="Mô tả về phòng học..."
                rows={3}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  errors.mo_ta ? "border-red-500" : ""
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 500 ký tự</p>
              {errors.mo_ta && (
                <p className="text-xs text-red-500 mt-1">{errors.mo_ta}</p>
              )}
            </div>

            <div className="border-t mt-2">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Tọa độ điểm 1
              </h4>
              {errors.coordinates && (
                <p className="text-xs text-red-500 mb-2">{errors.coordinates}</p>
              )}
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
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates ? "border-red-500" : ""
                    }`}
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
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates ? "border-red-500" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="border-t mt-2">
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
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates ? "border-red-500" : ""
                    }`}
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
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates ? "border-red-500" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="border-t mt-2">
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
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates ? "border-red-500" : ""
                    }`}
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
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates ? "border-red-500" : ""
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="border-t mt-2">
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
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates ? "border-red-500" : ""
                    }`}
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
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.coordinates ? "border-red-500" : ""
                    }`}
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
                value={Number(formData.trang_thai)}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>Hoạt động</option>
                <option value={0}>Không hoạt động</option>
              </select>
            </div>

          </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t bg-white/90 backdrop-blur">{!loading && roomData && (
          <>
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
          </>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalEditRoom;
