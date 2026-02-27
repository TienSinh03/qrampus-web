# Role-Based Routing & Authentication System

## Tổng quan

Hệ thống authentication và role-based routing đã được tích hợp với backend API. Khi user login, hệ thống sẽ:

1. Gọi API login và nhận về `accessToken`, `refreshToken`, và thông tin user (bao gồm `roles`)
2. Lưu tokens và user info vào localStorage
3. Tự động redirect user đến trang phù hợp với role của họ
4. Tự động refresh access token khi hết hạn

## Cấu trúc thư mục

```
src/
├── api/                      # Axios client configuration
│   └── axiosClient.js       # Axios instance với interceptors (auto refresh token)
│
├── services/                 # API service modules
│   └── AuthService.js       # Authentication APIs
│
├── constants/               # Constants và configs
│   ├── apiEndpoints.js     # Định nghĩa tất cả API endpoints
│   └── roles.js            # Role constants và helper functions
│
├── config/                  # Application configs
│   └── roleRoutes.js       # Role-based routing configuration
│
├── contexts/                # React contexts
│   └── AuthContext.jsx     # Authentication context với real API
│
├── hooks/                   # Custom hooks
│   └── useRole.js          # Hook để làm việc với roles
│
├── routes/                  # Route components
│   ├── AppRoute.jsx        # Main router configuration
│   ├── PrivateRoute.jsx    # Protected route (requires login)
│   ├── PublicRoute.jsx     # Public route (redirect if logged in)
│   └── RoleRoute.jsx       # Role-based route protection
│
└── components/
    └── common/
        └── DashboardRedirect.jsx  # Auto redirect based on role
```

## Roles trong hệ thống

Hệ thống hỗ trợ 4 loại roles (khớp với backend):

- `admin` - Quản trị viên
- `teacher` - Giảng viên
- `student` - Sinh viên
- `attendance_staff` - Nhân viên điểm danh

## Cách sử dụng

### 1. Login

```javascript
import { useAuth } from '@contexts/AuthContext';

const { login } = useAuth();

// Login với username và password
const result = await login('21010611', 'password123');

if (result.success) {
  // User data với roles
  const { user } = result.data;
  console.log(user.roles); // ['admin']
}
```

### 2. Check User Roles

#### Sử dụng useRole hook

```javascript
import { useRole } from '@hooks/useRole';

const MyComponent = () => {
  const { 
    isAdmin, 
    isTeacher, 
    isStudent,
    checkRole,
    checkAnyRole 
  } = useRole();

  if (isAdmin) {
    return <AdminPanel />;
  }

  if (checkAnyRole(['teacher', 'admin'])) {
    return <TeacherFeature />;
  }

  return <DefaultView />;
};
```

#### Sử dụng AuthContext trực tiếp

```javascript
import { useAuth } from '@contexts/AuthContext';
import { ROLES, hasRole } from '@constants/roles';

const MyComponent = () => {
  const { user } = useAuth();
  const userRoles = user?.roles || [];

  if (hasRole(userRoles, ROLES.ADMIN)) {
    return <AdminFeature />;
  }

  return <DefaultFeature />;
};
```

### 3. Protected Routes

#### Route yêu cầu login

```javascript
import { PrivateRoute } from '@routes/PrivateRoute';

<PrivateRoute>
  <MyProtectedPage />
</PrivateRoute>
```

#### Route cần role cụ thể

```javascript
import { RoleRoute } from '@routes/RoleRoute';
import { ROLES } from '@constants/roles';

// Chỉ admin và teacher truy cập được
<RoleRoute requiredRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
  <AdminTeacherPage />
</RoleRoute>
```

### 4. Gọi API với Authentication

API client tự động thêm Bearer token vào headers:

```javascript
import axiosClient from '@api/axiosClient';

// GET request
const data = await axiosClient.get('/api/v1/users');

// POST request
const result = await axiosClient.post('/api/v1/courses', {
  title: 'New Course'
});
```

Token sẽ tự động refresh khi hết hạn.

### 5. Menu/Sidebar dựa trên Role

```javascript
import { useRole } from '@hooks/useRole';

const Sidebar = () => {
  const { accessibleRoutes, isAdmin, isTeacher } = useRole();

  return (
    <nav>
      {isAdmin && (
        <MenuItem href="/dashboard/admin/accounts">
          Quản lý tài khoản
        </MenuItem>
      )}

      {isTeacher && (
        <MenuItem href="/dashboard/schedule">
          Lịch giảng
        </MenuItem>
      )}

      {/* Hoặc render động */}
      {accessibleRoutes.map(route => (
        <MenuItem key={route.path} href={route.path}>
          {route.label}
        </MenuItem>
      ))}
    </nav>
  );
};
```

