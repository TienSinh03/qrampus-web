import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import LoginPage from "@pages/auth/LoginPage";
import RegisterPage from "@pages/auth/RegisterPage";
import ChangePasswordPage from "@pages/dashboard/AccountSetting/ChangePasswordPage";
import DashboardPage from "@pages/dashboard/DashboardPage";
import SchedulePage from "@pages/dashboard/SchedulePage";
import UsersPage from "@pages/dashboard/UsersPage";
import QRPage from "@pages/dashboard/QRPage";
import StudySessionPage from "@pages/dashboard/StudySession/StudySessionPage";
import ResultQRPage from "@pages/dashboard/ResultsQR/ResultQRPage";
import ResultQRextendPage from "../pages/dashboard/ResultsQR/ResultQRextendPage";
import ResultQRDetailUserPage from "../pages/dashboard/ResultsQR/ResultQRDetailUserPage";
import ResultQRextendStudentPage from "../pages/dashboard/ResultsQR/ResultQRextendStudentPage";
import AccountPage from "@pages/dashboard/AccountSetting/AccountPage";
import QRViewPage from "../pages/dashboard/QRViewPage";
import Timekeeping from "../pages/dashboard/Timekeeping";
import SurveyPage from "../pages/dashboard/SurveyPage";
import LeavePage from "../pages/dashboard/LeavePage";
import AnnouncementPage from "../pages/dashboard/AnnouncementPage";
import Setting from "../pages/dashboard/SettingPage";
import ReportPage from "../pages/dashboard/ReportPage";

// ADMIN
import AdminQRPage from "@pages/dashboard/admin/AdminQRPage";
import AdminQRDetailPage from "@pages/dashboard/admin/AdminQRDetailPage";
import AdminDetailSessionQRPage from "@pages/dashboard/admin/AdminDetailSessionQRPage";
import AdminStudentPage from "@pages/dashboard/admin/AdminStudentPage";
import AdminTeacherPage from "@pages/dashboard/admin/AdminTeacherPage";
import AdminAccountPage from "@pages/dashboard/admin/AdminAccountPage";
import AdminSurveyPage from "@pages/dashboard/admin/AdminSurveyPage";
import AdminSchedulePage from "@pages/dashboard/admin/AdminSchedulePage";
import AdminCoursePage from "@pages/dashboard/admin/AdminCoursePage";
import AdminEnrollPage from "@pages/dashboard/admin/AdminEnrollPage";
import AdminRoomPage from "../pages/dashboard/admin/AdminRoomPage";



// attendance 
import AttendanceDashboardPage from "@pages/dashboard/departmentAttendance/AttendanceDashboardPage";

import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import RoleSwitchPage from "@pages/dashboard/RoleSwitchPage";

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
  {
    path: "/role",
    element: <RoleSwitchPage />,
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
        element: (
          <div className="p-8">
            <h1 className="text-2xl font-bold">Báo cáo</h1>
          </div>
        ),
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
        path: "change-password",
        element: <ChangePasswordPage />,
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
      },
      {
        path: "setting",
        element: <Setting />,
      },
      {
        path: "report-page",
        element: <ReportPage />,
      },
      {
        path: "results-qr-extend-student",
        element: <ResultQRextendStudentPage />,
      },

      // ADMIN ROUTES
      {
        path: "admin/qrcode",
        element: <AdminQRPage />,
      },
      {
        path: "admin/qrcode/session/qrcode-detail",
        element: <AdminQRDetailPage />,
      },
      {
        path: "admin/qrcode/session/qrcode-detail/session-detail",
        element: <AdminDetailSessionQRPage />,
      }, {
        path: "admin/students",
        element: <AdminStudentPage />,
      }, {
        path: "admin/teachers",
        element: <AdminTeacherPage />,
      }, {
        path: "admin/accounts",
        element: <AdminAccountPage />,

      }, {
        path: "admin/surveys",
        element: <AdminSurveyPage />,
      }, {
        path: "admin/schedules",
        element: <AdminSchedulePage />,
      }, {
        path: "admin/courses",
        element: <AdminCoursePage />,
      }, {
        path: "admin/enrollments",
        element: <AdminEnrollPage />,
      },{
        path: "admin/rooms",
        element: <AdminRoomPage />,
      },















      // attendance department dashboard
      {
        path: "attendance-dashboard",
        element: <AttendanceDashboardPage />,
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
