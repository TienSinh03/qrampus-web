import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import LoginPage from "@pages/auth/LoginPage";
import RegisterPage from "@pages/auth/RegisterPage";
import DashboardPage from "@pages/dashboard/DashboardPage";
import SchedulePage from "@pages/dashboard/SchedulePage";


import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";

import LayoutMain from "@components/layout/LayoutMain";

const router = createBrowserRouter([
  // Dành cho các trang không cần đăng nhập
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },

  // Dành cho các trang cần đăng nhập
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <LayoutMain />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "users",
        element: <div className="p-8"><h1 className="text-2xl font-bold">Quản lý người dùng</h1></div>,
      },
      {
        path: "schedule",
        element:  <SchedulePage />,
      },
      {
        path: "reports",
        element: <div className="p-8"><h1 className="text-2xl font-bold">Báo cáo</h1></div>,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