### 6. Route Configuration

Routes cho mỗi role được định nghĩa trong `src/config/roleRoutes.js`:

```javascript
export const ADMIN_ROUTES = [
  { path: '/dashboard/admin/accounts', label: 'Quản lý tài khoản' },
  // ...
];

export const TEACHER_ROUTES = [
  { path: '/dashboard/schedule', label: 'Lịch giảng' },
  // ...
];
```

Để thêm route mới cho một role, cập nhật array tương ứng.

## API Response Format

### Login Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": {
      "id": "650e8400-e29b-41d4-a716-446621010611",
      "user_name": "21010611",
      "roles": ["admin"]
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Invalid credentials",
  "error": "AUTHENTICATION_FAILED"
}
```

## Environment Variables

Tạo file `.env` từ `.env.example`:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
```

## Auto Refresh Token

Axios interceptor tự động xử lý refresh token:

1. Khi nhận 401 response
2. Gọi API refresh token
3. Lưu access token mới
4. Retry request gốc
5. Nếu refresh token hết hạn → Logout và redirect về login

## Logout

```javascript
import { useAuth } from '@contexts/AuthContext';

const { logout, logoutAll } = useAuth();

// Logout khỏi thiết bị hiện tại
await logout();

// Logout khỏi tất cả thiết bị
await logoutAll();
```

## Default Routes by Role

Khi user login hoặc truy cập `/dashboard`, họ sẽ được redirect đến:

- **Admin** → `/dashboard/admin/qrcode`
- **Teacher** → `/dashboard`
- **Attendance Staff** → `/dashboard/attendance-dashboard`
- **Student** → `/dashboard`

Priority: Admin > Teacher > Attendance Staff > Student

## Thêm Route mới

1. Thêm route vào `src/routes/AppRoute.jsx`
2. Thêm vào role config trong `src/config/roleRoutes.js`
3. (Optional) Thêm route protection nếu cần

## Testing

### Test với các accounts

Backend có thể có sẵn test accounts với các roles khác nhau. Kiểm tra với backend team để lấy test credentials.

### Mock roles trong development

```javascript
// Trong AuthContext hoặc dev tools
localStorage.setItem('user', JSON.stringify({
  id: 'test-id',
  user_name: 'test-user',
  roles: ['admin', 'teacher']
}));
```

## Troubleshooting

### Token hết hạn liên tục
- Kiểm tra thời gian expire của token trong backend
- Kiểm tra clock sync giữa client và server

### 403 Forbidden trên route cụ thể
- Kiểm tra role của user: `console.log(user.roles)`
- Kiểm tra route config trong `roleRoutes.js`
- Verify backend có bảo vệ route với role tương ứng không

### API không kèm token
- Kiểm tra token có được lưu trong localStorage không
- Check axios interceptor có chạy không
- Verify header format: `Authorization: Bearer <token>`

## Best Practices

1. **Luôn check roles ở cả frontend và backend**
   - Frontend check để show/hide UI
   - Backend check để bảo mật thực sự

2. **Sử dụng constants cho roles**
   ```javascript
   // ❌ Bad
   if (user.roles.includes('admin'))
   
   // ✅ Good
   if (hasRole(userRoles, ROLES.ADMIN))
   ```

3. **Handle loading states**
   ```javascript
   const { user, loading } = useAuth();
   
   if (loading) return <Spinner />;
   ```

4. **Clear tokens on logout**
   - Luôn gọi logout API
   - Clear localStorage
   - Redirect về login page

5. **Don't store sensitive data**
   - Chỉ lưu tokens và basic user info
   - Không lưu passwords hoặc sensitive data

## API Services

Tạo service mới theo mẫu:

```javascript
// src/services/user.service.js
import axiosClient from '@api/axiosClient';
import { USER_ENDPOINTS } from '@constants/apiEndpoints';

class UserService {
  async getProfile() {
    return await axiosClient.get(USER_ENDPOINTS.PROFILE);
  }

  async updateProfile(data) {
    return await axiosClient.put(USER_ENDPOINTS.PROFILE, data);
  }
}

export default new UserService();
```
