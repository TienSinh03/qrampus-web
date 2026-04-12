import React from 'react'
import './App.css'
import AppRoutes from './routes/AppRoute.jsx'
import { AuthProvider } from '@contexts/AuthContext'
import { TeacherScheduleProvider } from '@contexts/TeacherScheduleContext';
import { ClassSessionStudentsProvider } from '@contexts/ClassSessionStudentsContext';
import { AttendanceProvider } from '@contexts/AttendanceContext';
import { LeaveDashboardProvider } from '@contexts/LeaveDashboardContext';

import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <TeacherScheduleProvider>
        <ClassSessionStudentsProvider>
          <AttendanceProvider>
            <LeaveDashboardProvider>
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </LeaveDashboardProvider>
          </AttendanceProvider>
        </ClassSessionStudentsProvider>
      </TeacherScheduleProvider>
    </AuthProvider>

  )
}

export default App