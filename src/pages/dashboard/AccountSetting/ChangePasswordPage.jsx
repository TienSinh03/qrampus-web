import React, { useState } from 'react';
import { Upload, X, Eye, EyeOff } from 'lucide-react';

const AccountPage = () => {
    const [activeTab, setActiveTab] = useState('tài khoản'); // Active tab state
    const [avatar, setAvatar] = useState(null);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.size <= 800 * 1024) { // Giới hạn 800KB
            setAvatar(URL.createObjectURL(file));
        } else if (file) {
            alert('File quá lớn! Kích thước tối đa là 800KB.');
        }
    };

    const resetAvatar = () => setAvatar(null);

    // Toggle password visibility
    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý thay đổi mật khẩu ở đây
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);
        console.log('Confirm Password:', confirmPassword);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto px-4 sm:px-4 lg:px-4">
                {/* Tabs */}
                <div className="flex space-x-8 border-b border-gray-200 mb-8">
                    {['Tài khoản', 'Security'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`pb-4 px-2 text-lg font-medium transition-colors relative ${activeTab === tab.toLowerCase()
                                ? 'text-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                            {activeTab === tab.toLowerCase() && (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"></span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Account Tab Content */}
                {activeTab === 'tài khoản' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col md:flex-row items-start space-x-0 md:space-x-8 mb-10">
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <img
                                        src={avatar || 'https://www.w3schools.com/w3images/avatar2.png'}
                                        alt="Avatar"
                                        className="w-28 h-28 rounded-full object-cover border-4 border-gray-100 shadow-md"
                                    />
                                    {avatar && (
                                        <button
                                            onClick={resetAvatar}
                                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg border border-gray-300 hover:bg-gray-50"
                                        >
                                            <X className="w-5 h-5 text-gray-600" />
                                        </button>
                                    )}
                                </div>

                                <div className="mt-4 text-center">
                                    <label className="cursor-pointer">
                                        <span className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Tải lên hình ảnh mới
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <button
                                        onClick={resetAvatar}
                                        className="block mt-2 text-red-600 text-sm hover:text-red-700 font-medium"
                                    >
                                        Đặt lại
                                    </button>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Cho phép JPG, GIF hoặc PNG. Kích thước tối đa 800K
                                    </p>
                                </div>
                            </div>

                            {/* Form Grid */}
                            <div className="flex-1 space-y-6">
                                {/* Các trường thông tin tài khoản */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên Giảng viên</label>
                                        <input
                                            type="text"
                                            defaultValue="Nguyễn Văn A"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nã nhân sự</label>
                                        <input
                                            type="text"
                                            defaultValue="1012345"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                {/* Các trường thông tin khác */}
                                {/* ... */}

                                {/* Liên kết đến trang thay đổi mật khẩu */}
                                <div className="pt-4">
                                    <button
                                        onClick={() => setActiveTab('security')}
                                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                                    >
                                        Thay đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Change Password Tab Content */}
                {activeTab === 'security' && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Change Password</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Current Password */}
                            <div>
                                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">Current Password</label>
                                <div className="relative mt-1">
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        id="current-password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleCurrentPasswordVisibility}
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                                    >
                                        {showCurrentPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                                <div className="relative mt-1">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="new-password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleNewPasswordVisibility}
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                                    >
                                        {showNewPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <div className="relative mt-1">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirm-password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}
                                    className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountPage;
