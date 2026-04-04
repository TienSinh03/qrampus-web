import React from 'react'
import './App.css'
import AppRoutes from './routes/AppRoute.jsx'
import { AuthProvider } from '@contexts/AuthContext'
import { TeacherScheduleProvider } from '@contexts/TeacherScheduleContext';
import { ClassSessionStudentsProvider } from '@contexts/ClassSessionStudentsContext';

import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <TeacherScheduleProvider>
        <ClassSessionStudentsProvider>
          <AppRoutes />
          <Toaster position="top-right" richColors />
        </ClassSessionStudentsProvider>
      </TeacherScheduleProvider>
    </AuthProvider>

  )
}

export default App