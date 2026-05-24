import React, { useState, useEffect } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import personnelService from "@services/personnel.service";
import userService from "@services/user.service";
import ProfileSkeleton from "@components/layout/ProfileSkeleton";
import LoadingSpinner from "@components/layout/LoadingSpinner";

const AccountPage = () => {
  const [avatar, setAvatar] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    teacher_code: "",
    full_name: "",
    dob: "",
    department: "",
    email: "",
    phone: "",
    office_hours: "",
  });
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await personnelService.getProfile();
      
      if (response.success) {
        setProfile(response.data);
        // Initialize form data with profile data
        setFormData({
          teacher_code: response.data.teacher_code || "",
          full_name: response.data.full_name || "",
          dob: response.data.dob || "",
          department: response.data.department || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          office_hours: response.data.office_hours || "",
        });
        if (response.data.avatar_url) {
          setAvatar(response.data.avatar_url);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Không thể tải thông tin cá nhân');
      toast.error('Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name || formData.full_name.trim() === "") {
      newErrors.full_name = "Họ và tên không được để trống";
    }

    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone || formData.phone.trim() === "") {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    }

    if (formData.dob && new Date(formData.dob) > new Date()) {
      newErrors.dob = "Ngày sinh không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      setUpdating(true);
      const response = await personnelService.updateProfile(formData);

      if (response.success) {
        setProfile(response.data);
        setIsEditing(false);
        toast.success("Cập nhật thông tin thành công!");
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.message || "Không thể cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profile) {
      setFormData({
        teacher_code: profile.teacher_code || "",
        full_name: profile.full_name || "",
        dob: profile.dob || "",
        department: profile.department || "",
        email: profile.email || "",
        phone: profile.phone || "",
        office_hours: profile.office_hours || "",
      });
    }
    setAvatar(profile?.avatar_url || null);
    setErrors({});
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 800 * 1024) {
      const previewUrl = URL.createObjectURL(file);
      setAvatar(previewUrl);

      try {
        setAvatarUploading(true);
        const avatarResponse = await userService.uploadMyAvatar(file);

        if (avatarResponse?.success && avatarResponse?.data?.avatar_url) {
          setProfile((prev) => prev ? { ...prev, avatar_url: avatarResponse.data.avatar_url } : prev);
          setAvatar(avatarResponse.data.avatar_url);
          toast.success("Cập nhật avatar thành công!");
        } else {
          throw new Error("Không thể cập nhật avatar");
        }
      } catch (err) {
        console.error('Error uploading avatar:', err);
        setAvatar(profile?.avatar_url || null);
        toast.error(err.message || "Không thể upload avatar. Vui lòng thử lại.");
      } finally {
        URL.revokeObjectURL(previewUrl);
        setAvatarUploading(false);
        e.target.value = "";
      }
    } else {
      alert("File quá lớn! Tối đa 800KB");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />
        
        {/* Loading State */}
        {loading && <ProfileSkeleton />}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-b-xl shadow-sm border p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không thể tải thông tin</h3>
                <p className="text-gray-600">{error}</p>
              </div>
              <button
                onClick={fetchProfile}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
              >
                <LoadingSpinner size="sm" color="white" className="hidden" />
                <span>Thử lại</span>
              </button>
            </div>
          </div>
        )}

        {/* Profile Content */}
        {!loading && !error && profile && (
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
                {avatar && avatar !== profile.avatar_url && !avatarUploading && (
                  <button
                    onClick={() => {
                      setAvatar(profile.avatar_url || null);
                    }}
                    className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <label className="mt-4 cursor-pointer">
                <span className={`inline-flex items-center px-4 py-2 text-white rounded-lg transition ${avatarUploading ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}>
                  <Upload className="w-4 h-4 mr-2" />
                  {avatarUploading ? "Đang tải..." : "Tải ảnh"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={avatarUploading}
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
                <Input 
                  label="Họ và tên" 
                  value={formData.full_name} 
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  readOnly={!isEditing}
                  error={errors.full_name}
                />
                <Input 
                  label="Mã nhân sự" 
                  value={formData.teacher_code} 
                  readOnly={true}
                  error={errors.teacher_code}
                />
                <Input 
                  label="Email" 
                  value={formData.email} 
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  readOnly={!isEditing}
                  error={errors.email}
                />
                <Input 
                  label="Điện thoại" 
                  value={formData.phone} 
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  readOnly={!isEditing}
                  error={errors.phone}
                />
                <Input 
                  label="Khoa / Phòng ban" 
                  value={formData.department} 
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  readOnly={!isEditing}
                  error={errors.department}
                />
                <Input 
                  label="Ngày sinh" 
                  type="date" 
                  value={formData.dob} 
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  readOnly={!isEditing}
                  error={errors.dob}
                />
                <Input 
                  label="Giờ làm việc" 
                  value={formData.office_hours} 
                  onChange={(e) => handleInputChange("office_hours", e.target.value)}
                  readOnly={!isEditing}
                  error={errors.office_hours}
                  placeholder="VD: T2,T3,T4"
                />
              </div>

              <div className="flex gap-4 pt-4">
                {!isEditing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => navigate("/dashboard/change-password")}
                      className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
                    >
                      Đổi mật khẩu
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={updating}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {updating ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={updating}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      Hủy
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, readOnly, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      readOnly={readOnly}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none ${
        readOnly ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
      } ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default AccountPage;
