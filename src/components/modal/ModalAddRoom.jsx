import React, { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import roomService from "../../services/room.service";
import {
  validateRoomCode,
  validateRoomName,
  validateCoordinates,
  validateDescription,
} from "../../utils/validation/roomValidation";

const ModalAddRoom = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    room_code: "",
    room_name: "",
    description: "",
    coordinates: [
      { x: "", y: "" },
      { x: "", y: "" },
      { x: "", y: "" },
      { x: "", y: "" },
    ],
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCoordinateChange = (index, field, value) => {
    const newCoordinates = [...formData.coordinates];
    newCoordinates[index] = {
      ...newCoordinates[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, coordinates: newCoordinates }));
    
    // Clear coordinate error when user types
    if (errors.coordinates) {
      setErrors((prev) => ({ ...prev, coordinates: "" }));
    }
  };

  const handleBlur = (field) => {
    let error = "";
    
    switch (field) {
      case "room_code":
        error = validateRoomCode(formData.room_code);
        break;
      case "room_name":
        error = validateRoomName(formData.room_name);
        break;
      case "description":
        error = validateDescription(formData.description);
        break;
      default:
        break;
    }
    
    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const roomCodeError = validateRoomCode(formData.room_code);
    if (roomCodeError) newErrors.room_code = roomCodeError;
    
    const roomNameError = validateRoomName(formData.room_name);
    if (roomNameError) newErrors.room_name = roomNameError;
    
    // Convert coordinates to proper format for validation
    const coordsForValidation = formData.coordinates.map(coord => ({
      x: coord.x === "" ? NaN : parseFloat(coord.x),
      y: coord.y === "" ? NaN : parseFloat(coord.y),
    }));
    
    const coordinatesError = validateCoordinates(coordsForValidation);
    if (coordinatesError) newErrors.coordinates = coordinatesError;
    
    const descriptionError = validateDescription(formData.description);
    if (descriptionError) newErrors.description = descriptionError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setLoading(true);
    
    try {
      // Convert coordinates to proper format
      const coordinates = formData.coordinates.map(coord => ({
        x: parseFloat(coord.x),
        y: parseFloat(coord.y),
      }));
      
      const payload = {
        room_code: formData.room_code.trim(),
        room_name: formData.room_name.trim(),
        coordinates,
        description: formData.description?.trim() || "",
        is_active: formData.is_active,
      };
      
      const response = await roomService.createRoom(payload);
      
      if (response && response.success) {
        toast.success("Thêm phòng học thành công!");
        handleReset();
        onClose();
        
        // Call parent callback to refresh list
        if (onSubmit) {
          onSubmit(response.data);
        }
      } else {
        toast.error(response?.message || "Không thể thêm phòng học");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      toast.error(error.message || "Đã có lỗi xảy ra khi thêm phòng học");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      room_code: "",
      room_name: "",
      description: "",
      coordinates: [
        { x: "", y: "" },
        { x: "", y: "" },
        { x: "", y: "" },
        { x: "", y: "" },
      ],
      is_active: true,
    });
    setErrors({});
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
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-cyan-100">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Thêm phòng học mới
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none rounded-full hover:bg-cyan-400 transition-all duration-300 ease-in-out p-2 hover:rotate-90"
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
                name="room_code"
                value={formData.room_code}
                onChange={handleChange}
                onBlur={() => handleBlur("room_code")}
                placeholder="Ví dụ: B1.04 hoặc T1.10"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.room_code ? "border-red-500 focus:ring-red-500" : "focus:ring-cyan-500"
                }`}
              />
              {errors.room_code && (
                <p className="text-red-500 text-xs mt-1">{errors.room_code}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên phòng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="room_name"
                value={formData.room_name}
                onChange={handleChange}
                onBlur={() => handleBlur("room_name")}
                placeholder="Ví dụ: Phòng A101 - Giảng đường"
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.room_name ? "border-red-500 focus:ring-red-500" : "focus:ring-cyan-500"
                }`}
              />
              {errors.room_name && (
                <p className="text-red-500 text-xs mt-1">{errors.room_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={() => handleBlur("description")}
                placeholder="Ví dụ: Phòng giảng dạy 50 chỗ ngồi"
                rows={3}
                className={`w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 ${
                  errors.description ? "border-red-500 focus:ring-red-500" : "focus:ring-cyan-500"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div className="border-t pt-4 mt-2">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700">
                  Tọa độ 4 điểm <span className="text-red-500">*</span>
                </h4>
                {errors.coordinates && (
                  <p className="text-red-500 text-xs">{errors.coordinates}</p>
                )}
              </div>
              
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                  <h5 className="text-xs font-medium text-gray-600 mb-2">
                    Điểm {index + 1}
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        X{index + 1} (Longitude: -180 đến 180)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.coordinates[index].x}
                        onChange={(e) => handleCoordinateChange(index, "x", e.target.value)}
                        placeholder="10.5"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Y{index + 1} (Latitude: -90 đến 90)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.coordinates[index].y}
                        onChange={(e) => handleCoordinateChange(index, "y", e.target.value)}
                        placeholder="20.3"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="is_active"
                value={formData.is_active}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.value === "true" }))}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="true">Hoạt động</option>
                <option value="false">Không hoạt động</option>
              </select>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t bg-white/90 backdrop-blur">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Đặt lại
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg border border-cyan-600 text-cyan-600 hover:bg-cyan-50 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang thêm...
              </>
            ) : (
              "Thêm phòng"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default ModalAddRoom;
