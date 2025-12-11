import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

import LoginPage from "@pages/auth/LoginPage";
import RegisterPage from "@pages/auth/RegisterPage";
import DashboardPage from "@pages/dashboard/DashboardPage";
import SchedulePage from "@pages/dashboard/SchedulePage";
import UsersPage from "@pages/dashboard/UsersPage";
import QRPage from "@pages/dashboard/QRPage";
import StudySessionPage from "@pages/dashboard/StudySession/StudySessionPage";
import ResultQRPage from "@pages/dashboard/ResultsQR/ResultQRPage";
import ResultQRextendPage from "../pages/dashboard/ResultsQR/ResultQRextendPage";
import ResultQRDetailUserPage from "../pages/dashboard/ResultsQR/ResultQRDetailUserPage";
import AccountPage from "@pages/dashboard/AccountSetting/AccountPage";
import QRViewPage from "../pages/dashboard/QRViewPage";
import Timekeeping from "../pages/dashboard/Timekeeping";
import SurveyPage from "../pages/dashboard/SurveyPage";
import LeavePage from "../pages/dashboard/LeavePage";
import AnnouncementPage from "../pages/dashboard/AnnouncementPage";
import Setting from "../pages/dashboard/SettingPage";

import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";

import LayoutMain from "@components/layout/LayoutMain";

// Router setup
const router = createBrowserRouter([
  // Public routes (no login required)
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

  // Private routes (requires login)
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
        element: <UsersPage />,
      },
      {
        path: "schedule",
        element: <SchedulePage />,
      },
      {
        path: "reports",
        element: <div className="p-8"><h1 className="text-2xl font-bold">Báo cáo</h1></div>,
      },
      {
        path: "qrcode",
        element: <QRPage />,
      },
      {
        path: "study-session",
        element: <StudySessionPage />,
      },
      {
        path: "results-qr",
        element: <ResultQRPage />,
      },
      {
        path: "results-qr-extend",
        element: <ResultQRextendPage />,
      },
      {
        path: "results-qr-detail-user",
        element: <ResultQRDetailUserPage />,
      },
      {
        path: "account-setting",
        element: <AccountPage />,
      },
      {
        path: "qrcode-fullscreen",
        element: <QRViewPage />,
      },
      {
        path: "timekeeping",
        element: <Timekeeping />,
      },
      {
        path: "survey-page",
        element: <SurveyPage />,
      },
      {
        path: "leave-management",
        element: <LeavePage />,
      },
      {
        path: "notifications",
        element: <AnnouncementPage />,
      }, {
        path: "setting",
        element: <Setting />,
      }
    ],
  },

  // Catch-all route to redirect to login page
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

// RouterProvider component to pass the router object
const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
