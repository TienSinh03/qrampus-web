import React, { useState, useEffect } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import personnelService from "@services/personnel.service";
import ProfileSkeleton from "@components/layout/ProfileSkeleton";
import LoadingSpinner from "@components/layout/LoadingSpinner";

const AccountPage = () => {
  const [avatar, setAvatar] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
                {avatar && avatar !== profile.avatar_url && (
                  <button
                    onClick={() => setAvatar(profile.avatar_url || null)}
                    className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              <label className="mt-4 cursor-pointer">
                <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
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
                <Input label="Họ và tên" value={profile.full_name || ""} readOnly />
                <Input label="Mã nhân sự" value={profile.teacher_code || ""} readOnly />
                <Input label="Email" value={profile.email || ""} readOnly />
                <Input label="Điện thoại" value={profile.phone || ""} readOnly />
                <Input label="Khoa / Phòng ban" value={profile.department || ""} readOnly />
                <Input label="Ngày sinh" type="date" value={profile.dob || ""} readOnly />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => navigate("/dashboard/change-password")}
                  className="px-6 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

const Input = ({ label, readOnly, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      {...props}
      readOnly={readOnly}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
        readOnly ? 'bg-gray-50 text-gray-600 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

export default AccountPage;
