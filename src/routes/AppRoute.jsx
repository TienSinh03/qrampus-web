import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import LoginPage from "@pages/auth/LoginPage";
import RegisterPage from "@pages/auth/RegisterPage";
import ChangePasswordPage from "@pages/dashboard/AccountSetting/ChangePasswordPage";

// giảng viên
import DashboardPage from "@pages/dashboard/teacher/DashboardPage";
import SchedulePage from "@pages/dashboard/teacher/SchedulePage";
import QRPage from "@pages/dashboard/teacher/QRPage";
import StudySessionPage from "@pages/dashboard/StudySession/StudySessionPage";
import ResultQRPage from "@pages/dashboard/ResultsQR/ResultQRPage";
import ResultQRDetailUserPage from "../pages/dashboard/ResultsQR/ResultQRDetailUserPage";
import ResultQRextendStudentPage from "../pages/dashboard/ResultsQR/ResultQRextendStudentPage";
import AccountPage from "@pages/dashboard/AccountSetting/AccountPage";
import QRViewPage from "../pages/dashboard/teacher/QRViewPage";
import Timekeeping from "../pages/dashboard/teacher/Timekeeping";
import SurveyPage from "../pages/dashboard/teacher/SurveyPage";
import LeavePage from "../pages/dashboard/teacher/LeavePage";
import AnnouncementPage from "../pages/dashboard/teacher/AnnouncementPage";
import Setting from "../pages/dashboard/teacher/SettingPage";
import ReportPage from "../pages/dashboard/teacher/ReportPage";

// ADMIN
import AdminDashboardPage from "@pages/dashboard/admin/AdminDashboardPage";
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
import AdminDetailSurveyPage from "../pages/dashboard/admin/AdminDetailSurveyPage";
import AdminResultQRPage from "../pages/dashboard/admin/AdminResultQRPage";

// attendance 
import AttendanceDashboardPage from "@pages/dashboard/departmentAttendance/AttendanceDashboardPage";
import AttendanceTimesheetManagementPage from "@pages/dashboard/departmentAttendance/AttendanceTimesheetManagementPage";
import AttendanceTeacherPage from "@pages/dashboard/departmentAttendance/AttendanceTeacherPage";
import AttendanceSchedulePage from "@pages/dashboard/departmentAttendance/AttendanceSchedulePage";
import AttendanceSessionQRPage from "@pages/dashboard/departmentAttendance/AttendanceSessionQRPage";


// chung
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { RoleRoute } from "./RoleRoute";
import RoleSwitchPage from "@pages/dashboard/RoleSwitchPage";
import DashboardRedirect from "../components/common/DashboardRedirect";

import LayoutMain from "@components/layout/LayoutMain";
import { ROLES } from "@constants/roles";
import { useAttendance } from "@contexts/AttendanceContext";

const RequireActiveAttendanceSession = ({ children }) => {
  const { getSessionTiming } = useAttendance();
  const hasActiveSession = Boolean(getSessionTiming());

  if (!hasActiveSession) {
    return <Navigate to="/dashboard/schedule" replace />;
  }

  return children;
};

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
        element: <DashboardRedirect />,
      },
      // TEACHER ROUTES - Schedule
      {
        path: "schedule",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <SchedulePage />
          </RoleRoute>
        ),
      },
      // TEACHER ROUTES - Reports
      {
        path: "reports",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <div className="p-8">
              <h1 className="text-2xl font-bold">Báo cáo</h1>
            </div>
          </RoleRoute>
        ),
      },
      // TEACHER ROUTES - QR Code Management
      {
        path: "qrcode",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <RequireActiveAttendanceSession>
              <QRPage />
            </RequireActiveAttendanceSession>
          </RoleRoute>
        ),
      },
      // TEACHER ROUTES - Study Session
      {
        path: "study-session",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <StudySessionPage />
          </RoleRoute>
        ),
      },
      // TEACHER ROUTES - Results QR
      {
        path: "results-qr",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <ResultQRPage />
          </RoleRoute>
        ),
      },
      {
        path: "results-qr-detail-user",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <ResultQRDetailUserPage />
          </RoleRoute>
        ),
      },
      {
        path: "results-qr-extend-student",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <ResultQRextendStudentPage />
          </RoleRoute>
        ),
      },
      {
        path: "account-setting",
        element: <AccountPage />,
      },
      {
        path: "change-password",
        element: <ChangePasswordPage />,
      },
      // TEACHER ROUTES - QR Fullscreen
      {
        path: "qrcode-fullscreen",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <QRViewPage />
          </RoleRoute>
        ),
      },
      // TEACHER ROUTES - Timekeeping
      {
        path: "timekeeping",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <Timekeeping />
          </RoleRoute>
        ),
      },
      // TEACHER ROUTES - Survey
      {
        path: "survey-page",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <SurveyPage />
          </RoleRoute>
        ),
      },
      // TEACHER ROUTES - Leave Management
      {
        path: "leave-management",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <LeavePage />
          </RoleRoute>
        ),
      },
      // ALL ROLES - Notifications
      {
        path: "notifications",
        element: <AnnouncementPage />,
      },
      // TEACHER ROUTES - Settings
      {
        path: "setting",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <Setting />
          </RoleRoute>
        ),
      },
      // TEACHER ROUTES - Report Page
      {
        path: "report-page",
        element: (
          <RoleRoute requiredRoles={[ROLES.TEACHER]}>
            <ReportPage />
          </RoleRoute>
        ),
      },

      // ==================== ADMIN ROUTES ====================
      // Admin Dashboard (Main)
      {
        path: "admin",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminDashboardPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/dashboard",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminDashboardPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/qrcode",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminQRPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/qrcode/session/qrcode-detail",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminQRDetailPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/qrcode/session/qrcode-detail/session-detail",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminDetailSessionQRPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/students",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminStudentPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/teachers",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminTeacherPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/accounts",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminAccountPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/surveys",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminSurveyPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/schedules",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminSchedulePage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/courses",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminCoursePage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/enrollments",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminEnrollPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/rooms",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminRoomPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/surveys/detail-survey",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}>
            <AdminDetailSurveyPage />
          </RoleRoute>
        ),
      },
      {
        path: "admin/results-qr",
        element: (
          <RoleRoute requiredRoles={[ROLES.ADMIN]}> 
            <AdminResultQRPage />
          </RoleRoute>
        ),
      },















      // ==================== ATTENDANCE STAFF ROUTES ====================
      {
        path: "attendance-dashboard",
        element: (
          <RoleRoute requiredRoles={[ROLES.ATTENDANCE_STAFF]}>
            <AttendanceDashboardPage />
          </RoleRoute>
        ),

      },
      {
        path: "attendance-timesheet",
        element: (
          <RoleRoute requiredRoles={[ROLES.ATTENDANCE_STAFF]}>
            <AttendanceTimesheetManagementPage />
          </RoleRoute>
        ),
      },
      {
        path: "attendance-teacher",
        element: (
          <RoleRoute requiredRoles={[ROLES.ATTENDANCE_STAFF]}>
            <AttendanceTeacherPage />
          </RoleRoute>
         ),
      },
      {
        path: "attendance-schedule",
        element: (
          <RoleRoute requiredRoles={[ROLES.ATTENDANCE_STAFF]}>
            <AttendanceSchedulePage />
          </RoleRoute>
        ),  
      },
      {
        path: "attendance-results",
        element: (
          <RoleRoute requiredRoles={[ROLES.ATTENDANCE_STAFF]}>
            <AttendanceSessionQRPage />
          </RoleRoute>
        )
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
