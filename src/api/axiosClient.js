import axios from 'axios';
import { API_BASE_URL } from '@constants/config';
import { AUTH_ENDPOINTS } from '@constants/endpoints';

/**
 * Axios client instance với interceptors
 */
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Thêm token vào mỗi request
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Xử lý refresh token khi access token hết hạn
 */
let isRefreshing = false;
let failedQueue = [];

const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    // Navigate without full reload so React Router can handle the route change.
    window.history.pushState({}, '', '/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data trực tiếp nếu có
    if (response.data) {
      return response.data;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi không phải 401 hoặc đã retry rồi, reject luôn
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Nếu request là refresh token mà lỗi, logout luôn
    if (originalRequest.url?.includes(AUTH_ENDPOINTS.REFRESH)) {
      // Clear tokens và redirect về login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      redirectToLogin();
      return Promise.reject(error);
    }

    // Nếu đang refresh, thêm request vào queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      isRefreshing = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      redirectToLogin();
      return Promise.reject(error);
    }

    try {
      // Gọi API refresh token
      const response = await axios.post(
        `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`,
        { refresh_token: refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { accessToken, user, refreshToken: newRefreshToken } = response.data.data;

      // Lưu token mới
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Cập nhật token cho request gốc
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Process các request đang chờ trong queue
      processQueue(null, accessToken);

      isRefreshing = false;

      // Retry request gốc với token mới
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      isRefreshing = false;

      // Clear tokens và redirect về login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      redirectToLogin();

      return Promise.reject(refreshError);
    }
  }
);

export default axiosClient;
