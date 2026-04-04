import React from 'react'
import './App.css'
import AppRoutes from './routes/AppRoute.jsx'
import { AuthProvider } from '@contexts/AuthContext'
import { TeacherScheduleProvider } from '@contexts/TeacherScheduleContext';

import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <TeacherScheduleProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </TeacherScheduleProvider>
    </AuthProvider>

  )
}

export default App