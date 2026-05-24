import React from 'react'
import './App.css'
import AppRoutes from './routes/AppRoute.jsx'
import { AuthProvider } from '@contexts/AuthContext'
import { NotificationProvider } from '@contexts/NotificationContext';
import { PersonnelProfileProvider } from '@contexts/PersonnelProfileContext';
import { TeacherScheduleProvider } from '@contexts/TeacherScheduleContext';
import { ClassSessionStudentsProvider } from '@contexts/ClassSessionStudentsContext';
import { AttendanceProvider } from '@contexts/AttendanceContext';
import { LeaveDashboardProvider } from '@contexts/LeaveDashboardContext';
import { StudySessionOverviewProvider } from '@contexts/StudySessionOverviewContext';
import { SurveyDashboardProvider } from '@contexts/SurveyDashboardContext';
import { CourseProvider } from '@contexts/CourseContext';
import { ImageSessionProvider } from '@contexts/ImageSessionContext';
import { FaceVerifyProvider } from '@contexts/FaceVerifyContext';

import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <PersonnelProfileProvider>
          <CourseProvider>
            <TeacherScheduleProvider>
              <ClassSessionStudentsProvider>
                <AttendanceProvider>
                  <ImageSessionProvider>
                  <FaceVerifyProvider>
                  <LeaveDashboardProvider>
                    <SurveyDashboardProvider>
                      <StudySessionOverviewProvider>
                        <AppRoutes />
                        <Toaster position="top-right" richColors />
                      </StudySessionOverviewProvider>
                    </SurveyDashboardProvider>
                  </LeaveDashboardProvider>
                  </FaceVerifyProvider>
                  </ImageSessionProvider>
                </AttendanceProvider>
              </ClassSessionStudentsProvider>
            </TeacherScheduleProvider>
          </CourseProvider>
        </PersonnelProfileProvider>
      </NotificationProvider>
    </AuthProvider>

  )
}

export default App