import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, IdCardLanyard, AlertCircle } from 'lucide-react';
import { useAuth } from '@contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ROLES } from '@constants/roles';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setActiveRole } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    staffCode: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    setErrorMessage(''); // Clear previous error

    if (!formData.staffCode) {
      newErrors.staffCode = 'Vui lòng nhập mã giảng viên';
    }

    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('errors.passwordMinLength');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessage('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);
    const result = await login(formData.staffCode, formData.password);
    setIsLoading(false);

    if (result.success) {
      const userData = result.data;
      const userRoles = userData?.roles || [];
      
    } else {
      // Hiển thị error message dưới dạng text, không dùng toast
      const message = result.error || 'Mã giảng viên hoặc mật khẩu không chính xác!';
      setErrorMessage(message);
      setErrors({ 
        staffCode: ' ',
        password: ' '
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-800" />

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <img
                src="/assets/images/logo-qrampus_TEXT.png"
                alt="Logo"
                className="h-16"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {t('auth.loginTitle')}
            </h1>
            <p className="text-gray-500">
              {t('auth.welcomeBack')}
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800 mb-1">Đăng nhập thất bại</p>
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Staff Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mã giảng viên
              </label>
              <div className="relative">
                <IdCardLanyard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="staffCode"
                  value={formData.staffCode}
                  onChange={handleChange}
                  placeholder="VD: 0123456"
                  className={`w-full pl-10 pr-4 py-3 border ${errors.staffCode
                      ? 'border-red-500'
                      : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.staffCode && (
                <p className="text-red-500 text-sm">
                  {errors.staffCode}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border ${errors.password
                      ? 'border-red-500'
                      : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {t('auth.forgotPassword')}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition disabled:opacity-50"
            >
              {isLoading
                ? t('auth.loggingIn')
                : t('auth.loginButton')}
            </button>
          </form>

          {/* Register */}
          <div className="text-center text-gray-600">
            {t('auth.noAccount')}{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 font-semibold"
            >
              {t('auth.registerNow')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
